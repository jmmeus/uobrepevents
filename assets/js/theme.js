/**
 * Theme Toggle System
 * Handles light/dark mode switching with localStorage persistence
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'theme-preference';
  const THEME_ATTR = 'data-theme';
  const LIGHT = 'light';
  const DARK = 'dark';

  /**
   * Get stored theme preference or system preference
   * @returns {string} 'light' or 'dark'
   */
  function getThemePreference() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK;
    }

    return LIGHT;
  }

  /**
   * Apply theme to document
   * @param {string} theme - 'light' or 'dark'
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute(THEME_ATTR, theme);
  }

  /**
   * Save theme preference to localStorage
   * @param {string} theme - 'light' or 'dark'
   */
  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const current = document.documentElement.getAttribute(THEME_ATTR);
    const next = current === LIGHT ? DARK : LIGHT;

    applyTheme(next);
    saveTheme(next);
  }

  /**
   * Initialize theme system
   */
  function initTheme() {
    // Apply theme immediately (before page render)
    const theme = getThemePreference();
    applyTheme(theme);

    // Set up toggle button when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
      const toggleBtn = document.getElementById('theme-toggle');

      if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
      }
    });

    // Listen for system theme changes (optional enhancement)
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Only auto-switch if user hasn't set a preference
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? DARK : LIGHT);
        }
      });
    }
  }

  // Initialize immediately
  initTheme();
})();
