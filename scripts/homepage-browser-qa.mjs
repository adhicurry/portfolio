import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../homepage');
const output = path.join(root, '../.homepage-qa', process.env.QA_LABEL || 'release-local'); fs.mkdirSync(output, {recursive:true});
const data = JSON.parse(fs.readFileSync(path.join(root,'content.json'),'utf8'));
const url = process.env.QA_URL || 'http://127.0.0.1:8131/';
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
try{
 ({targetId:target}=await cmd('Target.createTarget',{url:'about:blank'},true));
 ({sessionId:session}=await cmd('Target.attachToTarget',{targetId:target,flatten:true},true));
 await cmd('Page.enable');await cmd('Runtime.enable');await cmd('Network.enable');
 await cmd('Emulation.setDeviceMetricsOverride',{width:1360,height:1000,deviceScaleFactor:1,mobile:false});
 await cmd('Page.navigate',{url});await until('document.readyState==="complete"');await delay(300);
 check('single-document-h1',await ev('document.querySelectorAll("h1").length===1'));
 check('no-network-for-initial-page',!requests.some(r=>/^https?:/.test(r) && !initialRequest(r)));
 check('no-initial-model-or-viewer',await ev('!document.querySelector("model-viewer")'));
 check('unique-ids',await ev('(()=>{const a=[...document.querySelectorAll("[id]")].map(e=>e.id);return a.length===new Set(a).size})()'));
 check('internal-links-resolve',await ev(`[...document.querySelectorAll('a')].filter(a=>a.getAttribute('href').startsWith('#')).every(a=>a.hash.length>1&&document.getElementById(decodeURIComponent(a.hash.slice(1))))`));
 check('local-project-links',await ev('![...document.querySelectorAll("a")].some(a=>a.getAttribute("href").startsWith("/projects/"))'));
 const allText=await ev('document.body.textContent');
 for(const p of [...data.academicProjects,...data.personalProjects])check('project-'+p.slug,allText.includes(p.title));
 const normalize=s=>s.replace(/\s+/g,' ').trim();
 for(const [i,p] of [...data.publications,...data.additionalPublications].entries())check('citation-'+i,normalize(allText).includes(normalize(p.citation)));
 check('personal-sections-removed',await ev(`!document.getElementById('background') && ![...document.querySelectorAll('h2,h3')].some(h=>['Background','Patent applications','Awards'].includes(h.textContent.trim()))`));
 const pantry="document.getElementById('project-recipe-generator-ai-native-ios-app')";
 const expectedPersonal=['agent-cad-local-modeling-workflow','guitar-partscaster-build-and-onboard-effects','pixel-sentinel-repurposed-android-security-camera','recipe-generator-ai-native-ios-app','ai-website-builder-local-business-demo-pipeline'];
 check('requested-project-order',JSON.stringify(await ev('[...document.querySelectorAll("#projects > article")].slice(0,5).map(p=>p.id.replace("project-",""))'))===JSON.stringify(expectedPersonal));
 check('footer-github-absent',await ev(`![...document.querySelectorAll('footer a')].some(a=>/github/i.test(a.href))`));
 check('footer-email-absent',await ev(`!document.querySelector('a[href^="mailto:"]')`));
 await ev('document.querySelector(".skip").focus();true');
 await cmd('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
 await cmd('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
 check('keyboard-skip-to-main',await ev('document.activeElement.id==="main"'));
 await ev('history.replaceState(null,"",location.pathname);true');
 check('pantry-only-composite-image',await ev(`${pantry}.querySelectorAll('img').length===1`));
 check('pantry-image-in-closed-details',await ev(`(()=>{const i=${pantry}.querySelector('img'),d=i.closest('details');return d&&!d.open&&!i.checkVisibility()})()`));
 await ev(`${pantry}.querySelector('summary').click();true`);
 check('pantry-image-visible-after-expand',await ev(`${pantry}.querySelector('img').checkVisibility()`));
 await ev(`${pantry}.querySelector('summary').click();true`);
 check('publications-collapsed-bucket',await ev(`(()=>{const d=document.querySelector('#papers > details');return d&&!d.open&&d.querySelector('summary h2').textContent==='Publications'&&d.querySelectorAll('[id^="paper-"]').length===${data.publications.length+data.additionalPublications.length}})()`));
 await ev('document.querySelector("#papers > details > summary").click();true');
 check('publications-expand-shows-citations',await ev('[...document.querySelectorAll("#papers [id^=paper-] > p")].every(p=>p.checkVisibility())'));
 await ev('document.querySelector("#papers > details > summary").click();true');
 await ev('document.activeElement.blur();scrollTo({top:0,behavior:"instant"});true');await delay(100);
 await screenshot('desktop-home');
 await ev('document.querySelectorAll("details").forEach(d=>d.open=true);true');
 await ev('(async()=>{for(const i of document.images){i.loading="eager";await i.decode();}return true})()');
 check('all-images-embedded-and-decoded',await ev('[...document.images].every(i=>i.src.startsWith("data:image/")&&i.complete&&i.naturalWidth>0)'));
 check('mypantrychef-sample-disclosure',/sample|demo ingredients/i.test(allText));
 for(const width of [1360,768,390,320]){
   await cmd('Emulation.setDeviceMetricsOverride',{width,height:950,deviceScaleFactor:1,mobile:width<500});await delay(200);
   check('all-content-no-overflow-'+width,await ev('document.documentElement.scrollWidth<=innerWidth'));
 }
 await cmd('Emulation.setDeviceMetricsOverride',{width:390,height:950,deviceScaleFactor:1,mobile:true});
 await ev('document.querySelectorAll("details").forEach(d=>d.open=false);scrollTo({top:0,behavior:"instant"});true');await delay(300);await screenshot('mobile-home');
 await cmd('Emulation.setDeviceMetricsOverride',{width:1360,height:1000,deviceScaleFactor:1,mobile:false});
 await ev('location.hash="projects";true');await delay(300);await screenshot('desktop-projects');
 check('no-network-before-3d',!requests.some(r=>/^https?:/.test(r) && !initialRequest(r)));
 // Optional 3D is online only, and must work even from a file:// preview.
 await ev('document.querySelectorAll("details").forEach(d=>d.open=true);document.getElementById("cad-load").scrollIntoView({block:"center"});document.getElementById("cad-load").click();true');
 await until('document.querySelector("model-viewer")?.loaded');await delay(1200);
 check('first-cad-renders-from-local-file',await ev('document.querySelector("model-viewer").getDimensions().y>0'));
 const modelOptions=await ev('[...document.getElementById("cad-model").options].map(o=>o.value)');check('two-cad-models',modelOptions.length===2);
 await ev(`(()=>{const s=document.getElementById('cad-model');s.value=${JSON.stringify(modelOptions[1])};s.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);
 await until('document.querySelector("model-viewer")?.loaded && document.querySelector("model-viewer").src.includes("les-paul")');await delay(1200);
 check('second-cad-renders',await ev('document.querySelector("model-viewer").getDimensions().y>0'));
 await ev('document.querySelector("model-viewer").scrollIntoView({block:"center"});true');await delay(450);
 const v="document.querySelector('model-viewer')";
 const box=await ev(`(()=>{const b=${v}.getBoundingClientRect();return{x:b.x+b.width/2,y:b.y+b.height/2}})()`);
 const theta=await ev(`${v}.getCameraOrbit().theta`);
 await cmd('Input.dispatchMouseEvent',{type:'mousePressed',...box,button:'left',clickCount:1});
 for(let i=1;i<=8;i++)await cmd('Input.dispatchMouseEvent',{type:'mouseMoved',x:box.x+i*10,y:box.y,button:'left',buttons:1});
 await cmd('Input.dispatchMouseEvent',{type:'mouseReleased',x:box.x+80,y:box.y,button:'left',clickCount:1});await delay(650);
 check('cad-pointer-orbit',Math.abs(await ev(`${v}.getCameraOrbit().theta`)-theta)>.05);
 const radius=await ev(`${v}.getCameraOrbit().radius`);
 await cmd('Input.dispatchMouseEvent',{type:'mouseMoved',...box});
 await cmd('Input.dispatchMouseEvent',{type:'mouseWheel',...box,deltaX:0,deltaY:-100});await delay(650);
 check('cad-wheel-zoom',await ev(`${v}.getCameraOrbit().radius`)<radius);
 await ev('document.getElementById("cad-reset").click();true');await delay(650);await screenshot('desktop-cad');
 await cmd('Emulation.setDeviceMetricsOverride',{width:320,height:844,deviceScaleFactor:1,mobile:true});
 await ev('document.querySelector("model-viewer").scrollIntoView({block:"center"});true');await delay(1200);
 check('cad-mobile-no-overflow',await ev('document.documentElement.scrollWidth<=innerWidth'));
 check('cad-mobile-full-model-fit',await ev(`(()=>{const g=${v},d=g.getDimensions(),b=g.getBoundingClientRect(),h=2*(g.getCameraOrbit().radius-d.z/2)*Math.tan(g.getFieldOfView()*Math.PI/360);return h>d.y&&h*b.width/b.height>d.x})()`));
 await ev('document.querySelector("model-viewer").scrollIntoView({block:"center"});true');await screenshot('mobile-cad');
 await cmd('Network.setBlockedURLs',{urls:['*model-viewer.min.js*']});
 await cmd('Page.navigate',{url});await until('document.readyState==="complete"');
 await ev('document.getElementById("cad-load").click();true');
 await until('document.getElementById("cad-status").textContent.includes("could not load")');
 check('offline-viewer-useful-error',await ev('!document.getElementById("cad-load").disabled && !document.getElementById("cad-poster").hidden'));
 await cmd('Network.setBlockedURLs',{urls:[]});await ev('document.getElementById("cad-load").click();true');
 await until('document.querySelector("model-viewer")?.loaded');check('viewer-retry-recovers',true);
 await ev('document.querySelectorAll("details").forEach(d=>d.open=false);location.hash="project-recipe-generator-ai-native-ios-app";true');await delay(250);
 check('project-deep-link-opens-notes',await ev('document.querySelector("#project-recipe-generator-ai-native-ios-app details").open'));
 await ev('document.querySelectorAll("details").forEach(d=>d.open=false);location.hash=document.querySelector("#papers li[id]").id;true');await delay(250);
 check('publication-deep-link-opens-bucket',await ev('document.querySelector("#papers > details").open'));
 check('native-publications-disclosure',await ev('getComputedStyle(document.querySelector(".publications-bucket > summary")).display==="list-item"'));
 check('no-javascript-exceptions',errors.length===0);ok=true;
}catch(e){console.error(e);checks.push({name:'failure',passed:false,error:String(e)});}
finally{const result={ok,url,browser:version.Browser,checks,errors,network:requests.filter(r=>/^https?:/.test(r)),nativeSafari:'not tested'};fs.writeFileSync(path.join(output,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(target)await cmd('Target.closeTarget',{targetId:target},true);ws.close();if(!ok)process.exitCode=1;}
