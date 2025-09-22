
# Mental Health Act Section — CarePlanner Module (v0.1.0)

A drop-in module that adds a **Mental Health Act** section with **statutory** and **clinical practice** forms.

- JSON-driven schemas (easy to search and replace)
- Vanilla HTML/JS renderer (no build step)
- Print/PDF-ready styles
- LocalStorage draft saving
- Hooks for reminders/validation and CarePlanner events

> Designed for HSE psychiatric services in Ireland; aligns with MHC JSF 2025 items and HSE ICP guidance.

## Folder Map
- `schema/statutory/` — Locked schemas mirroring MHC statutory forms (samples included).
- `schema/clinical/` — Clinical practice forms (ICP, Risk, Obs/Leave).
- `ui/` — HTML/CSS/JS for the module (mount this as a new tab/route).
- `demo/` — Standalone demo page.
- `registry.json` — Master list of forms and metadata.

## Quick Start (Standalone)
1. Open `demo/demo.html` in a browser (or host via GitHub Pages).
2. Pick a form from the left pane, complete, **Save Draft**, **Validate**, **Print/PDF**.

## Integrate into CarePlanner
1. Copy the whole `mh-act/` folder into your project, e.g. `modules/mh-act/`.
2. Add a tab/route: **Mental Health Act** → load `ui/mh-act.html` in an iframe or inject into your SPA view.
3. Update `ui/mh-act.js` `CONFIG.app` to point to your app’s patient/team context getters.
4. Wire events:
   - On observation/leave change ⇒ call `window.MH_ACT.onObsChange(level)` to prompt risk & statutory checks.
   - On restrictive practice start/stop ⇒ call `window.MH_ACT.onRestrictivePractice(event)`.
5. PDF: Use the browser **Print** dialog; print CSS ensures official layout. (You can replace with your PDF service.)

## JSON Schema Conventions (minimalist)

```
{
  "id": "statutory.form7.renewal_order",
  "title": "Renewal Order (Form 7)",
  "type": "form",
  "sections": [
    {
      "title": "Patient & Admission",
      "fields": [
        {"key": "patient.name", "label": "Patient Name", "type": "text", "required": true, "autofill": "patient.name"},
        {"key": "patient.dob", "label": "Date of Birth", "type": "date", "required": true, "autofill": "patient.dob"}
      ]
    }
  ],
  "validation": [
    {"rule": "required", "fields": ["patient.name","patient.dob"]}
  ],
  "print": {"header": "templates/header.html", "footer": "templates/footer.html"}
}
```

## Replace/Extend
- To replace a form: edit its JSON in `schema/.../*.json`.
- To add new forms: copy an existing file, add to `registry.json`.

## Disclaimer
**Statutory forms must match MHC specifications.** Replace sample schemas with the official field set your service uses. This module ships **examples** only.
