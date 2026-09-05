import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, '..');
const sitePublic = path.join(siteRoot, 'public');
const input = ['content.json', 'source-content.json'].map(f => path.join(here, f)).find(fs.existsSync);
if (!input) throw new Error('No content.json or source-content.json found');
const content = JSON.parse(fs.readFileSync(input, 'utf8'));
const localRequire = createRequire(import.meta.url);
const nextRequire = createRequire(localRequire.resolve('next/package.json'));
const sharp = nextRequire('sharp');

const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inline = s => escape(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => { const target = u.startsWith('/projects/') ? `#project-${u.slice('/projects/'.length)}` : u.startsWith('/') ? `#${u.slice(1)}` : u; return target.startsWith('#') ? `<a href="${escape(target)}">${t}</a>` : `<a href="${escape(target)}" rel="noreferrer">${t}</a>`; });
function markdown(md='') {
  const out=[]; let para=[]; let list=[];
  const flush=()=>{ if(para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para=[]; } if(list.length) { out.push(`<ul>${list.map(x=>`<li>${inline(x)}</li>`).join('')}</ul>`); list=[]; } };
  for (const raw of md.split(/\r?\n/)) { const l=raw.trim(); if(!l){flush();continue;} if(/^#{1,3} /.test(l)){flush(); const n=l.match(/^#+/)[0].length; out.push(`<h${Math.min(n+2,4)}>${inline(l.replace(/^#+ /,''))}</h${Math.min(n+2,4)}>`);} else if(/^[-*] /.test(l)) { if(para.length) flush(); list.push(l.slice(2)); } else if(/^!\[/.test(l)){ flush(); const m=l.match(/^!\[([^\]]*)\]\(([^)]+)\)/); if(m) out.push(imageTag(m[2],m[1])); } else para.push(l); }
  flush(); return out.join('');
}
const imageMap = {
  '/projects/neutron-cooling.png':'projects/neutron-cooling.png', '/projects/neutron-cooling-fig1.png':'projects/neutron-cooling-fig1.png', '/projects/neutron-cooling-fig4.png':'projects/neutron-cooling-fig4.png',
  '/projects/swiss-roll-combustor.png':'projects/swiss-roll-combustor.png', '/projects/dimpled-channels-ml.png':'projects/dimpled-channels-ml.png', '/projects/dimpled-channels-ml-fig4.png':'projects/dimpled-channels-ml-fig4.png', '/projects/dimpled-channels-ml-fig5.png':'projects/dimpled-channels-ml-fig5.png', '/projects/hydrogel-scaffolds.png':'projects/hydrogel-scaffolds.png', '/projects/hydrogel-scaffolds-fig1.png':'projects/hydrogel-scaffolds-fig1.png', '/projects/mypantrychef/overview.webp':'projects/mypantrychef/overview.webp', '/guitar-build.jpg':'guitar-build.jpg', '/guitar-wiring-breadboard.jpg':'guitar-wiring-breadboard.jpg', '/demos/gt-guitar/assets/poster.webp':'demos/gt-guitar/assets/poster.webp', '/demos/agent-cad/assets/les-paul-poster.webp':'demos/agent-cad/assets/les-paul-poster.webp', '/demos/agent-cad/assets/building-poster.webp':'demos/agent-cad/assets/building-poster.webp'
};
const cache = new Map();
async function prepareImages(){
  for (const [src, rel] of Object.entries(imageMap)) {
    const file=path.join(sitePublic,rel);
    if(!fs.existsSync(file)) throw new Error(`Missing image: ${file}`);
    const buf = await sharp(file).rotate().resize({width:1200, withoutEnlargement:true}).webp({quality:78}).toBuffer();
    cache.set(src, `data:image/webp;base64,${buf.toString('base64')}`);
  }
}
function dataImage(src){
  if(!src) return '';
  if(cache.has(src)) return cache.get(src);
  throw new Error(`Image was not embedded: ${src}`);
}
function imageTag(src, alt='') { return `<img loading="lazy" src="${dataImage(src)}" alt="${escape(alt)}">`; }
function project(p){ const id=`project-${p.slug}`; const imgs=[]; if(p.image) imgs.push(imageTag(p.image,p.title)); const body=markdown(p.longDescription||p.description); const tech=(p.technologies||[]).map(escape).join(' · '); return `<article id="${id}" class="entry project"><h3>${escape(p.title)}</h3><p class="meta">${escape(p.organization||'')}${p.dates?' · '+escape(p.dates):''}</p>${p.description?`<p class="lede">${inline(p.description)}</p>`:''}<details><summary>Read the project notes</summary><div class="prose">${imgs.join('')}${p.slug==='recipe-generator-ai-native-ios-app'?'<p class="note">Prototype screenshots, with sample ingredients and a sample recipe.</p>':''}${body}</div></details>${tech?`<p class="tags">${tech}</p>`:''}${p.slug==='agent-cad-local-modeling-workflow'?cadGallery():''}</article>`; }
function cadGallery() {
  return `<section id="cad" class="cad" aria-labelledby="cad-heading"><h4 id="cad-heading">CAD models</h4><label for="cad-model">Model</label><div class="cad-controls"><select id="cad-model"><option value="gt-partscaster">GT partscaster</option><option value="les-paul">Les Paul · dual humbuckers</option><option value="boa-atlanta">Bank of America Plaza · Atlanta</option></select><button type="button" id="cad-load">Load 3D model</button><button type="button" id="cad-reset" hidden>Reset view</button></div><p id="cad-status" role="status" aria-live="polite">Choose a model to load (internet required).</p><div id="cad-viewer" class="cad-viewer" hidden><div id="cad-render"></div><img id="cad-poster" src="${dataImage('/demos/gt-guitar/assets/poster.webp')}" data-gt="${dataImage('/demos/gt-guitar/assets/poster.webp')}" data-lp="${dataImage('/demos/agent-cad/assets/les-paul-poster.webp')}" data-boa="${dataImage('/demos/agent-cad/assets/building-poster.webp')}" alt="CAD model preview"></div></section>`;
}
const acad=content.academicProjects||[], personal=[...(content.personalProjects||[])], pubs=content.publications||[], add=content.additionalPublications||[], researchProjects=acad.filter(p=>p.category!=='independent'), independentProjects=acad.filter(p=>p.category==='independent');
// Presentation order only; keep the canonical content snapshot unchanged.
const pantryIndex=personal.findIndex(p=>p.slug==='recipe-generator-ai-native-ios-app');
if(pantryIndex<0) throw new Error('MyPantryChef is missing');
const [pantry]=personal.splice(pantryIndex,1);
const pixelIndex=personal.findIndex(p=>p.slug==='pixel-sentinel-repurposed-android-security-camera');
if(pixelIndex<0) throw new Error('Pixel Sentinel is missing');
personal.splice(pixelIndex+1,0,pantry);
await prepareImages();
const publication = (p, i) => `<li id="paper-${escape(p.slug||`entry-${i+1}`)}"><p>${p.href?`<a href="${escape(p.href)}" rel="noreferrer">${escape(p.citation)}</a>`:escape(p.citation)}${p.note?` <span class="note">(${escape(p.note)})</span>`:''}</p>${p.longDescription?`<details><summary>Notes on this paper</summary><div class="prose">${markdown(p.longDescription)}</div></details>`:''}</li>`;
const css=fs.readFileSync(path.join(here,'theme.css'),'utf8'), js=fs.readFileSync(path.join(here,'interactions.js'),'utf8');
const page=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${escape(content.description)}"><link rel="canonical" href="https://portfolio.dakshhomelab.com/"><meta property="og:title" content="${escape(content.name)} — ${escape(content.location)}"><meta property="og:description" content="${escape(content.description)}"><meta property="og:url" content="https://portfolio.dakshhomelab.com/"><meta property="og:type" content="website"><meta name="twitter:card" content="summary"><title>${escape(content.name)} — ${escape(content.location)}</title><style>${css}</style></head><body><a class="skip" href="#main">Skip to content</a><header><div><p class="utility">${escape(content.location)}</p><h1>${escape(content.name)}</h1><p class="intro">${inline(content.description)}</p></div><nav aria-label="Primary"><a href="#research">research</a><a href="#projects">projects</a><a href="#papers">publications</a><a href="#contact">contact</a></nav></header><main id="main" tabindex="-1"><section id="research"><h2>Research</h2><div class="overview">${markdown(content.summary||'')}</div>${researchProjects.map(project).join('')}</section><section id="projects"><h2>Projects</h2>${personal.map(project).join('')}${independentProjects.map(project).join('')}</section><section id="papers"><details class="publications-bucket"><summary><h2>Publications</h2></summary><div class="publication-content"><ol class="papers">${pubs.map(publication).join('')}</ol>${add.length?`<h3>Additional publications</h3><ol class="papers">${add.map((p,i)=>publication(p,i+pubs.length)).join('')}</ol>`:''}</div></details></section></main><footer id="contact"><h2>Contact</h2><p>${Object.values(content.contact?.social||{}).filter(x=>!['Send Email','GitHub'].includes(x.name)).map(x=>`<a href="${escape(x.url)}" rel="noreferrer">${escape(x.name)}</a>`).join(' · ')}</p></footer><script>${js}</script></body></html>`;
fs.writeFileSync(path.join(here,'index.html'),page);
console.log(`Built ${path.join(here,'index.html')} from ${path.basename(input)}; embedded ${cache.size} images.`);
