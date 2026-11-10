# Public catalog pages

`npm run build` runs Vite, then `scripts/generate-public-pages.mjs`. The generator reads the same published category and active service endpoints as the website, creates static HTML under `dist/categories/` and `dist/businesses/`, and writes `dist/sitemap.xml`.

The Vercel project should use `npm run build` as its Build Command and `dist` as its Output Directory. A plain `vite build` creates the app bundle but does not generate the catalog pages.

The generated pages show backend category names, businesses, and services in the initial HTML response. This lets search crawlers read them without executing the customer app. Service links on desktop open the existing website service detail and availability flow; phone links open the Helpy app download link. The root page continues to use the existing customer app.

The sanitized `catalog-snapshot.json` contains only public catalog fields and is the fallback when the API is unavailable during a build. To reproduce pages from that snapshot without making API calls, run `HELPY_SEO_SNAPSHOT_ONLY=1 node scripts/generate-public-pages.mjs` after `vite build` (PowerShell: `$env:HELPY_SEO_SNAPSHOT_ONLY='1'; node scripts/generate-public-pages.mjs`). A successful live build refreshes the snapshot locally. Commit a refreshed snapshot when published businesses change substantially so offline builds remain representative.

These pages are snapshots from the build, so new catalog changes appear in search pages after the next website deployment. Empty categories remain browseable but are marked `noindex` and omitted from the sitemap until a business is listed.
