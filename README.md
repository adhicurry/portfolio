# Daksh Adhikari — personal website

Minimal personal homepage: research, personal projects, publications, and contact links.
Hosting policy: **Tailscale-only while work continues. Do not publish or resume Vercel without new explicit owner approval.**

Private endpoint: https://swarm.tail3d46e3.ts.net:8132/
The Vercel project is paused; its domains and deployments are preserved, not deleted. The old public domains are not the current review links. Private hosting operations live in the sibling `../private-host/README.md`.

## Source of truth

- `homepage/content.json` — current approved copy. Edit this, not the retired V1 data module.
- `homepage/theme.css` — paper/serif layout and responsive styles.
- `homepage/interactions.js` — deep links and opt-in interactive CAD gallery.
- `homepage/build.mjs` — embeds optimized images, CSS and JavaScript into `homepage/index.html`.
- `public/` — retained image and 3D model/runtime assets. Do not remove them when updating the homepage.

The standalone homepage is served by a static Next.js route handler. Existing V1 section, project and publication URLs redirect to the matching homepage anchors. The old design is no longer served; its source history is retained in Git. `src/data/resume.tsx` is legacy reference data, not the current homepage source.

## Build and test

```sh
npm ci
npm run build
npm start -- --hostname 127.0.0.1 --port 8131
```

`npm run build` regenerates the standalone HTML before building Next.js. It has no dependency on a sibling draft directory.

With a Chrome CDP browser available on `127.0.0.1:9222`:

```sh
QA_URL=http://127.0.0.1:8131/ node scripts/homepage-browser-qa.mjs
```

Browser receipts/screenshots are written to `.homepage-qa/` and should not be committed. Testing covers content inventory, responsive widths down to 320px, keyboard navigation, disclosures, both 3D models, orbit/zoom and load retry. Native iPhone Safari is not covered by these automated checks.

## Hosting and future publication

Current reviews use the private host, not Vercel. Keep the Vercel project `daksh-portfolio` paused; do not create another public project, repoint DNS, enable Funnel, or publish automatically. Preserve the source and existing Vercel project for a possible future launch.

Any future public launch requires fresh owner approval and site-wide `noindex` (including appropriate response headers for downloads), followed by live checks on every domain and deployment alias. `robots.txt` alone is not an indexing block, and `noindex` is not access control. Existing search listings may persist until removed or recrawled.

The GitHub source repository is a public fork; making the hosted site private does not change repository visibility. Do not push further content or change repository visibility without clarifying the separate repository-privacy scope.

See `docs/homepage-migration.md` for migration details. The repository derives from Dillion Verma's MIT-licensed portfolio template; retain `LICENSE`.
