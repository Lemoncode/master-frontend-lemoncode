const themeToggle = document.getElementById('theme-toggle');

document.addEventListener('DOMContentLoaded', () => {
  if (themeToggle && themeToggle instanceof HTMLInputElement) {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    themeToggle.checked = currentTheme === 'dark';

    themeToggle.addEventListener('change', () => {
      const newTheme = themeToggle.checked ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
    });
  }
});
