const viewer = document.querySelector('#guitar');
const status = document.querySelector('#status');
const load = document.querySelector('#load');
const spin = document.querySelector('#spin');
const controls = [...document.querySelectorAll('.toolbar button')];
let initialRadius = 1;
let isLoaded = false;
window.previewErrors = [];
window.addEventListener('error', event => window.previewErrors.push(event.message));
window.addEventListener('unhandledrejection', event => window.previewErrors.push(String(event.reason)));

function stopSpin() {
  viewer.autoRotate = false;
  spin.setAttribute('aria-pressed', 'false');
}
function fitOrbit(theta) {
  // The component's effective vertical FOV changes on responsive resize.
  // Reusing a desktop percentage radius crops a tall object on narrow screens.
  const dimensions = viewer.getDimensions();
  const box = viewer.getBoundingClientRect();
  const tangent = Math.tan(viewer.getFieldOfView() * Math.PI / 360);
  const distance = Math.max(dimensions.y / (2 * tangent),
    dimensions.x / (2 * tangent * box.width / box.height));
  initialRadius = distance * 1.12 + dimensions.z / 2;
  viewer.cameraOrbit = `${theta}deg 90deg ${initialRadius}m`;
}
function setView(theta) {
  stopSpin();
  viewer.resetTurntableRotation();
  viewer.cameraTarget = 'auto auto auto';
  fitOrbit(theta);
  status.textContent = theta === 180 ? 'Rear view. Drag to explore.' : 'Front view. Drag to explore.';
}
load.addEventListener('click', async () => {
  load.disabled = true;
  load.textContent = 'Loading…';
  status.textContent = 'Loading the interactive model…';
  try {
    await customElements.whenDefined('model-viewer');
    viewer.src = './assets/guitar-web.glb?rev=cfa61e55cd61';
  } catch (error) {
    window.previewErrors.push(String(error));
    status.textContent = 'Could not initialize 3D. The static preview is still available.';
    load.disabled = false;
    load.textContent = 'Retry 3D';
  }
});
viewer.addEventListener('progress', event => {
  const progress = event.detail.totalProgress;
  document.querySelector('#progress-fill').style.width = `${progress * 100}%`;
});
viewer.addEventListener('load', () => {
  isLoaded = true;
  viewer.dismissPoster();
  fitOrbit(0);
  controls.forEach(button => button.disabled = false);
  if (!document.querySelector('.stage').requestFullscreen) {
    document.querySelector('#fullscreen').hidden = true;
  }
  status.textContent = 'Ready · Drag to rotate · Scroll or pinch to zoom';
  document.querySelector('#progress-fill').style.width = '0%';
  viewer.setAttribute('tabindex', '0');
});
viewer.addEventListener('error', event => {
  isLoaded = false;
  controls.forEach(button => button.disabled = true);
  status.textContent = '3D could not load. The static preview remains available; try reloading the page.';
  load.textContent = 'Reload to retry';
  load.disabled = false;
  load.onclick = () => location.reload();
  window.previewErrors.push(`model-viewer: ${event.detail?.type || 'load error'}`);
});
viewer.addEventListener('pointerdown', stopSpin);
viewer.addEventListener('wheel', stopSpin, {passive:true});
document.querySelector('#front').addEventListener('click', () => setView(0));
document.querySelector('#rear').addEventListener('click', () => setView(180));
document.querySelector('#reset').addEventListener('click', () => setView(0));
spin.addEventListener('click', () => {
  viewer.autoRotate = !viewer.autoRotate;
  spin.setAttribute('aria-pressed', String(viewer.autoRotate));
  status.textContent = viewer.autoRotate ? 'Auto-rotating · Drag or press Auto-rotate to stop' : 'Rotation paused';
});
function zoom(factor) {
  stopSpin();
  const orbit = viewer.getCameraOrbit();
  const radius = Math.max(initialRadius * .15, Math.min(initialRadius * 1.7, orbit.radius * factor));
  viewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${radius}m`;
}
document.querySelector('#zoom-in').addEventListener('click', () => zoom(.8));
document.querySelector('#zoom-out').addEventListener('click', () => zoom(1.25));
document.querySelector('#fullscreen').addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.querySelector('.stage').requestFullscreen();
  } catch {
    status.textContent = 'Fullscreen is unavailable here. Rotation and zoom still work.';
  }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) stopSpin(); });
new ResizeObserver(() => {
  if (isLoaded) requestAnimationFrame(() => requestAnimationFrame(() => setView(0)));
}).observe(viewer);
// The site creates this iframe only after the visitor explicitly opens 3D.
// Direct standalone visits keep their original click-to-load behavior.
if (new URLSearchParams(location.search).get('autoload') === '1') {
  document.documentElement.classList.add('embedded');
  load.click();
}
// No automatic motion on page load; even reduced-motion users can explicitly opt in.
window.previewState = () => ({loaded:isLoaded, errors:[...window.previewErrors], orbit:viewer.getCameraOrbit?.(), autoRotate:viewer.autoRotate});
