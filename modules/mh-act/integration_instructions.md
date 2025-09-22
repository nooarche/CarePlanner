
# Integrating the MH Act Module into CarePlanner

1. **Copy folder**: Put this directory into your repo as `modules/mh-act/`.
2. **Route/tab**: Create a new tab "Mental Health Act" that renders `modules/mh-act/ui/mh-act.html`.
   - If you use a single HTML: add an `<iframe src="modules/mh-act/ui/mh-act.html"></iframe>` inside the tab container.
3. **Context wiring**:
   - In `ui/mh-act.js`, replace the `ctx.autofill` mock with calls to your app's patient context store.
   - Provide `patientId`, `patient.name`, `dob`, `mrn`, `admission.date`, `team.consultant`.
4. **Events**: from your app, when obs/leave changes or restrictive practice occurs, call:
   ```js
   window.MH_ACT?.onObsChange(level);
   window.MH_ACT?.onRestrictivePractice({ type:"seclusion", start: new Date().toISOString() });
   ```
5. **Schemas**: replace sample JSON in `schema/statutory/` with your service’s official field sets. Add more forms and update `registry.json`.
6. **Printing**: The module uses browser print for PDF. You can swap to your server-side PDF later.
7. **Theming**: Tweak `ui/mh-act.css` to match HSE palette.

> Tip: keep schemas as the **single source of truth**. UI auto-renders from them.
