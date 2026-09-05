"use client";

import { useState } from "react";

const VIEWER_URL = "/demos/gt-guitar/index.html";

export function GtGuitarViewer() {
  const [open, setOpen] = useState(false);

  return (
    <section aria-labelledby="guitar-viewer-heading" className="space-y-4 border-t border-border pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-primary">Interactive 3D preview</p>
          <h2 id="guitar-viewer-heading" className="text-xl font-semibold">Explore the partscaster</h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          aria-controls="gt-guitar-viewer"
          aria-expanded={open}
        >
          {open ? "Close 3D viewer" : "Open 3D viewer"}
        </button>
      </div>
      <div id="gt-guitar-viewer">
        {open ? (
          <iframe
            title="Interactive 3D viewer for the GT Partscaster"
            src={`${VIEWER_URL}?autoload=1&rev=cfa61e55cd61-site1`}
            className="h-[min(760px,78vh)] min-h-[460px] w-full rounded-xl border border-border bg-[#09111c]"
            allow="fullscreen"
          />
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            Rotate and zoom the model. The 9.4 MB preview downloads only when you open it; the build photo above stays available.
          </p>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Drag to rotate, scroll or pinch to zoom. Auto-rotation is optional.{" "}
        <a href={VIEWER_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">
          Open the standalone viewer ↗
        </a>
      </p>
    </section>
  );
}
