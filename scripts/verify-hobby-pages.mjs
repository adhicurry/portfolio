// Route/content/responsive regression checks using the existing Chrome CDP service.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const base = process.env.SITE_URL || 'http://127.0.0.1:8131';
const manifest = JSON.parse(fs.readFileSync(process.env.MANIFEST || '/tmp/portfolio-after-hobby-polish.json', 'utf8'));
const out = process.env.QA_OUT || '/tmp/portfolio-hobby-qa';
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
try {
  ({ targetId: target } = await cmd('Target.createTarget', { url: 'about:blank' }, true));
  ({ sessionId: session } = await cmd('Target.attachToTarget', { targetId: target, flatten: true }, true));
  await cmd('Page.enable'); await cmd('Runtime.enable');
  for (const width of [1440, 390]) {
    await cmd('Emulation.setDeviceMetricsOverride', { width, height: 950, deviceScaleFactor: 1, mobile: width < 500 });
    for (const route of manifest.routes) {
      const response = await fetch(base + route.path);
      assert.equal(response.status, 200, route.path);
      await cmd('Page.navigate', { url: base + route.path });
      await until(`document.readyState === 'complete' && !!document.querySelector('main h1')`);
      await delay(200);
      const state = await ev(`({ text: document.querySelector('main').innerText, overflow: document.documentElement.scrollWidth > innerWidth, images: [...document.querySelectorAll('main img')].filter(i => i.getAttribute('loading') !== 'lazy').every(i => i.complete && i.naturalWidth > 0) })`);
      assert(state.text.includes(route.title), `Missing title: ${route.path}`);
      assert(!state.overflow, `Overflow ${width}: ${route.path}`);
      assert(state.images, `Broken image: ${route.path}`);
      if (route.path === '/projects') { assert(state.text.includes('MyPantryChef')); assert(state.text.includes('Agent CAD')); assert(!/SatChat|satellite imagery/i.test(state.text)); }
      if (route.path.includes('guitar-partscaster')) {
        assert(!/Amplifier switcher|4PDT|Captor X/i.test(state.text));
        assert(await ev(`!!document.querySelector('article img[src="/guitar-wiring-breadboard.jpg"]')`));
      }
      if (route.path === '/projects/recipe-generator-ai-native-ios-app') {
        const media = await ev(`(async()=>{
          const images=[...document.querySelectorAll('main img')].filter(i=>{const u=new URL(i.src);return (u.searchParams.get('url')||u.pathname).includes('/projects/mypantrychef/');});
          for(const i of images){i.scrollIntoView({block:'center'});await i.decode();}
          window.scrollTo(0,0);
          return images.map(i=>{const url=new URL(i.src);return {src:url.searchParams.get('url')||url.pathname,loaded:i.complete&&i.naturalWidth>0};});
        })()`);
        for(const name of ['overview.webp','home.png','pantry.png','settings.png','recipe.png','cook-mode.png']) {
          assert(media.some(i=>i.src.endsWith('/'+name)&&i.loaded), `Missing/broken MyPantryChef screenshot ${name}`);
        }
        assert(/sample|demo/i.test(state.text), 'Prototype screenshot disclosure missing');
      }
      checks.push({ route: route.path, width, passed: true });
      if (['/projects', '/projects/recipe-generator-ai-native-ios-app', '/projects/agent-cad-local-modeling-workflow'].includes(route.path)) {
        const image = await cmd('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
        fs.writeFileSync(path.join(out, `${route.path.split('/').pop()}-${width}.png`), Buffer.from(image.data, 'base64'));
      }
    }
  }
  const removed = await fetch(base + '/projects/satchat-vision-llm-for-satellite-imagery');
  assert.equal(removed.status, 404);
  checks.push({ removedRoute404: true, passed: true });
  assert.equal(errors.length, 0, 'Browser JavaScript exceptions');
  ok = true;
} catch (error) {
  console.error(error);
  checks.push({ passed: false, error: String(error) });
} finally {
  const result = { ok, base, browser: version.Browser, checks, errors, screenshots: out, nativeIOS: 'not tested' };
  fs.writeFileSync(path.join(out, 'pages-verification.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  if (target) await cmd('Target.closeTarget', { targetId: target }, true);
  ws.close();
  if (!ok) process.exitCode = 1;
}
