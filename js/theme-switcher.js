/* ==========================================================================
   DYNAMIC THEME SWITCHER
   ========================================================================== */

/**
 * Switches the global body attribute data-theme
 * @param {string} themeName - Theme identifier (e.g., 'farm', 'astronaut')
 */
function switchTheme(themeName) {
  const body = document.getElementById('app-body');
  
  if (!body || !themeName) return;

  if (body.getAttribute('data-theme') !== themeName) {
    body.setAttribute('data-theme', themeName);
  }
}