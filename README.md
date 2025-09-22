# CarePlanner Split Structure

This archive contains the modularised starter version of CarePlanner with:
- `web/index.html`: new admin shell
- `web/legacy/index.html`: original ICP preserved
- `src/core`, `src/modules`, `src/ui` split for clarity

---

## Patch: HSE Theme + Admin Preferences

Added:
- `web/assets/theme-hse.css` (HSE-aligned CSS tokens + utilities)
- `web/themes.json` (selectable palettes)
- `web/src/utils/theme.js` (runtime theme loader)
- `web/src/ui/components/perm-matrix.js` (role×module permissions matrix UI)
- `web/src/ui/screens/admin-preferences.js` (Appearance + Modules & Roles)
- `web/src/models/modules.json` (modules list for permissions)

Modified:
- `web/index.html` (loads `theme-hse.css`)
- `web/src/app.js` (initialises theme on load)
- `web/src/ui/screens/admin.js` (tabs: Team / Preferences)

How to try locally:
1. Serve `web/` via a simple static server (because ES module imports).
   - Python: `cd web && python3 -m http.server 8080`
2. Open `http://localhost:8080/` → Admin → Preferences.
3. Change Theme; it persists in `localStorage`.
4. Adjust permissions in the matrix (console logs writes; wire to backend when ready).

Search handles (to find/replace later):
- `[[HANDLE: THEME_RUNTIME]]`
- `[[HANDLE: PERMISSIONS_MATRIX_UI]]`
- `[[HANDLE: ADMIN_PREFERENCES_UI]]`
- `[[HANDLE: ROUTER + THEME_INIT]]`
