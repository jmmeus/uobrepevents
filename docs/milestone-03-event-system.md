# Milestone 3: Event System & Templates

## Overview

This milestone implements the core event system with all template types (rota, poster, simple, custom). It creates the events collection architecture, builds the index page that lists all events, and implements the abstract toggle system for rota events. This is the heart of the modular event system.

## Goals

- Implement Jekyll collections for events
- Create index page listing all events sorted by date
- Build rota template with talk schedules
- Build poster template
- Build simple template for freeform content
- Build custom template as extensible starting point
- Implement abstract toggle system (global + per-talk)
- Create example rota event with full features

## Context & Architecture

### Jekyll Collections

Collections allow each event folder to be treated as a "document":
- Each folder in `_events/` becomes a collection item
- Front matter in `index.md` defines layout
- YAML data in `event.yml` provides metadata
- Layouts read YAML using relative file paths
- Events are accessible via `site.events` in Liquid

### Event Data Flow

1. Event folder: `events/event-slug/`
2. Contains: `index.md` (minimal front matter), `event.yml` (all data)
3. Layout specified in `index.md` front matter
4. Layout reads `event.yml` from same directory
5. Layout includes shared components (header, footer, toggles)
6. Outputs: `events/event-slug/index.html`

### Abstract Toggle System

Two-layer approach:
- **Global toggle**: Button that shows/hides all abstracts at once
- **Per-talk toggle**: Individual buttons that override for specific talks
- **State management**: JavaScript tracks global state + individual overrides
- **Behavior**: Global toggle re-syncs all talks; per-talk toggle works independently until next global toggle

## Detailed Deliverables

### 1. Update Collections Configuration (`_config.yml`)

Add to existing configuration:

```yaml
# Collections
collections:
  events:
    output: true
    permalink: /events/:name/

# Default front matter
defaults:
  - scope:
      path: ""
      type: "events"
    values:
      layout: "event"
```

### 2. Root Index Page (`index.html`)

**Purpose**: List all events sorted by date, providing navigation to individual events.

**Requirements**:
- Dynamically discover all events
- Sort by date (newest first or oldest first - choose convention)
- Display event name, date, and link
- Responsive card/list layout
- Theme toggle included
- Use shared header/footer

**Specification**:
```html
---
layout: none
title: "UoB Research Events"
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title }}</title>
  <link rel="stylesheet" href="{{ '/assets/css/theme.css' | relative_url }}">
  <link rel="stylesheet" href="{{ '/assets/css/index.css' | relative_url }}">
  <script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
</head>
<body>
  {% include theme-toggle.html %}

  <main>
    <header class="page-header">
      <h1>Research Events</h1>
      <p class="page-description">Browse upcoming and past research events, seminars, and poster sessions.</p>
    </header>

    <div class="events-list">
      {% assign sorted_events = site.events | sort: 'date' | reverse %}
      {% if sorted_events.size > 0 %}
        {% for event_doc in sorted_events %}
          {% assign event_path = event_doc.path | split: '/' %}
          {% assign event_folder = event_path[-2] %}
          {% assign event_data_path = '_events/' | append: event_folder | append: '/event.yml' %}
          {% assign event = site.data.events[event_folder] %}

          <article class="event-card">
            <a href="{{ event_doc.url | relative_url }}" class="event-card-link">
              <h2 class="event-card-title">{{ event.name }}</h2>

              <div class="event-card-meta">
                <span class="event-card-date">{{ event.date | date: "%-d %B %Y" }}</span>
                <span class="event-card-separator">•</span>
                <span class="event-card-time">{{ event.start_time }} - {{ event.end_time }}</span>
                <span class="event-card-separator">•</span>
                <span class="event-card-location">{{ event.location }}</span>
              </div>

              {% if event.description %}
              <p class="event-card-description">{{ event.description }}</p>
              {% endif %}

              <span class="event-card-type">{{ event.type | capitalize }}</span>
            </a>
          </article>
        {% endfor %}
      {% else %}
        <p class="no-events">No events found. Check back soon!</p>
      {% endif %}
    </div>
  </main>

  {% include footer.html %}
</body>
</html>
```

**Note**: This assumes events are accessible via `site.data.events[folder_name]`. We'll need to ensure YAML data is loaded correctly. An alternative is to use front matter data directly.

**Alternative simpler approach** (if YAML loading is complex):
Store data in front matter of `index.md` instead of separate `event.yml`.

### 3. Index Page Styles (`assets/css/index.css`)

**Purpose**: Style the events listing page.

**Specification**:
```css
/* ============================================
   Index Page Styles
   ============================================ */

.page-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-xl);
  border-bottom: 2px solid var(--border-color);
}

.page-header h1 {
  margin-bottom: var(--space-sm);
}

.page-description {
  color: var(--text-secondary);
  font-size: var(--text-lg);
  max-width: 600px;
  margin: 0 auto;
}

/* Events List */

.events-list {
  display: grid;
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

.event-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--link-color);
}

.event-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.event-card-title {
  color: var(--link-color);
  margin-bottom: var(--space-sm);
  font-size: var(--text-2xl);
}

.event-card:hover .event-card-title {
  text-decoration: underline;
}

.event-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: center;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
}

.event-card-separator {
  color: var(--text-muted);
}

.event-card-description {
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
  line-height: 1.6;
}

.event-card-type {
  display: inline-block;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.no-events {
  text-align: center;
  color: var(--text-muted);
  font-size: var(--text-lg);
  padding: var(--space-2xl);
}

/* Responsive */

@media (max-width: 768px) {
  .event-card-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }

  .event-card-separator {
    display: none;
  }
}
```

### 4. Example Rota Event

**Purpose**: Demonstrate full rota functionality with talks, breaks, abstracts, and links.

**Structure**:
```
_events/
  birmingham-phd-gareth/
    index.md
    event.yml
    assets/
      slides.pdf (placeholder)
```

**File: `_events/birmingham-phd-gareth/index.md`**:
```yaml
---
layout: rota
---
```

**File: `_events/birmingham-phd-gareth/event.yml`**:
```yaml
type: rota
name: "Birmingham PhD Seminar Series - April 2025"
slug: "birmingham-phd-gareth"
date: "2025-04-02"
start_time: "14:30"
end_time: "16:32"
location: "Physics West 115"
description: "Monthly PhD student seminar series featuring research talks from across the department."

talks:
  - start: "14:30"
    end: "14:50"
    speaker: "Dr. Gareth Smith"
    title: "Quantum Entanglement in Photonic Systems"
    group: "Quantum Optics"
    abstract: "This talk explores novel approaches to generating and manipulating quantum entanglement in photonic systems. We present recent experimental results demonstrating high-fidelity entanglement generation and discuss applications in quantum computing and secure communication."
    links:
      - text: "Slides"
        file: "assets/slides.pdf"
      - text: "Paper"
        url: "https://arxiv.org/abs/example"

  - start: "14:50"
    end: "15:10"
    speaker: "Sarah Johnson"
    title: "Machine Learning Approaches to Climate Modeling"
    group: "Climate Science"
    abstract: "We investigate the application of deep learning techniques to improve climate prediction models. Our results show significant improvements in accuracy over traditional methods."
    links:
      - text: "GitHub Repository"
        url: "https://github.com/example/climate-ml"

  - type: break
    start: "15:10"
    end: "15:30"
    label: "Coffee and networking break"

  - start: "15:30"
    end: "15:50"
    speaker: "Michael Chen"
    title: "Novel Battery Technologies for Energy Storage"
    group: "Materials Science"
    links:
      - text: "Lab Website"
        url: "https://example.com/lab"

  - start: "15:50"
    end: "16:10"
    speaker: "Dr. Emma Williams"
    title: "Gravitational Wave Detection: Recent Advances"
    group: "Astrophysics"
    abstract: "An overview of recent gravitational wave detections and what they reveal about black hole mergers and neutron star collisions."

  - start: "16:10"
    end: "16:32"
    speaker: "Panel Discussion"
    title: "Q&A and Closing Remarks"
    group: "All speakers"
```

**File: `_events/birmingham-phd-gareth/assets/slides.pdf`**:
Create a minimal PDF placeholder (can be generated programmatically or manually):
- Single page with text "Example Slides - Birmingham PhD Seminar"
- This tests PDF linking functionality

### 5. Rota Layout (`_layouts/rota.html`)

**Purpose**: Display talk schedules with times, speakers, abstracts, and links.

**Requirements**:
- Read event.yml from event directory
- Loop through talks
- Render regular talks vs. breaks differently
- Show/hide abstracts based on toggle state
- Display links to PDFs and external URLs
- Responsive card layout
- Use shared header/footer/theme

**Specification**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title | default: "Event" }}</title>
  <link rel="stylesheet" href="{{ '/assets/css/theme.css' | relative_url }}">
  <link rel="stylesheet" href="{{ '/assets/css/rota.css' | relative_url }}">
  <script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
</head>
<body>
  {% include theme-toggle.html %}

  <main>
    {% comment %} Load event data from event.yml {% endcomment %}
    {% assign event_path = page.path | split: '/' %}
    {% assign event_folder = event_path[-2] %}
    {% assign event = site.data.events[event_folder] %}

    {% include header.html event=event %}

    {% include abstract-toggle.html %}

    <div class="talks-container">
      {% for talk in event.talks %}
        {% if talk.type == "break" %}
          {%comment %} Render break card {% endcomment %}
          <div class="talk-card talk-card-break">
            <div class="talk-time">
              <span class="time-start">{{ talk.start }}</span>
              <span class="time-separator">-</span>
              <span class="time-end">{{ talk.end }}</span>
            </div>
            <div class="talk-content">
              <h3 class="break-label">☕ {{ talk.label }}</h3>
            </div>
          </div>
        {% else %}
          {%comment %} Render regular talk card {% endcomment %}
          <article class="talk-card">
            <div class="talk-time">
              <span class="time-start">{{ talk.start }}</span>
              <span class="time-separator">-</span>
              <span class="time-end">{{ talk.end }}</span>
            </div>

            <div class="talk-content">
              <div class="talk-header">
                <h3 class="talk-title">{{ talk.title }}</h3>
                <div class="talk-meta">
                  <span class="talk-speaker">{{ talk.speaker }}</span>
                  {% if talk.group %}
                  <span class="talk-group"> • {{ talk.group }}</span>
                  {% endif %}
                </div>
              </div>

              {% if talk.abstract %}
              <div class="abstract-container">
                <button class="abstract-toggle-btn" aria-expanded="false">
                  <span class="toggle-icon">▶</span>
                  <span class="toggle-text">Show abstract</span>
                </button>
                <div class="abstract-content" hidden>
                  <p>{{ talk.abstract }}</p>
                </div>
              </div>
              {% endif %}

              {% if talk.links %}
              <div class="talk-links">
                {% for link in talk.links %}
                  {% if link.file %}
                    <a href="{{ link.file | relative_url }}" class="talk-link" target="_blank" rel="noopener">
                      📄 {{ link.text }}
                    </a>
                  {% elsif link.url %}
                    <a href="{{ link.url }}" class="talk-link" target="_blank" rel="noopener">
                      🔗 {{ link.text }}
                    </a>
                  {% endif %}
                {% endfor %}
              </div>
              {% endif %}
            </div>
          </article>
        {% endif %}
      {% endfor %}
    </div>
  </main>

  {% include footer.html %}

  <script src="{{ '/assets/js/abstract.js' | relative_url }}"></script>
</body>
</html>
```

**Note**: This assumes event data is accessible via `site.data.events[folder_name]`. Jekyll doesn't automatically load arbitrary YAML files from collections, so we need to structure this correctly.

**Alternative approach**: Use front matter in `index.md` instead of separate YAML file. For true separation, we may need to manually structure `_data/events/`.

**Recommended structure for data loading**:
```
_data/
  events/
    birmingham-phd-gareth.yml  (same content as event.yml)
```

Then reference as: `{% assign event = site.data.events['birmingham-phd-gareth'] %}`

### 6. Rota Styles (`assets/css/rota.css`)

**Purpose**: Style the rota layout for talk schedules.

**Specification**:
```css
/* ============================================
   Rota Layout Styles
   ============================================ */

.talks-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-top: var(--space-xl);
}

/* Talk Cards */

.talk-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: var(--space-lg);
  transition: box-shadow var(--transition-fast);
}

.talk-card:hover {
  box-shadow: var(--shadow-md);
}

/* Break Cards */

.talk-card-break {
  background: var(--bg-tertiary);
  border-style: dashed;
  text-align: center;
  grid-template-columns: 1fr;
}

.break-label {
  color: var(--text-secondary);
  font-size: var(--text-xl);
  font-weight: 500;
  margin: 0;
}

/* Time Display */

.talk-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 600;
  gap: var(--space-xs);
}

.time-separator {
  color: var(--text-muted);
}

/* Talk Content */

.talk-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.talk-header {
  margin-bottom: var(--space-sm);
}

.talk-title {
  color: var(--text-primary);
  font-size: var(--text-xl);
  margin-bottom: var(--space-xs);
  line-height: 1.3;
}

.talk-meta {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.talk-speaker {
  font-weight: 600;
}

.talk-group {
  color: var(--text-muted);
  font-style: italic;
}

/* Abstract Toggle */

.abstract-container {
  border-top: 1px solid var(--border-color-light);
  padding-top: var(--space-md);
}

.abstract-toggle-btn {
  background: none;
  border: none;
  color: var(--link-color);
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) 0;
  transition: color var(--transition-fast);
}

.abstract-toggle-btn:hover {
  color: var(--link-hover);
  text-decoration: underline;
}

.toggle-icon {
  display: inline-block;
  transition: transform var(--transition-fast);
  font-size: var(--text-xs);
}

.abstract-toggle-btn[aria-expanded="true"] .toggle-icon {
  transform: rotate(90deg);
}

.abstract-content {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-tertiary);
  border-left: 3px solid var(--link-color);
  border-radius: var(--radius-sm);
  line-height: 1.7;
}

.abstract-content p {
  margin: 0;
  color: var(--text-secondary);
}

/* Talk Links */

.talk-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.talk-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--link-color);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.talk-link:hover {
  background: var(--link-color);
  color: var(--button-text);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
}

/* Responsive */

@media (max-width: 768px) {
  .talk-card {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .talk-time {
    flex-direction: row;
    justify-content: flex-start;
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--border-color-light);
  }
}

@media (max-width: 480px) {
  .talk-links {
    flex-direction: column;
  }

  .talk-link {
    width: 100%;
    justify-content: center;
  }
}
```

### 7. Abstract Toggle Include (`_includes/abstract-toggle.html`)

**Purpose**: Global toggle button to show/hide all abstracts.

**Specification**:
```html
<div class="abstract-global-toggle">
  <button
    id="abstract-global-toggle"
    class="btn btn-secondary"
    aria-label="Toggle all abstracts">
    <span id="abstract-toggle-text">Show all abstracts</span>
  </button>
</div>
```

**Styles** (add to `assets/css/rota.css`):
```css
/* Global Abstract Toggle */

.abstract-global-toggle {
  margin-bottom: var(--space-xl);
  text-align: center;
}

.btn {
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: none;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.btn-secondary:active {
  transform: translateY(0);
}
```

### 8. Abstract Toggle JavaScript (`assets/js/abstract.js`)

**Purpose**: Implement two-layer abstract toggle logic.

**Requirements**:
- Global toggle shows/hides all
- Per-talk toggle works independently
- Global toggle re-syncs all talks
- Smooth animations
- Accessible (ARIA attributes)

**Specification**:
```javascript
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
```

### 9. Poster Layout (`_layouts/poster.html`)

**Purpose**: Display poster event with simple metadata and PDF link.

**Specification**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title | default: "Poster Event" }}</title>
  <link rel="stylesheet" href="{{ '/assets/css/theme.css' | relative_url }}">
  <link rel="stylesheet" href="{{ '/assets/css/poster.css' | relative_url }}">
  <script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
</head>
<body>
  {% include theme-toggle.html %}

  <main>
    {% assign event_path = page.path | split: '/' %}
    {% assign event_folder = event_path[-2] %}
    {% assign event = site.data.events[event_folder] %}

    {% include header.html event=event %}

    <div class="poster-content">
      {% if event.poster_file %}
      <div class="poster-preview">
        <a href="{{ event.poster_file | relative_url }}" class="poster-link" target="_blank" rel="noopener">
          <div class="poster-placeholder">
            <span class="poster-icon">📄</span>
            <span class="poster-text">View Poster (PDF)</span>
          </div>
        </a>
      </div>
      {% endif %}

      {% if event.authors %}
      <div class="poster-authors">
        <h2>Authors</h2>
        <ul>
          {% for author in event.authors %}
          <li>{{ author }}</li>
          {% endfor %}
        </ul>
      </div>
      {% endif %}

      {% if event.abstract %}
      <div class="poster-abstract">
        <h2>Abstract</h2>
        <p>{{ event.abstract }}</p>
      </div>
      {% endif %}

      {% if event.links %}
      <div class="poster-links">
        <h2>Additional Resources</h2>
        <div class="links-container">
          {% for link in event.links %}
            {% if link.file %}
              <a href="{{ link.file | relative_url }}" class="resource-link" target="_blank" rel="noopener">
                📎 {{ link.text }}
              </a>
            {% elsif link.url %}
              <a href="{{ link.url }}" class="resource-link" target="_blank" rel="noopener">
                🔗 {{ link.text }}
              </a>
            {% endif %}
          {% endfor %}
        </div>
      </div>
      {% endif %}
    </div>
  </main>

  {% include footer.html %}
</body>
</html>
```

### 10. Poster Styles (`assets/css/poster.css`)

**Specification**:
```css
/* ============================================
   Poster Layout Styles
   ============================================ */

.poster-content {
  max-width: 800px;
  margin: 0 auto;
}

.poster-preview {
  margin-bottom: var(--space-2xl);
}

.poster-link {
  display: block;
  text-decoration: none;
}

.poster-placeholder {
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  text-align: center;
  transition: all var(--transition-base);
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
}

.poster-placeholder:hover {
  background: var(--bg-tertiary);
  border-color: var(--link-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.poster-icon {
  font-size: 4rem;
}

.poster-text {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--link-color);
}

.poster-authors,
.poster-abstract,
.poster-links {
  margin-bottom: var(--space-2xl);
}

.poster-authors h2,
.poster-abstract h2,
.poster-links h2 {
  border-bottom: 2px solid var(--border-color);
  padding-bottom: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.poster-authors ul {
  list-style: none;
  padding: 0;
}

.poster-authors li {
  padding: var(--space-sm) 0;
  color: var(--text-secondary);
  font-size: var(--text-lg);
}

.poster-abstract p {
  line-height: 1.8;
  color: var(--text-secondary);
}

.links-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.resource-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--link-color);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.resource-link:hover {
  background: var(--link-color);
  color: var(--button-text);
  transform: translateX(4px);
  text-decoration: none;
}
```

### 11. Simple Layout (`_layouts/simple.html`)

**Purpose**: Freeform content page with basic structure.

**Specification**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title | default: "Event" }}</title>
  <link rel="stylesheet" href="{{ '/assets/css/theme.css' | relative_url }}">
  <script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
</head>
<body>
  {% include theme-toggle.html %}

  <main>
    {% assign event_path = page.path | split: '/' %}
    {% assign event_folder = event_path[-2] %}
    {% assign event = site.data.events[event_folder] %}

    {% include header.html event=event %}

    <article class="simple-content">
      {{ content }}

      {% if event.content %}
      <div class="event-body">
        {{ event.content | markdownify }}
      </div>
      {% endif %}
    </article>
  </main>

  {% include footer.html %}
</body>
</html>
```

### 12. Custom Layout (`_layouts/custom.html`)

**Purpose**: Starter template for users to create their own layouts.

**Specification**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title | default: "Custom Event" }}</title>
  <link rel="stylesheet" href="{{ '/assets/css/theme.css' | relative_url }}">
  <!-- Add your custom CSS here -->
  <script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
</head>
<body>
  {% include theme-toggle.html %}

  <main>
    {% comment %}
      Load event data from event.yml
      Access event properties like: event.name, event.date, etc.
    {% endcomment %}
    {% assign event_path = page.path | split: '/' %}
    {% assign event_folder = event_path[-2] %}
    {% assign event = site.data.events[event_folder] %}

    {% include header.html event=event %}

    {% comment %}
      ====================================
      CUSTOM CONTENT AREA
      ====================================
      Add your custom HTML and Liquid code here.
      You can access event data via the 'event' variable.

      Examples:
        {{ event.name }} - Event name
        {{ event.custom_field }} - Any custom field from event.yml
        {% for item in event.custom_array %} - Loop through arrays

      Available shared components:
        {% include header.html event=event %}
        {% include footer.html %}
        {% include theme-toggle.html %}
    {% endcomment %}

    <div class="custom-content">
      <p>This is a custom template. Edit <code>_layouts/custom.html</code> to customize.</p>

      <h2>Event Data Available:</h2>
      <ul>
        <li><strong>Name:</strong> {{ event.name }}</li>
        <li><strong>Date:</strong> {{ event.date }}</li>
        <li><strong>Location:</strong> {{ event.location }}</li>
        <li><strong>Type:</strong> {{ event.type }}</li>
      </ul>

      {% comment %} Add your custom sections here {% endcomment %}
    </div>
  </main>

  {% include footer.html %}

  <!-- Add your custom JavaScript here -->
</body>
</html>
```

### 13. Data Structure Setup

To make event data accessible, we need to organize YAML files properly.

**Option A: Use `_data/events/` directory**

Structure:
```
_data/
  events/
    birmingham-phd-gareth.yml
```

This allows access via: `site.data.events['birmingham-phd-gareth']`

**Option B: Use front matter in `index.md`**

Structure:
```
_events/
  birmingham-phd-gareth/
    index.md (contains all event data in front matter)
```

Then access via: `page` variable directly in layouts.

**Recommended: Use Option A** for true separation of data and presentation.

When implementing, copy `event.yml` content to `_data/events/[slug].yml` so templates can reference it.

## Implementation Steps

1. Update `_config.yml` with collections and defaults
2. Create `_data/events/` directory
3. Create example event directory structure
4. Create example event YAML data
5. Create placeholder PDF
6. Create index.html
7. Create index.css
8. Create all four layouts (rota, poster, simple, custom)
9. Create rota.css and poster.css
10. Create abstract-toggle.html include
11. Create abstract.js
12. Test all layouts and functionality

## Testing Procedures

### Test 1: Event Collection Discovery

**Objective**: Verify Jekyll discovers and processes events collection.

**Steps**:
1. Run `bundle exec jekyll build`
2. Check output for collection processing
3. Verify `_site/events/birmingham-phd-gareth/index.html` exists
4. Check `_site/index.html` exists

**Expected Results**:
- ✅ Build completes without errors
- ✅ Event pages generated in `_site/events/`
- ✅ Index page generated

### Test 2: Index Page Listing

**Objective**: Verify index page lists all events correctly.

**Steps**:
1. Run `bundle exec jekyll serve`
2. Open `http://localhost:4000/`
3. Verify event card appears
4. Check event name, date, time, location display
5. Check event type badge
6. Click event card

**Expected Results**:
- ✅ Index page loads successfully
- ✅ Example event appears in list
- ✅ Date formatted correctly ("2 April 2025")
- ✅ All metadata displays
- ✅ Clicking navigates to event page
- ✅ Layout is responsive

### Test 3: Rota Layout Rendering

**Objective**: Verify rota layout displays talks correctly.

**Steps**:
1. Navigate to example rota event
2. Verify header displays event info
3. Check all talks render
4. Verify break renders differently
5. Check times display correctly
6. Verify speaker names and titles show

**Expected Results**:
- ✅ Header shows event name, date, time, location
- ✅ All 6 items render (5 talks + 1 break)
- ✅ Break has different styling (dashed border, centered)
- ✅ Times display in HH:MM format
- ✅ Speaker names bold and prominent
- ✅ Talk titles clear and readable
- ✅ Groups/affiliations show in italics

### Test 4: Abstract Toggle (Per-Talk)

**Objective**: Verify individual abstract toggles work.

**Steps**:
1. Navigate to rota event
2. Find talk with abstract
3. Verify abstract hidden by default
4. Click "Show abstract" button
5. Verify abstract appears
6. Verify button text changes to "Hide abstract"
7. Verify icon rotates
8. Click again to hide

**Expected Results**:
- ✅ Abstracts hidden on page load
- ✅ Button shows "Show abstract" initially
- ✅ Clicking reveals abstract with smooth transition
- ✅ Button text changes to "Hide abstract"
- ✅ Arrow icon rotates 90 degrees
- ✅ Clicking again hides abstract
- ✅ Works independently for each talk

### Test 5: Abstract Toggle (Global)

**Objective**: Verify global abstract toggle controls all abstracts.

**Steps**:
1. Navigate to rota event
2. Click "Show all abstracts" button
3. Verify all abstracts appear
4. Verify button text changes to "Hide all abstracts"
5. Click again to hide all
6. Test mixed state:
   - Show one abstract individually
   - Click global "Show all"
   - Click global "Hide all"
   - Verify all hide

**Expected Results**:
- ✅ Global button shows "Show all abstracts" initially
- ✅ Clicking shows all abstracts at once
- ✅ Button text updates to "Hide all abstracts"
- ✅ Clicking again hides all
- ✅ Global toggle overrides individual states
- ✅ All abstracts synchronize with global toggle

### Test 6: Talk Links

**Objective**: Verify PDF and URL links work correctly.

**Steps**:
1. Navigate to rota event
2. Find talk with PDF link
3. Click "Slides" link
4. Verify PDF opens in new tab
5. Find talk with URL link
6. Click external link
7. Verify opens in new tab

**Expected Results**:
- ✅ PDF links have file icon (📄)
- ✅ External links have link icon (🔗)
- ✅ Clicking PDF link opens placeholder PDF
- ✅ Clicking URL opens correct website
- ✅ All links open in new tab (`target="_blank"`)
- ✅ Links have hover effects
- ✅ Multiple links display side-by-side

### Test 7: Poster Layout

**Objective**: Verify poster layout works (requires creating poster event).

**Setup**: Create minimal poster event for testing:
```
_data/events/test-poster.yml:
type: poster
name: "Test Poster Session"
date: "2025-05-01"
start_time: "10:00"
end_time: "12:00"
location: "Main Hall"
poster_file: "assets/poster.pdf"
authors:
  - "John Doe"
  - "Jane Smith"
abstract: "This is a test poster abstract."
```

```
_events/test-poster/index.md:
---
layout: poster
---
```

**Steps**:
1. Add test poster event
2. Run Jekyll
3. Navigate to poster event
4. Verify poster placeholder renders
5. Click to open PDF
6. Check authors list
7. Check abstract display

**Expected Results**:
- ✅ Poster placeholder box displays
- ✅ Hover effect works
- ✅ Click opens PDF
- ✅ Authors list renders
- ✅ Abstract shows below
- ✅ Layout is centered and clean

### Test 8: Simple Layout

**Objective**: Verify simple layout renders content.

**Setup**: Create simple event with markdown content in YAML:
```
_data/events/test-simple.yml:
type: simple
name: "Information Session"
date: "2025-06-01"
start_time: "14:00"
end_time: "15:00"
location: "Room 101"
content: |
  ## Welcome

  This is a simple event with freeform content.

  - Point one
  - Point two
  - Point three
```

**Steps**:
1. Add simple event
2. Run Jekyll
3. Navigate to event
4. Verify markdown renders as HTML
5. Check formatting

**Expected Results**:
- ✅ Header displays event metadata
- ✅ Markdown content renders correctly
- ✅ Headings, lists, etc. formatted properly
- ✅ Theme toggle works
- ✅ Footer displays

### Test 9: Custom Layout

**Objective**: Verify custom template provides good starting point.

**Steps**:
1. Navigate to example event using custom layout
2. View source in browser
3. Check that event data is accessible
4. Verify comments are helpful

**Expected Results**:
- ✅ Template renders without errors
- ✅ Event data displays correctly
- ✅ Comments explain how to customize
- ✅ Examples of accessing event fields work
- ✅ Easy to understand for new developers

### Test 10: Responsive Design (Rota)

**Objective**: Verify rota layout is mobile-friendly.

**Steps**:
1. Open rota event
2. Open DevTools responsive mode
3. Test widths: 320px, 480px, 768px, 1024px
4. Check talk card layout at each size
5. Verify time display changes from side-by-side to stacked

**Expected Results**:
- ✅ Cards stack properly on mobile
- ✅ Times move from side column to top on mobile (<768px)
- ✅ Links stack vertically on small screens
- ✅ No horizontal scroll
- ✅ Text remains readable
- ✅ Touch targets adequate size

### Test 11: Data Loading

**Objective**: Verify event data loads from YAML correctly.

**Steps**:
1. Check that `_data/events/` contains YAML files
2. Verify templates can access `site.data.events[slug]`
3. Test that all fields from YAML appear on page
4. Modify YAML file
5. Rebuild and verify changes appear

**Expected Results**:
- ✅ Event data accessible in templates
- ✅ All YAML fields render on page
- ✅ Changes to YAML reflect after rebuild
- ✅ No data loading errors

### Test 12: Accessibility (Rota)

**Objective**: Ensure rota layout is accessible.

**Steps**:
1. Navigate with keyboard only
2. Tab through abstract toggles
3. Activate with Enter/Space
4. Check ARIA attributes in DevTools
5. Test with screen reader if available

**Expected Results**:
- ✅ All toggles keyboard accessible
- ✅ Focus indicators visible
- ✅ `aria-expanded` attribute toggles correctly
- ✅ Hidden content has `hidden` attribute
- ✅ Semantic HTML (article, time, etc.)

## Success Criteria

All of the following must be true:

- ✅ All 12 tests pass
- ✅ Index page lists all events correctly
- ✅ Example rota event displays with all features
- ✅ Abstract toggles (global and per-talk) work correctly
- ✅ PDF and URL links functional
- ✅ Poster, simple, and custom layouts work
- ✅ All layouts are responsive
- ✅ No JavaScript errors in console
- ✅ Event data loads from YAML correctly
- ✅ Theme toggle works on all layouts
- ✅ Shared header/footer render on all pages

## Troubleshooting

### Event Data Not Loading

If `site.data.events[slug]` returns nothing:
1. Verify `_data/events/` directory exists
2. Check YAML file named correctly (slug.yml)
3. Validate YAML syntax (use online validator)
4. Restart Jekyll server
5. Check for typos in slug name

### Abstracts Not Toggling

Check:
1. `abstract.js` loaded in layout
2. Script loaded after HTML (at end of body or DOMContentLoaded)
3. No JavaScript errors in console
4. Button class names match (`.abstract-toggle-btn`)
5. `aria-expanded` attribute present on buttons

### Links Not Working

Verify:
1. PDF files exist in correct path
2. Using `relative_url` filter for local files
3. External URLs include `http://` or `https://`
4. `target="_blank"` present for new tab behavior

### Layout Not Applied

Check:
1. Front matter in `index.md` has correct `layout:` value
2. Layout file exists in `_layouts/` directory
3. Layout file name matches (case-sensitive)
4. No YAML syntax errors in front matter

### Collections Not Working

Ensure:
1. `_config.yml` has collections defined
2. Event folders in `_events/` (with underscore)
3. Each event has `index.md`
4. Restart Jekyll after config changes
