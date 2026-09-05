"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { CAD_GALLERY_MODELS } from "./cad-gallery-data";

type ModelViewer = HTMLElement & {
  src: string;
  autoRotate: boolean;
  cameraOrbit: string;
  cameraTarget: string;
  dismissPoster: () => void;
  getCameraOrbit: () => { theta: number; phi: number; radius: number };
  getDimensions: () => { x: number; y: number; z: number };
  getFieldOfView: () => number;
  maxCameraOrbit: string;
  resetTurntableRotation: () => void;
};

const VIEWER_SCRIPT = "/demos/gt-guitar/vendor/model-viewer.min.js";
const MAX_LOCAL_BYTES = 50 * 1024 * 1024;
const buttonClass = "min-h-11 rounded-lg border border-border px-3 text-sm disabled:opacity-40";
let bundlePromise: Promise<void> | undefined;

function loadViewerBundle(attempt: number) {
  if (customElements.get("model-viewer")) return Promise.resolve();
  if (bundlePromise) return bundlePromise;
  bundlePromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = `${VIEWER_SCRIPT}?attempt=${attempt}`;
    const timer = window.setTimeout(() => fail(), 20000);
    function fail() {
      clearTimeout(timer);
      script.remove();
      bundlePromise = undefined;
      reject(new Error("The 3D viewer could not start. The static preview is still available. Try again below."));
    }
    script.onerror = fail;
    script.onload = () => {
      customElements.whenDefined("model-viewer").then(() => {
        clearTimeout(timer);
        resolve();
      });
    };
    document.head.appendChild(script);
  });
  return bundlePromise;
}

function fitView(viewer: ModelViewer, theta = 0) {
  const size = viewer.getDimensions();
  const box = viewer.getBoundingClientRect();
  if (!box.width || !box.height) return;
  const tangent = Math.tan(viewer.getFieldOfView() * Math.PI / 360);
  const radius = Math.max(size.y / (2 * tangent), size.x / (2 * tangent * box.width / box.height)) * 1.12 + size.z / 2;
  viewer.maxCameraOrbit = `auto auto ${radius * 4}m`;
  viewer.cameraTarget = "auto auto auto";
  viewer.cameraOrbit = `${theta}deg 90deg ${radius}m`;
}

async function validateLocalGlb(file: File) {
  if (!file.name.toLowerCase().endsWith(".glb")) throw new Error("Choose a self-contained .glb file.");
  if (file.size > MAX_LOCAL_BYTES) throw new Error("Choose a .glb smaller than 50 MiB for a local preview.");
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  if (buffer.byteLength < 20 || view.getUint32(0, true) !== 0x46546c67 || view.getUint32(4, true) !== 2 || view.getUint32(8, true) !== buffer.byteLength) {
    throw new Error("This file is not a complete binary glTF 2.0 model.");
  }
  const jsonLength = view.getUint32(12, true);
  if (view.getUint32(16, true) !== 0x4e4f534a || jsonLength + 20 > buffer.byteLength) throw new Error("The .glb JSON chunk is invalid.");
  const gltf = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 20, jsonLength)));
  // Reject external URIs, including extension references, before the viewer can fetch them.
  function checkUris(value: unknown): void {
    if (!value || typeof value !== "object") return;
    for (const [key, entry] of Object.entries(value)) {
      if (key === "uri" && typeof entry === "string" && !entry.startsWith("data:")) throw new Error("This model references external files. Export a self-contained .glb to keep the preview local.");
      checkUris(entry);
    }
  }
  checkUris(gltf);
  if (gltf.extensionsUsed?.some((name: string) => /draco|meshopt|basisu/i.test(name))) throw new Error("For local preview, export an uncompressed GLB with embedded textures (no external decoders).");
}

export function CadGallery() {
  const [selectedId, setSelectedId] = useState(CAD_GALLERY_MODELS[0].id);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [status, setStatus] = useState("The 3D model downloads only when you open the viewer.");
  const [localFile, setLocalFile] = useState<{ url: string; name: string }>();
  const [attempt, setAttempt] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ModelViewer | null>(null);
  const fileRequest = useRef(0);
  const selected = CAD_GALLERY_MODELS.find(model => model.id === selectedId)!;
  const displayName = localFile?.name || selected.shortName;
  const standalone = `/demos/agent-cad/index.html?model=${selected.id === "les-paul" ? "lp" : selected.id === "boa-atlanta" ? "boa" : "gt"}`;

  useEffect(() => () => { if (localFile) URL.revokeObjectURL(localFile.url); }, [localFile]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let cleanup = () => {};
    loadViewerBundle(attempt).then(() => {
      if (cancelled || !stageRef.current) return;
      const viewer = document.createElement("model-viewer") as ModelViewer;
      viewer.setAttribute("alt", `${displayName}, interactive 3D model`);
      viewer.setAttribute("camera-controls", "");
      viewer.setAttribute("touch-action", "pan-y");
      viewer.setAttribute("loading", "eager");
      viewer.setAttribute("reveal", "manual");
      viewer.setAttribute("environment-image", "neutral");
      viewer.setAttribute("shadow-intensity", "0.3");
      viewer.style.cssText = "display:block;width:100%;height:100%;background:radial-gradient(circle at 50% 40%,#273749,#0b1420)";
      let ready = false;
      const stopSpin = () => { viewer.autoRotate = false; if (!cancelled) setSpinning(false); };
      const onHidden = () => { if (document.hidden) stopSpin(); };
      const onLoad = () => {
        if (cancelled) return;
        ready = true;
        viewer.dismissPoster();
        fitView(viewer);
        setLoaded(true);
        setStatus(`${displayName} loaded. Drag to rotate; scroll or pinch to zoom.`);
      };
      const onError = () => {
        if (cancelled) return;
        ready = false;
        stopSpin();
        setLoaded(false);
        setStatus(`${displayName} could not load. Try again, or choose another model.`);
      };
      viewer.addEventListener("load", onLoad);
      viewer.addEventListener("error", onError);
      viewer.addEventListener("pointerdown", stopSpin);
      viewer.addEventListener("wheel", stopSpin, { passive: true });
      document.addEventListener("visibilitychange", onHidden);
      const resize = new ResizeObserver(() => {
        if (ready) fitView(viewer, viewer.getCameraOrbit().theta * 180 / Math.PI);
      });
      resize.observe(viewer);
      stageRef.current.replaceChildren(viewer);
      viewerRef.current = viewer;
      viewer.src = localFile?.url || `${selected.modelUrl}?rev=${selected.revision}&attempt=${attempt}`;
      cleanup = () => {
        ready = false;
        viewer.autoRotate = false;
        resize.disconnect();
        document.removeEventListener("visibilitychange", onHidden);
        viewer.removeEventListener("load", onLoad);
        viewer.removeEventListener("error", onError);
        viewer.remove();
      };
    }).catch(error => { if (!cancelled) setStatus(error.message); });
    return () => { cancelled = true; cleanup(); viewerRef.current = null; };
  }, [open, selected, localFile, attempt, displayName]);

  function prepareLoad() {
    setLoaded(false);
    setSpinning(false);
    setStatus(`Loading ${displayName}…`);
  }
  function chooseModel(id: string) {
    fileRequest.current++;
    setLocalFile(undefined);
    setSelectedId(id);
    setLoaded(false);
    setSpinning(false);
    setAttempt(0);
    setStatus(open ? "Loading selected model…" : "The 3D model downloads only when you open the viewer.");
  }
  async function previewFile(file?: File) {
    if (!file) return;
    const request = ++fileRequest.current;
    try {
      await validateLocalGlb(file);
      if (request !== fileRequest.current) return;
      prepareLoad();
      setLocalFile({ url: URL.createObjectURL(file), name: file.name });
      setOpen(true);
      setAttempt(0);
    } catch (error) {
      if (request === fileRequest.current) setStatus(error instanceof Error ? error.message : "Could not read this file.");
    }
  }
  function reset(theta: number) {
    const viewer = viewerRef.current;
    if (!viewer || !loaded) return;
    viewer.autoRotate = false;
    viewer.resetTurntableRotation();
    setSpinning(false);
    fitView(viewer, theta);
  }

  return (
    <section aria-labelledby="cad-gallery-heading" className="space-y-4 border-t border-border pt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm text-primary">Interactive CAD gallery</p><h2 id="cad-gallery-heading" className="text-xl font-semibold">Explore the models</h2></div>
        <label className="flex min-w-0 max-w-full flex-col gap-2 text-sm text-muted-foreground">
          Model
          <select value={selectedId} onChange={event => chooseModel(event.target.value)} className="min-h-11 w-full max-w-full rounded-lg border border-border bg-background px-3 text-foreground" aria-label="Select a CAD model">
            {CAD_GALLERY_MODELS.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}
          </select>
        </label>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{localFile ? `Local preview: ${localFile.name}` : selected.description}</p>
      <div id="cad-gallery-stage" className="relative h-[min(70vh,680px)] min-h-[400px] overflow-hidden rounded-xl border border-border bg-[#0b1420]">
        {open && <div ref={stageRef} className="absolute inset-0" />}
        {!loaded && <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {localFile ? <p className="px-6 text-center text-sm text-muted-foreground">Your local model preview will appear here.</p> : <img src={selected.posterUrl} alt={`${selected.name} static preview`} className="h-full w-full object-contain" />}
        </div>}
        {!open && <button type="button" onClick={() => { prepareLoad(); setOpen(true); }} className="absolute bottom-4 left-1/2 min-h-11 -translate-x-1/2 whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg" aria-controls="cad-gallery-stage">Explore in 3D</button>}
      </div>
      <div className="flex flex-wrap gap-2">
        {open && <>
          <button type="button" disabled={!loaded} onClick={() => reset(0)} className={buttonClass}>Front</button>
          <button type="button" disabled={!loaded} onClick={() => reset(180)} className={buttonClass}>Rear</button>
          <button type="button" disabled={!loaded} onClick={() => reset(0)} className={buttonClass}>Reset view</button>
          <button type="button" disabled={!loaded} aria-pressed={spinning} onClick={() => { if (viewerRef.current) { viewerRef.current.autoRotate = !spinning; setSpinning(!spinning); } }} className={buttonClass}>{spinning ? "Pause rotation" : "Auto-rotate"}</button>
          <button type="button" onClick={() => { prepareLoad(); setAttempt(value => value + 1); }} className={buttonClass}>Retry 3D</button>
          <button type="button" onClick={() => { fileRequest.current++; setOpen(false); setLoaded(false); setSpinning(false); setLocalFile(undefined); setStatus("Viewer closed. No model downloads until you reopen it."); }} className={buttonClass}>Close</button>
        </>}
        <label className={`${buttonClass} inline-flex cursor-pointer items-center focus-within:ring-2 focus-within:ring-primary`}>
          Preview local .glb
          <input aria-label="Preview a local GLB file" type="file" accept=".glb,model/gltf-binary" className="sr-only" onChange={event => { void previewFile(event.target.files?.[0]); event.target.value = ""; }} />
        </label>
        {!localFile && <a href={standalone} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-3 text-sm text-primary underline underline-offset-4">Standalone viewer ↗</a>}
      </div>
      <p role="status" aria-live="polite" className="text-sm leading-6 text-muted-foreground">{status}</p>
      <p className="text-xs leading-5 text-muted-foreground">These are visual previews, not manufacturing files. Local GLB files stay in your browser; selecting one does not publish it. Self-contained, uncompressed GLB only, up to 50 MiB.</p>
    </section>
  );
}
