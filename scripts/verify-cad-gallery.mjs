// Route/content/responsive regression checks using the existing Chrome CDP service.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const base = process.env.SITE_URL || 'http://127.0.0.1:8131';

const out = process.env.QA_OUT || '/tmp/portfolio-cad-final-qa';
fs.mkdirSync(out, { recursive: true });
const version = await (await fetch('http://127.0.0.1:9222/json/version')).json();
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
let seq = 0, session, target;
const pending = new Map(), errors = [], checks = [];
ws.addEventListener('message', event => {
  const msg = JSON.parse(event.data);
  if (pending.has(msg.id)) { const p = pending.get(msg.id); clearTimeout(p.timer); pending.delete(msg.id); msg.error ? p.reject(Error(JSON.stringify(msg.error))) : p.resolve(msg.result); }
  if (msg.sessionId === session && msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails);
});
function cmd(method, params = {}, browser = false) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    const timer = setTimeout(() => { pending.delete(id); reject(Error(`${method} timeout`)); }, 30000);
    pending.set(id, { resolve, reject, timer });
    ws.send(JSON.stringify({ id, method, params, ...(!browser && session ? { sessionId: session } : {}) }));
  });
}
async function ev(expression) {
  const result = await cmd('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(expression) {
  for (let i = 0; i < 150; i++) { if (await ev(expression)) return; await delay(200); }
  throw Error(`Timed out: ${expression}`);
}
let ok = false;
const route = '/projects/agent-cad-local-modeling-workflow';
const v = "document.querySelector('model-viewer')";
const requests = [];
ws.addEventListener('message', event => { const m = JSON.parse(event.data); if(m.sessionId === session && m.method === 'Network.requestWillBeSent') requests.push(m.params.request); });
async function click(text) { await ev(`[...document.querySelectorAll('main button')].find(b=>b.textContent === ${JSON.stringify(text)}).click(); true`); }
async function loaded() { await until(`${v}?.loaded && document.querySelector('[role="status"]')?.textContent.includes('loaded')`); await delay(1000); }
async function choose(id) { await ev(`(()=>{const s=document.querySelector('select');s.value=${JSON.stringify(id)};s.dispatchEvent(new Event('change',{bubbles:true}));return true})()`); }
async function fitCheck() {
  return ev(`(()=>{const g=${v},d=g.getDimensions(),o=g.getCameraOrbit(),b=g.getBoundingClientRect(),h=2*(o.radius-d.z/2)*Math.tan(g.getFieldOfView()*Math.PI/360);return h>d.y*1.05&&h*b.width/b.height>d.x*1.05})()`);
}
async function screen(name) { const image=await cmd('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(image.data,'base64')); }
function check(name,value) { checks.push({name,passed:!!value});assert(value,name); }
try {
 ({targetId:target}=await cmd('Target.createTarget',{url:'about:blank'},true));
 ({sessionId:session}=await cmd('Target.attachToTarget',{targetId:target,flatten:true},true));
 await cmd('Page.enable');await cmd('Runtime.enable');await cmd('Network.enable');await cmd('Network.setCacheDisabled',{cacheDisabled:true});
 await cmd('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await cmd('Page.navigate',{url:base+route});await until("!!document.querySelector('select')");await delay(500);
 check('no-model-or-bundle-before-opt-in',!requests.some(r=>r.method==='GET'&&/\.glb|model-viewer/.test(r.url)));
 check('two-model-options',await ev('document.querySelectorAll("select option").length===2'));
 check('poster-before-opt-in',await ev("[...document.querySelectorAll('main img')].some(i=>i.complete&&i.naturalWidth>0)"));
 await click('Explore in 3D');await loaded();check('gt-model-loaded',await ev(`${v}.src.includes('guitar-web.glb')`));check('gt-desktop-framing',await fitCheck());
 await ev(`${v}.scrollIntoView({block:'center'});true`);await delay(400);
 const box=await ev(`(()=>{const b=${v}.getBoundingClientRect();return{x:b.x+b.width/2,y:b.y+b.height/2}})()`);
 let orbit=await ev(`${v}.getCameraOrbit().theta`);
 await cmd('Input.dispatchMouseEvent',{type:'mousePressed',...box,button:'left',clickCount:1});
 for(let i=1;i<=10;i++)await cmd('Input.dispatchMouseEvent',{type:'mouseMoved',x:box.x+i*10,y:box.y,button:'left',buttons:1});
 await cmd('Input.dispatchMouseEvent',{type:'mouseReleased',x:box.x+100,y:box.y,button:'left',clickCount:1});await delay(700);
 check('pointer-orbit',Math.abs(await ev(`${v}.getCameraOrbit().theta`)-orbit)>.05);
 const radius=await ev(`${v}.getCameraOrbit().radius`);
 // Move the pointer onto the control before wheeling: CDP otherwise keeps the drag's hit target.
 await cmd('Input.dispatchMouseEvent',{type:'mouseMoved',...box});
 await cmd('Input.dispatchMouseEvent',{type:'mouseWheel',...box,deltaX:0,deltaY:-150});await delay(700);
 const zoomRadius = await ev(`${v}.getCameraOrbit().radius`); check('wheel-zoom',zoomRadius<radius);
 await click('Rear');await delay(800);check('rear-orbit',Math.abs(await ev(`${v}.getCameraOrbit().theta`)-Math.PI)<.05);
 await click('Reset view');await delay(800);check('reset-front',Math.abs(await ev(`${v}.getCameraOrbit().theta`))<.05);
 await click('Auto-rotate');await delay(3500);const rotation=await ev(`${v}.turntableRotation`);await delay(1200);
 check('rotation-progresses',Math.abs(await ev(`${v}.turntableRotation`)-rotation)>.01);
 await click('Pause rotation');check('rotation-pauses',await ev(`${v}.autoRotate===false`));
 await click('Auto-rotate');
 const other = await cmd('Target.createTarget',{url:'about:blank'},true);
 try {
   await cmd('Target.activateTarget',{targetId:other.targetId},true);
   await until('document.hidden');await delay(250);
   check('hidden-tab-stops-rotation',await ev(`${v}.autoRotate===false`));
 } finally { await cmd('Target.closeTarget',{targetId:other.targetId},true); }
 await cmd('Target.activateTarget',{targetId:target},true);await until('!document.hidden');
 await choose('les-paul');await until(`${v}?.src.includes('les-paul-web.glb')`);await loaded();check('les-paul-loads-on-switch',await ev(`${v}.loaded`));
 check('selection-resets-rotation',await ev(`${v}.autoRotate===false`));check('les-paul-fit',await fitCheck());
 check('selected-fallback',await ev("[...document.querySelectorAll('main a')].some(a=>a.href.includes('model=lp'))"));
 await ev(`${v}.scrollIntoView({block:'center'});true`);await screen('les-paul-desktop');
 for(const width of [390,320]){
   await cmd('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:true});await delay(1200);
   check('no-overflow-'+width,await ev('document.documentElement.scrollWidth<=innerWidth'));
   check('model-fit-'+width,await fitCheck());
 }
 await ev(`${v}.scrollIntoView({block:'center'});true`);await screen('les-paul-mobile');
 await cmd('DOM.enable');const doc=await cmd('DOM.getDocument');const input=await cmd('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'input[type=file]'});
 await cmd('DOM.setFileInputFiles',{nodeId:input.nodeId,files:[path.join(process.cwd(),'public/demos/gt-guitar/assets/guitar-web.glb')]});
 await until(`${v}?.src.startsWith('blob:')`);await loaded();check('local-file-renders',await ev(`${v}.loaded && ${v}.getAttribute('alt').includes('guitar-web.glb')`));
 await ev(`(()=>{const d=new DataTransfer();d.items.add(new File(['invalid'],'bad.glb',{type:'model/gltf-binary'}));const i=document.querySelector('input[type=file]');i.files=d.files;i.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);
 await until("document.querySelector('[role=status]').textContent.includes('not a complete')");check('invalid-file-rejected',true);
 await choose('gt-partscaster');await until(`${v}?.src.includes('/assets/guitar-web.glb')`);await loaded();
 await cmd('Network.setBlockedURLs',{urls:['*.glb*']});await click('Retry 3D');await until("document.querySelector('[role=status]').textContent.includes('could not load')");
 check('failed-model-keeps-poster',await ev("[...document.querySelectorAll('#cad-gallery-stage img')].some(i=>i.complete&&i.naturalWidth>0)"));
 const before=requests.length;await cmd('Network.setBlockedURLs',{urls:[]});await click('Retry 3D');await loaded();
 check('retry-fetches-model',requests.slice(before).some(r=>r.method==='GET'&&r.url.includes('.glb?')&&r.url.includes('attempt=2')));
 await cmd('Network.setBlockedURLs',{urls:['*model-viewer.min.js*']});await cmd('Page.navigate',{url:base+route});await until("!!document.querySelector('select')");await delay(300);await click('Explore in 3D');
 await until("document.querySelector('[role=status]').textContent.includes('could not start')");check('bundle-error-message',true);
 await cmd('Network.setBlockedURLs',{urls:[]});await click('Retry 3D');await loaded();check('bundle-retry-recovers',true);
 check('no-js-exceptions',errors.length===0);ok=true;
} catch(error){console.error(error);checks.push({passed:false,error:String(error)});}
finally{
 const result={ok,base,browser:version.Browser,checks,errors,requests:requests.filter(r=>r.url.includes('.glb')).map(r=>({url:r.url,method:r.method})),nativeIOS:'not tested'};
 fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 if(target)await cmd('Target.closeTarget',{targetId:target},true);ws.close();if(!ok)process.exitCode=1;
}
