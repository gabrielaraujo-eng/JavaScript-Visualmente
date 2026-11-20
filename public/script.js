(() => {
  const themeButton = document.querySelector('#theme-toggle');
  const storageKey = 'jsvisual.theme.v1';
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;

  function readTheme() {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved === 'light' || saved === 'dark' ? saved : (prefersLight ? 'light' : 'dark');
    } catch {
      return prefersLight ? 'light' : 'dark';
    }
  }

  function setTheme(theme, persist = false) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    if (!themeButton) return;
    themeButton.setAttribute('aria-pressed', String(theme === 'light'));
    themeButton.setAttribute('aria-label', theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro');
    if (persist) {
      try { window.localStorage.setItem(storageKey, theme); } catch { /* O tema funciona mesmo sem armazenamento local. */ }
    }
  }

  setTheme(readTheme());
  themeButton?.addEventListener('click', () => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light', true);
  });
})();
