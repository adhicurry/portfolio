(() => {
  function openHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const el = document.getElementById(id);
    if (!el) return;
    let parent = el.parentElement;
    while (parent) { if (parent.tagName === 'DETAILS') parent.open = true; parent = parent.parentElement; }
    if (el.matches('.project')) el.querySelector('details').open = true;
    requestAnimationFrame(() => el.scrollIntoView({block:'start'}));
  }
  window.addEventListener('hashchange', openHash);
  document.addEventListener('click', e => { const a=e.target.closest('a[href^="#"]'); if(a && a.hash===location.hash) openHash(); });
  openHash();

  // Hosted pages use their own deployed assets; standalone/private previews use the public site.
  const hosted=/^(portfolio\.|www\.)?dakshhomelab\.com$/.test(location.hostname) || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const preview=/\.ts\.net$/.test(location.hostname);
  const base=hosted && !preview ? location.origin : 'https://portfolio.dakshhomelab.com';
  const models={
    'gt-partscaster': {name:'GT partscaster',src:'/demos/gt-guitar/assets/guitar-web.glb',revision:'cfa61e55cd617fde1d99d54f15b11f005fe99a72fe60ddc5bdcb759a98cc2a2b',poster:'gt'},
    'les-paul': {name:'Les Paul',src:'/demos/agent-cad/assets/les-paul-web.glb',revision:'d22e017e6267d020a2017ac535ede5e4ee9a16559d8b3ae775ffa9554bbd6198',poster:'lp'},
    'boa-atlanta': {name:'Bank of America Plaza · Atlanta',src:'/demos/agent-cad/assets/building-web.glb',revision:'d2ea07f00c04ecbcdd32b617a75a2f821d7c624b5133832e5cabf1b67906aa77',poster:'boa'}
  };
  const select=document.getElementById('cad-model'), load=document.getElementById('cad-load');
  const status=document.getElementById('cad-status'), stage=document.getElementById('cad-viewer');
  const render=document.getElementById('cad-render'), poster=document.getElementById('cad-poster'), reset=document.getElementById('cad-reset');
  if(!load) return;
  let bundle, serial=0, attempt=0, current, observer, opened=false, modelTimer;
  function bundleReady() {
    if(customElements.get('model-viewer')) return Promise.resolve();
    if(bundle) return bundle;
    bundle=new Promise((resolve,reject)=>{
      const script=document.createElement('script'); script.type='module';
      script.src=base+'/demos/gt-guitar/vendor/model-viewer.min.js?preview='+attempt;
      let settled=false;
      const fail=()=>{if(settled)return;settled=true;clearTimeout(timer);script.remove();bundle=undefined;reject(Error('The 3D viewer could not load. Check the internet connection and try again.'));};
      const timer=setTimeout(fail,20000);
      script.onerror=fail;
      script.onload=()=>customElements.whenDefined('model-viewer').then(()=>{if(settled)return;settled=true;clearTimeout(timer);resolve();});
      document.head.append(script);
    });
    return bundle;
  }
  function fit(theta=0) {
    if(!current?.loaded) return;
    const d=current.getDimensions(), b=current.getBoundingClientRect();
    if(!b.width||!b.height) return;
    const tangent=Math.tan(current.getFieldOfView()*Math.PI/360);
    const radius=Math.max(d.y/(2*tangent),d.x/(2*tangent*b.width/b.height))*1.14+d.z/2;
    // The default max orbit clamps fitted distances after wheel zoom.
    current.maxCameraOrbit=`auto auto ${radius*4}m`;
    current.cameraTarget='auto auto auto'; current.cameraOrbit=`${theta}deg 90deg ${radius}m`;
  }
  async function show() {
    const token=++serial, item=models[select.value];
    attempt++; opened=true; clearTimeout(modelTimer); observer?.disconnect(); current=null;render.replaceChildren();
    stage.hidden=false; poster.src=poster.dataset[item.poster];poster.alt=item.name+' static preview';poster.hidden=false;
    reset.hidden=true;load.disabled=true;status.textContent='Loading '+item.name+'…';
    try {
      await bundleReady();if(token!==serial)return;
      const model=document.createElement('model-viewer');current=model;
      model.setAttribute('alt',item.name+' interactive 3D model');
      model.setAttribute('camera-controls','');model.setAttribute('touch-action','pan-y');
      model.setAttribute('loading','eager');model.setAttribute('reveal','manual');
      model.setAttribute('environment-image','neutral');model.setAttribute('interaction-prompt','none');
      model.setAttribute('camera-orbit','0deg 90deg auto');model.setAttribute('field-of-view',item.src.includes('building-web.glb')?'24deg':'30deg');
      const fail=()=>{if(token!==serial)return;clearTimeout(modelTimer);poster.hidden=false;load.disabled=false;load.textContent='Retry 3D';reset.hidden=true;status.textContent='The model could not load. The picture is still available; try again when online.';};
      model.addEventListener('error',fail);
      model.addEventListener('load',()=>{
        if(token!==serial)return;clearTimeout(modelTimer);model.dismissPoster();fit();poster.hidden=true;
        load.disabled=false;load.textContent='Reload model';reset.hidden=false;
        status.textContent=item.name+' loaded. Drag to turn; scroll or pinch to zoom.';
        observer=new ResizeObserver(()=>fit(model.getCameraOrbit().theta*180/Math.PI));observer.observe(model);
      });
      render.append(model);modelTimer=setTimeout(fail,30000);
      model.src=base+item.src+'?rev='+item.revision+'&attempt='+attempt;
    } catch(error) {
      if(token!==serial)return;
      load.disabled=false;load.textContent='Retry 3D';status.textContent=error.message;
    }
  }
  load.addEventListener('click',show);
  select.addEventListener('change',()=>{if(opened)show();});
  reset.addEventListener('click',()=>fit());
})();
