# GT guitar interactive preview

The guitar project page embeds a same-origin, self-hosted viewer after the visitor selects **Open 3D viewer**:

- Project: `/projects/guitar-partscaster-build-and-onboard-effects`
- Standalone: `/demos/gt-guitar/index.html`
- Component: `src/components/gt-guitar-viewer.tsx`
- Runtime: `public/demos/gt-guitar/`

Neither model-viewer nor the GLB is requested before opt-in. The iframe uses `autoload=1` to avoid a second load button; direct standalone visits remain click-to-load. Closing the viewer removes the iframe. The existing build photo and project copy are unchanged. The embedded layout keeps its controls in one viewport; full standalone explanatory text is hidden only in embed mode.

## Approved asset

GLB: 9,378,732 bytes, SHA-256 `cfa61e55cd617fde1d99d54f15b11f005fe99a72fe60ddc5bdcb759a98cc2a2b`.

This is the approved original photo-mask artwork with only the three bottom jack-area stripes cleaned up. Do not regenerate or reinterpret the paint during website edits. It is a simplified visual derivative, not a manufacturing model. Browser-delivered GLBs are publicly retrievable. The Apache-2.0 license in `vendor/LICENSE` covers model-viewer, not the source guitar geometry; no new blanket geometry license is asserted here.

## Security and updates

`next.config.mjs` preserves the site's security headers and overrides `X-Frame-Options` to `SAMEORIGIN` only under `/demos/gt-guitar/`. The GLB uses `model/gltf-binary` and a one-hour revalidating cache. HTML revalidates. Asset references are revisioned; change revision tokens when replacing their content. Never copy the 350 MB CAD master or internal source/path reports into `public/`.

To replace the model, copy only the approved GLB and matching poster, update revision references in the runtime and React component, then rebuild and verify the public model hash.

## Verification

Local production build, TypeScript, scoped ESLint, content invariants, and all 19 content-route HTTP/title checks passed. Actual Chrome/CDP integration checks passed for click-to-load, absence of pre-click model/bundle requests, drag orbit, wheel zoom, rotation progression, mobile overflow, complete model framing, visible controls, touch pinch, keyboard launch, and a deliberately blocked-model fallback. Screenshots were reviewed at desktop and 390px mobile width.

Native iPhone Safari and physical MacBook testing are not claimed. The regression harness and evidence live with the CAD preview project (`web-preview/test_site_embed.mjs`, `verify_site_release.py`, and `qa/site-local/` / `qa/site-public/`).
