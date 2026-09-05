# Agent CAD gallery handoff

## Scope

The project detail route renders `CadGallery` for the `agent-cad-local-modeling-workflow` slug. The gallery is a client-side, lazy opt-in viewer: the shared `@google/model-viewer` 4.3.1 bundle is loaded only after opening the viewer, and the GLB is requested only after that. The existing GT Partscaster and the approved Les Paul web derivative can be selected from one catalog.

The `Preview local .glb` control creates a browser-only object URL. It does not send files to a server, write to `public/`, or publish an upload. The standalone fallback is `/demos/agent-cad/index.html`.

## Adding an approved model

1. Produce and verify a visual-only GLB derivative outside this repository; retain the CAD master and native verification artifacts in `/Users/nexus/code/agent-cad/`.
2. Create a poster and copy only the approved GLB/poster into `public/demos/<stable-id>/assets/`.
3. Add an entry to `src/components/cad-gallery-data.ts` with a stable id, human name, asset URLs, revision (normally the SHA-256), and a bounded description. Keep private source provenance in release notes, never in the client catalog.
4. Update `public/demos/agent-cad/index.html` and `viewer.js` if the standalone selector should include the new model.
5. Record exact SHA-256 and byte sizes with the project release receipt. Do not replace CAD masters with web derivatives.

## Provenance

- GT Partscaster web GLB: SHA-256 `cfa61e55cd617fde1d99d54f15b11f005fe99a72fe60ddc5bdcb759a98cc2a2b` (existing asset).
- Les Paul web GLB: SHA-256 `d22e017e6267d020a2017ac535ede5e4ee9a16559d8b3ae775ffa9554bbd6198`, 10,249,560 bytes; release revision `d22e017e6267`.
- Les Paul poster: SHA-256 `0e21a1ab1130e0f8a665d9e458e287923f27bd80b916a1f6afe17bffc3d6b7ed`, 31,622 bytes.
- Viewer bundle: shared site copy of `@google/model-viewer` 4.3.1 at `public/demos/gt-guitar/vendor/`; its license and provenance remain next to that approved existing runtime.

The Les Paul handoff says its body silhouette/photo comparison and web asset checks passed, while strict aggregate STEP/STL fidelity is not accepted. The gallery therefore describes it as a visual approximation and makes no manufacturing-readiness claim.
