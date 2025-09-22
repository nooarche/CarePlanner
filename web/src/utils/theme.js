// [[HANDLE: THEME_RUNTIME]]
export async function applyTheme(name) {
  try {
    const res = await fetch('./themes.json', {cache:'no-store'});
    const themes = await res.json();
    const theme = themes[name] || themes['hse_default'];
    for (const [k, v] of Object.entries(theme.tokens)) {
      document.documentElement.style.setProperty(k, v);
    }
    localStorage.setItem('careplanner_theme', name);
  } catch(e) {
    console.error('Theme load error', e);
  }
}

export function initTheme() {
  const saved = localStorage.getItem('careplanner_theme') || 'hse_default';
  applyTheme(saved);
}
