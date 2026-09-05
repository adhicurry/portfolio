import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../homepage');
const output = path.join(root, '../.homepage-qa', process.env.QA_LABEL || 'boa-extra'); fs.mkdirSync(output, {recursive:true});
const data = JSON.parse(fs.readFileSync(path.join(root,'content.json'),'utf8'));
const url = process.env.QA_URL || 'http://127.0.0.1:55576/';
const initialRequest = r => r === url || r === new URL('/favicon.ico', url).href;
const version = await (await fetch('http://127.0.0.1:9222/json/version')).json();
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
let seq=0, session, target; const pending=new Map(), errors=[], requests=[], checks=[];
ws.addEventListener('message',event=>{
 const m=JSON.parse(event.data);
 if(pending.has(m.id)){const p=pending.get(m.id);clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}
 if(m.sessionId===session&&m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);
 if(m.sessionId===session&&m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);
});
function cmd(method,params={},browser=false){return new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>{pending.delete(id);reject(Error(method+' timeout'));},30000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params,...(!browser&&session?{sessionId:session}:{})}));});}
async function ev(expression){const r=await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function until(expression){for(let i=0;i<200;i++){if(await ev(expression))return;await delay(150);}throw Error('Timed out: '+expression);}
function check(name,value){checks.push({name,passed:!!value});assert(value,name);}
async function screenshot(name){const r=await cmd('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,name+'.png'),Buffer.from(r.data,'base64'));}
let ok=false;
const v="document.querySelector('#viewer')";
const fit=`(()=>{const g=${v},d=g.getDimensions(),b=g.getBoundingClientRect(),h=2*(g.getCameraOrbit().radius-d.z/2)*Math.tan(g.getFieldOfView()*Math.PI/360);return h>d.y&&h*b.width/b.height>d.x})()`;
try {
 ({targetId:target}=await cmd('Target.createTarget',{url:'about:blank'},true));
 ({sessionId:session}=await cmd('Target.attachToTarget',{targetId:target,flatten:true},true));
 await cmd('Page.enable');await cmd('Runtime.enable');await cmd('Network.enable');
 await cmd('Emulation.setDeviceMetricsOverride',{width:1200,height:1000,deviceScaleFactor:1,mobile:false});
 await cmd('Page.navigate',{url:new URL('/demos/agent-cad/index.html?model=boa',url).href});
 await until("document.readyState==='complete' && !!customElements.get('model-viewer')");
 check('standalone-tower-selected',await ev("document.querySelector('#model').value==='boa' && document.querySelector('#title').textContent.includes('Bank of America Plaza')"));
 check('standalone-no-initial-glb-get',!requests.some(r=>new URL(r).pathname.endsWith('.glb')));
 await ev("document.querySelector('#load').click();true");
 await until(`${v}.loaded && document.querySelector('#status').textContent.includes('loaded.')`);await delay(700);
 check('tower-exact-web-dimensions',await ev(`(()=>{const d=${v}.getDimensions();return Math.abs(d.y-.313)<.00001 && Math.abs(d.x-.0647)<.00001 && Math.abs(d.z-.0867)<.00001})()`));
 check('standalone-desktop-fit',await ev(fit));
 await ev(`${v}.scrollIntoView({block:'center'});true`);await screenshot('standalone-desktop');
 for (const [key,file] of [['gt','guitar-web.glb'],['lp','les-paul-web.glb'],['boa','building-web.glb']]) {
  await ev(`document.querySelector('#model').value='${key}';document.querySelector('#model').dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('#load').click();true`);
  await until(`${v}.loaded && ${v}.src.includes('${file}') && document.querySelector('#status').textContent.includes('loaded.')`);await delay(500);
  check('standalone-switch-'+key,await ev(`${v}.loaded`));
 }
 await cmd('Emulation.setDeviceMetricsOverride',{width:320,height:844,deviceScaleFactor:1,mobile:true});await delay(800);
 await ev(`${v}.scrollIntoView({block:'center'});true`);await delay(200);
 check('standalone-mobile-fit',await ev(fit));check('standalone-mobile-no-overflow',await ev('document.documentElement.scrollWidth<=innerWidth'));
 await screenshot('standalone-mobile');
 await cmd('Network.setBlockedURLs',{urls:['*building-web.glb*']});
 await ev("document.querySelector('#retry').click();true");
 await until("document.querySelector('#status').textContent.includes('could not load')");
 check('standalone-blocked-error',await ev("!document.querySelector('#load').disabled && document.querySelector('#poster').naturalWidth>0"));
 const failedSrc=await ev(`${v}.src`);
 await cmd('Network.setBlockedURLs',{urls:[]});await ev("document.querySelector('#load').click();true");
 await until(`${v}.loaded && document.querySelector('#status').textContent.includes('loaded.')`);
 check('standalone-main-retry-new-url',await ev(`${v}.src`)!==failedSrc);
 await cmd('Page.navigate',{url});await until("document.readyState==='complete'");
 await cmd('Network.setBlockedURLs',{urls:['*building-web.glb*']});
 await ev("document.querySelector('#cad-model').value='boa-atlanta';document.querySelector('#cad-load').click();true");
 await until("document.querySelector('#cad-status').textContent.includes('could not load')");
 check('homepage-blocked-tower-poster',await ev("!document.querySelector('#cad-poster').hidden && document.querySelector('#cad-poster').naturalWidth>0 && !document.querySelector('#cad-load').disabled"));
 const failedHome=await ev("document.querySelector('model-viewer').src");
 await cmd('Network.setBlockedURLs',{urls:[]});await ev("document.querySelector('#cad-load').click();true");
 await until("document.querySelector('model-viewer')?.loaded && document.querySelector('#cad-status').textContent.includes('loaded.')");
 check('homepage-retry-new-url',await ev("document.querySelector('model-viewer').src")!==failedHome);
 // Show an oblique view to distinguish real geometry from its poster.
 await ev("document.querySelector('model-viewer').cameraOrbit='35deg 80deg auto';document.querySelector('model-viewer').scrollIntoView({block:'center'});true");await delay(800);await screenshot('homepage-oblique-mobile');
 check('no-javascript-exceptions',errors.length===0);ok=true;
} catch(e) { console.error(e);checks.push({name:'failure',passed:false,error:String(e)}); }
finally {const result={ok,url,checks,errors,network:requests,nativeSafari:'not tested'};fs.writeFileSync(path.join(output,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(target)await cmd('Target.closeTarget',{targetId:target},true);ws.close();if(!ok)process.exitCode=1;}
