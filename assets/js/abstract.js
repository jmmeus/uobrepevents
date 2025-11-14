/**
 * Abstract Toggle System
 * Handles global and per-talk abstract visibility
 */

(function() {
  'use strict';

  let globalState = false; // false = hidden, true = shown

  /**
   * Toggle visibility of a single abstract
   * @param {HTMLElement} button - The toggle button
   * @param {boolean} show - Whether to show (true) or hide (false)
   */
  function toggleAbstract(button, show) {
    const container = button.closest('.abstract-container');
    if (!container) return;

    const content = container.querySelector('.abstract-content');
    const icon = button.querySelector('.toggle-icon');
    const text = button.querySelector('.toggle-text');

    if (!content) return;

    if (show) {
      content.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      if (text) text.textContent = 'Hide abstract';
    } else {
      content.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      if (text) text.textContent = 'Show abstract';
    }
  }

  /**
   * Toggle all abstracts
   * @param {boolean} show - Whether to show all or hide all
   */
  function toggleAllAbstracts(show) {
    const buttons = document.querySelectorAll('.abstract-toggle-btn');
    buttons.forEach(button => toggleAbstract(button, show));

    // Update global toggle button text
    const globalBtn = document.getElementById('abstract-global-toggle');
    const globalText = document.getElementById('abstract-toggle-text');

    if (globalBtn && globalText) {
      globalText.textContent = show ? 'Hide all abstracts' : 'Show all abstracts';
    }
  }

  /**
   * Initialize abstract toggle system
   */
  function initAbstractToggles() {
    // Global toggle button
    const globalBtn = document.getElementById('abstract-global-toggle');
    if (globalBtn) {
      globalBtn.addEventListener('click', function() {
        globalState = !globalState;
        toggleAllAbstracts(globalState);
      });
    }

    // Individual toggle buttons
    const toggleButtons = document.querySelectorAll('.abstract-toggle-btn');
    toggleButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();

        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        toggleAbstract(button, !isExpanded);
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAbstractToggles);
  } else {
    initAbstractToggles();
  }
})();
