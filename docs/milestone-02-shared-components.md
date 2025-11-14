# Milestone 2: Shared Components & Theming

## Overview

This milestone builds the global UI system that all event templates will use. It implements light/dark theme toggling, creates reusable header and footer components, and establishes the CSS architecture using CSS custom properties for consistent theming across all pages.

## Goals

- Implement light/dark theme toggle with persistent user preference
- Create shared header and footer includes
- Establish CSS architecture with responsive design
- Build JavaScript for theme management
- Ensure mobile responsiveness for all components

## Context & Architecture

### CSS Architecture

We use **CSS Custom Properties** (CSS variables) for theming:
- Define color/spacing/typography tokens in `:root`
- Override in `[data-theme="dark"]` selector
- All components reference variables, not hard-coded values
- This allows instant theme switching without reloading CSS

### JavaScript Architecture

Theme state management:
- Store user preference in `localStorage`
- Apply theme on page load before render (prevent flash)
- Toggle function updates both DOM and storage
- Works across page navigations (persistent)

### Component Architecture

**Includes** are reusable HTML fragments:
- `header.html` - Event metadata display
- `footer.html` - Site-wide footer content
- `theme-toggle.html` - Theme switch button
- Layouts will import these via `{% include header.html %}`

## Detailed Deliverables

### 1. Theme Toggle Component (`_includes/theme-toggle.html`)

**Purpose**: Provide a button to switch between light and dark themes.

**Requirements**:
- Button with sun/moon icon or text
- Accessible (proper ARIA labels)
- Positioned consistently (top-right of page)
- Calls JavaScript toggle function
- Works without JavaScript (graceful degradation)

**Specification**:
```html
<div class="theme-toggle-container">
  <button
    id="theme-toggle"
    class="theme-toggle-btn"
    aria-label="Toggle dark mode"
    title="Toggle theme">
    <span class="theme-icon theme-icon-light" aria-hidden="true">☀️</span>
    <span class="theme-icon theme-icon-dark" aria-hidden="true">🌙</span>
  </button>
</div>
```

**Styling Notes**:
- Position: fixed or absolute in top-right corner
- Should not overlap with content on mobile
- Icon visibility toggled based on current theme
- Smooth transition on theme change

### 2. Header Component (`_includes/header.html`)

**Purpose**: Display event metadata consistently across all event pages.

**Requirements**:
- Event name as H1
- Date (formatted human-readable)
- Time range (start - end)
- Location
- Responsive typography
- Works with Liquid variables passed from layouts

**Specification**:
```html
<header class="event-header">
  <h1 class="event-title">{{ include.event.name }}</h1>

  <div class="event-meta">
    <div class="event-meta-item">
      <span class="meta-label">Date:</span>
      <span class="meta-value">{{ include.event.date | date: "%-d %B %Y" }}</span>
    </div>

    <div class="event-meta-item">
      <span class="meta-label">Time:</span>
      <span class="meta-value">{{ include.event.start_time }} - {{ include.event.end_time }}</span>
    </div>

    <div class="event-meta-item">
      <span class="meta-label">Location:</span>
      <span class="meta-value">{{ include.event.location }}</span>
    </div>
  </div>

  {% if include.event.description %}
  <p class="event-description">{{ include.event.description }}</p>
  {% endif %}
</header>
```

**Usage**:
```liquid
{% include header.html event=event_data %}
```

### 3. Footer Component (`_includes/footer.html`)

**Purpose**: Provide consistent footer with source link, contact, and copyright.

**Requirements**:
- Link to repository source code
- Contact information (can be placeholder/configurable)
- Automatic copyright year
- Responsive layout
- Uses site config for dynamic values

**Specification**:
```html
<footer class="site-footer">
  <div class="footer-content">
    <div class="footer-section">
      <a href="{{ site.github.repository_url }}" class="source-link" target="_blank" rel="noopener">
        View Source on GitHub
      </a>
    </div>

    <div class="footer-section">
      <p class="footer-contact">
        Contact: <a href="mailto:{{ site.email | default: 'events@example.ac.uk' }}">{{ site.email | default: 'events@example.ac.uk' }}</a>
      </p>
    </div>

    <div class="footer-section">
      <p class="footer-copyright">
        © {{ 'now' | date: "%Y" }} {{ site.title }}
      </p>
    </div>
  </div>
</footer>
```

**Configuration** (add to `_config.yml`):
```yaml
email: "events@bham.ac.uk"  # Optional, falls back to example
github:
  repository_url: "https://github.com/username/repo"
```

### 4. Theme Stylesheet (`assets/css/theme.css`)

**Purpose**: Define CSS custom properties and base styles for theming.

**Requirements**:
- CSS custom properties for colors, spacing, typography
- Light theme (default)
- Dark theme via `[data-theme="dark"]`
- Smooth transitions on theme change
- Base typography and layout styles
- Responsive breakpoints
- No framework dependencies (vanilla CSS)

**Specification**:
```css
/* ============================================
   CSS Custom Properties (Design Tokens)
   ============================================ */

:root {
  /* Colors - Light Theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #e5e5e5;

  --text-primary: #1a1a1a;
  --text-secondary: #4a4a4a;
  --text-muted: #6a6a6a;

  --border-color: #d0d0d0;
  --border-color-light: #e8e8e8;

  --link-color: #0066cc;
  --link-hover: #004499;

  --button-bg: #0066cc;
  --button-text: #ffffff;
  --button-hover: #004499;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Typography */
  --font-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;

  /* Layout */
  --max-width: 1200px;
  --header-height: 60px;
}

/* Dark Theme Override */
[data-theme="dark"] {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #2a2a2a;

  --text-primary: #f1f1f1;
  --text-secondary: #c1c1c1;
  --text-muted: #909090;

  --border-color: #3a3a3a;
  --border-color-light: #2a2a2a;

  --link-color: #4d9fff;
  --link-hover: #70b3ff;

  --button-bg: #4d9fff;
  --button-text: #0a0a0a;
  --button-hover: #70b3ff;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.5);
}

/* ============================================
   Base Styles
   ============================================ */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-base);
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  transition: background-color var(--transition-base), color var(--transition-base);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  line-height: 1.2;
  margin-bottom: var(--space-md);
  font-weight: 600;
}

h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
h4 { font-size: var(--text-xl); }
h5 { font-size: var(--text-lg); }
h6 { font-size: var(--text-base); }

p {
  margin-bottom: var(--space-md);
}

a {
  color: var(--link-color);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--link-hover);
  text-decoration: underline;
}

/* Layout */
main {
  flex: 1;
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-xl) var(--space-md);
}

/* ============================================
   Theme Toggle Styles
   ============================================ */

.theme-toggle-container {
  position: fixed;
  top: var(--space-md);
  right: var(--space-md);
  z-index: 1000;
}

.theme-toggle-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-sm) var(--space-md);
  cursor: pointer;
  font-size: var(--text-xl);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.theme-toggle-btn:hover {
  background: var(--bg-tertiary);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.theme-toggle-btn:active {
  transform: translateY(0);
}

.theme-icon {
  display: inline-block;
  transition: opacity var(--transition-fast);
}

/* Show sun in dark mode, moon in light mode */
[data-theme="light"] .theme-icon-dark {
  display: inline-block;
}

[data-theme="light"] .theme-icon-light {
  display: none;
}

[data-theme="dark"] .theme-icon-light {
  display: inline-block;
}

[data-theme="dark"] .theme-icon-dark {
  display: none;
}

/* ============================================
   Header Styles
   ============================================ */

.event-header {
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-xl);
  border-bottom: 2px solid var(--border-color);
}

.event-title {
  margin-bottom: var(--space-lg);
  color: var(--text-primary);
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  margin-bottom: var(--space-md);
}

.event-meta-item {
  display: flex;
  gap: var(--space-sm);
  align-items: baseline;
}

.meta-label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.meta-value {
  color: var(--text-primary);
  font-size: var(--text-base);
}

.event-description {
  margin-top: var(--space-lg);
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ============================================
   Footer Styles
   ============================================ */

.site-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
  padding: var(--space-xl) var(--space-md);
}

.footer-content {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-lg);
  font-size: var(--text-sm);
}

.footer-section {
  color: var(--text-secondary);
}

.footer-contact,
.footer-copyright {
  margin: 0;
}

.source-link {
  font-weight: 500;
}

/* ============================================
   Responsive Design
   ============================================ */

@media (max-width: 768px) {
  :root {
    --text-4xl: 1.875rem;
    --text-3xl: 1.5rem;
    --text-2xl: 1.25rem;
  }

  .event-meta {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .theme-toggle-container {
    top: var(--space-sm);
    right: var(--space-sm);
  }
}

@media (max-width: 480px) {
  main {
    padding: var(--space-lg) var(--space-sm);
  }

  .theme-toggle-btn {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-lg);
  }
}

/* ============================================
   Utility Classes
   ============================================ */

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 5. Theme Toggle JavaScript (`assets/js/theme.js`)

**Purpose**: Handle theme switching logic and persistence.

**Requirements**:
- Check for stored theme preference on load
- Apply theme before page renders (prevent flash)
- Toggle between light/dark on button click
- Save preference to localStorage
- Respect system preference if no stored preference
- No framework dependencies (vanilla JS)

**Specification**:
```javascript
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
```

**Loading**: This script must be loaded in the `<head>` before the body renders to prevent flash of unstyled content:

```html
<script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
```

### 6. Update `_config.yml`

Add email configuration for footer:

```yaml
# Site contact
email: "events@example.ac.uk"

# GitHub repository (auto-populated by GitHub Pages, but can override)
github:
  repository_url: "https://github.com/username/repo"
```

## Implementation Steps

1. Create `_includes/theme-toggle.html`
2. Create `_includes/header.html`
3. Create `_includes/footer.html`
4. Create `assets/css/theme.css`
5. Create `assets/js/theme.js`
6. Update `_config.yml` with email and github fields
7. Create test page to verify components
8. Test theme toggle functionality
9. Test responsive behavior at multiple screen sizes

## Testing Procedures

### Test 1: Theme Toggle Functionality

**Objective**: Verify light/dark theme toggle works correctly.

**Setup**: Create a minimal test page `test-theme.html`:
```html
---
layout: none
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Theme Test</title>
  <link rel="stylesheet" href="{{ '/assets/css/theme.css' | relative_url }}">
  <script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
</head>
<body>
  {% include theme-toggle.html %}

  <main>
    <h1>Theme Toggle Test</h1>
    <p>This is test content to verify theme switching.</p>
    <a href="#">Test Link</a>
  </main>

  {% include footer.html %}
</body>
</html>
```

**Steps**:
1. Run `bundle exec jekyll serve`
2. Open `http://localhost:4000/test-theme.html`
3. Click the theme toggle button
4. Observe background and text colors change
5. Refresh the page
6. Verify theme persists after refresh
7. Open browser DevTools > Application > Local Storage
8. Verify `theme-preference` key exists with correct value

**Expected Results**:
- ✅ Initial load shows light or dark theme based on system preference
- ✅ Clicking toggle switches between light and dark instantly
- ✅ Colors change smoothly (text, background, links, buttons)
- ✅ Theme persists after page refresh
- ✅ localStorage contains theme preference
- ✅ No flash of unstyled content on load

### Test 2: Header Component Rendering

**Objective**: Verify header displays event metadata correctly.

**Setup**: Create test page `test-header.html`:
```html
---
layout: none
---
{% assign test_event = site.data.test_event | default: null %}
{% unless test_event %}
  {% assign test_event = '{"name":"Test Event","date":"2025-04-15","start_time":"14:30","end_time":"16:00","location":"Physics West 115","description":"This is a test description."}' | parse_json %}
{% endunless %}

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Header Test</title>
  <link rel="stylesheet" href="{{ '/assets/css/theme.css' | relative_url }}">
  <script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
</head>
<body>
  {% include theme-toggle.html %}
  <main>
    {% include header.html event=test_event %}
  </main>
</body>
</html>
```

Or manually create `_data/test_event.yml`:
```yaml
name: "Test Event"
date: "2025-04-15"
start_time: "14:30"
end_time: "16:00"
location: "Physics West 115"
description: "This is a test description."
```

**Steps**:
1. Run `bundle exec jekyll serve`
2. Open `http://localhost:4000/test-header.html`
3. Verify all fields display correctly
4. Check date formatting
5. Toggle theme and verify readability in both modes

**Expected Results**:
- ✅ Event name displays as H1
- ✅ Date shows formatted as "15 April 2025"
- ✅ Time shows as "14:30 - 16:00"
- ✅ Location displays correctly
- ✅ Description shows below metadata
- ✅ All text is readable in both light and dark modes
- ✅ Layout is properly spaced

### Test 3: Footer Component Rendering

**Objective**: Verify footer displays with correct links and content.

**Steps**:
1. Add to `_config.yml`:
   ```yaml
   email: "test@example.ac.uk"
   github:
     repository_url: "https://github.com/test/repo"
   ```
2. View any test page with footer included
3. Check footer content
4. Click "View Source on GitHub" link
5. Verify copyright year is current
6. Check email link

**Expected Results**:
- ✅ Footer appears at bottom of page
- ✅ GitHub link opens correct repository in new tab
- ✅ Email link opens mail client with correct address
- ✅ Copyright year is current (2025)
- ✅ Layout is clean and properly aligned
- ✅ Responsive on mobile (stacks vertically)

### Test 4: Mobile Responsiveness

**Objective**: Verify all components work on mobile screen sizes.

**Steps**:
1. Open test page in browser
2. Open DevTools (F12)
3. Enable device toolbar (responsive mode)
4. Test at these widths:
   - 320px (iPhone SE)
   - 375px (iPhone standard)
   - 768px (tablet)
   - 1024px (desktop)
5. Check each component at each size

**Expected Results**:
- ✅ Theme toggle remains accessible at all sizes
- ✅ Header metadata stacks vertically on mobile
- ✅ Footer content centers on mobile
- ✅ No horizontal scrolling at any size
- ✅ Text remains readable (not too small)
- ✅ Touch targets are at least 44x44px
- ✅ Spacing adapts appropriately

### Test 5: CSS Variables Applied

**Objective**: Verify CSS custom properties work correctly.

**Steps**:
1. Open test page
2. Open DevTools > Elements
3. Inspect `<html>` element
4. Click "Computed" tab
5. Search for "--bg-primary"
6. Toggle theme
7. Observe variable value changes

**Expected Results**:
- ✅ All CSS variables defined in `:root`
- ✅ Variables change when theme toggles
- ✅ Components use variables (not hard-coded colors)
- ✅ Transitions smooth between theme changes

### Test 6: Accessibility

**Objective**: Verify components are accessible.

**Steps**:
1. Navigate site using only keyboard:
   - Tab to theme toggle
   - Press Enter/Space to toggle
   - Tab through all links
2. Use screen reader (if available) to test:
   - ARIA labels on theme toggle
   - Link text clarity
   - Heading hierarchy
3. Check color contrast:
   - Use browser extension or online tool
   - Test text/background contrast in both themes
   - Aim for WCAG AA (4.5:1 for normal text)

**Expected Results**:
- ✅ All interactive elements keyboard accessible
- ✅ Theme toggle has proper ARIA label
- ✅ Focus indicators visible
- ✅ Heading hierarchy logical (H1, H2, H3, etc.)
- ✅ Color contrast meets WCAG AA
- ✅ Links have descriptive text

### Test 7: localStorage Edge Cases

**Objective**: Verify theme system handles edge cases.

**Steps**:
1. Open test page
2. Toggle theme to dark
3. Open DevTools > Application > Local Storage
4. Delete `theme-preference` key
5. Refresh page - should default to system preference
6. Manually set `theme-preference` to invalid value "invalid"
7. Refresh page - should fallback gracefully
8. Test in private/incognito mode (localStorage disabled in some cases)

**Expected Results**:
- ✅ Missing preference falls back to system preference
- ✅ Invalid preference handled gracefully (defaults to light)
- ✅ Works in private browsing mode (even if preference doesn't persist)
- ✅ No JavaScript errors in console

### Test 8: Performance

**Objective**: Verify no flash of unstyled content (FOUC).

**Steps**:
1. Clear browser cache
2. Set theme to dark, close browser
3. Reopen browser and navigate to site
4. Watch carefully during page load
5. Use browser DevTools > Network tab to throttle connection
6. Test slow 3G speed
7. Observe theme application timing

**Expected Results**:
- ✅ No visible flash of wrong theme
- ✅ Theme applies before content renders
- ✅ Works even on slow connections
- ✅ JavaScript loads and executes quickly (<100ms)

## Success Criteria

All of the following must be true:

- ✅ All 8 tests pass
- ✅ Theme toggle works in both directions (light→dark, dark→light)
- ✅ Theme preference persists across page loads
- ✅ All components render correctly in both themes
- ✅ Site is fully responsive (320px - 1920px+)
- ✅ No accessibility violations
- ✅ No JavaScript console errors
- ✅ No CSS layout issues or overflow
- ✅ Footer displays with correct links
- ✅ Header displays formatted dates and times correctly

## Troubleshooting

### Theme Not Persisting

Check:
1. Browser localStorage is enabled (some privacy settings disable it)
2. No JavaScript errors in console
3. Correct localStorage key name used
4. Script loaded before body renders

### FOUC (Flash of Unstyled Content)

Ensure:
1. `theme.js` loaded in `<head>`, not at end of `<body>`
2. Script executes immediately (IIFE, not waiting for DOMContentLoaded for theme application)
3. No blocking scripts before theme.js

### CSS Variables Not Working

Check:
1. Browser supports CSS custom properties (IE11 doesn't)
2. Variables defined in `:root`, not `body`
3. Using `var(--variable-name)` syntax correctly
4. No typos in variable names

### Mobile Layout Issues

Debug:
1. Check viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
2. Verify no fixed widths in CSS (use max-width instead)
3. Check for horizontal overflow with DevTools
4. Test flexbox/grid support

### Footer Not Sticking to Bottom

Ensure:
1. `body` has `display: flex; flex-direction: column; min-height: 100vh`
2. `main` has `flex: 1`
3. Footer is inside body but not inside main
