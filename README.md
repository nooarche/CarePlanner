# Careplanner PWA shell

This bundle provides a minimal offline shell for the **CarePlannerV1.html** app.

## Files
- `index.html` — PWA wrapper that embeds/links your planner
- `manifest.webmanifest` — PWA manifest (icons, name, theme)
- `sw.js` — service worker for offline caching
- `icons/apple-touch-icon.png` (180×180)
- `icons/icon-512.png` (512×512)

> Place **CarePlannerV1.html** in the **same folder** as `index.html`.

## GitHub Pages
1. Create a repo (or use existing). Put these files at the repository root (or the `docs/` folder if using that setting).
2. Commit and enable GitHub Pages (Settings → Pages).
3. Visit your site; the service worker will cache assets and the CarePlanner when first loaded.

## iPhone/iPad
- Open the site in Safari → Share → *Add to Home Screen*. The app will install with the included icon.
