# Event Guidelines

This document provides complete guidelines for adding, managing, and customizing events in the UoB Research Events system.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Event Structure](#event-structure)
3. [Core YAML Fields](#core-yaml-fields)
4. [Event Types](#event-types)
5. [Adding Assets](#adding-assets)
6. [Naming Conventions](#naming-conventions)
7. [Creating Custom Templates](#creating-custom-templates)
8. [Global Features](#global-features)
9. [Troubleshooting](#troubleshooting)
10. [Examples](#examples)

---

## Quick Start

### Adding a New Event

1. **Create event folder** in `_events/`:
   ```bash
   mkdir -p _events/my-event-slug
   ```

2. **Create `index.md`** with layout reference:
   ```yaml
   ---
   layout: rota
   permalink: /events/my-event-slug/
   ---
   ```

3. **Create event data** in `_data/events/my-event-slug.yml`:
   ```yaml
   type: rota
   name: "My Event Name"
   date: "2025-04-15"
   start_time: "14:00"
   end_time: "16:00"
   location: "Physics West 115"
   description: "Event description here"
   ```

4. **Add event-specific content** (talks, assets, etc.)

5. **Test locally**:
   ```bash
   bundle exec jekyll serve
   ```

6. **Commit and push** - GitHub Actions will auto-deploy

---

## Event Structure

Each event follows this folder structure:

```
_events/
  event-slug/
    index.md          ← Layout reference (required)

_data/
  events/
    event-slug.yml    ← Event data (required)

assets/
  events/
    event-slug/       ← Event-specific files (optional)
      slides.pdf
      poster.pdf
      image.jpg
```

### Why Two Locations?

- **`_events/event-slug/`**: Collection folder that tells Jekyll to generate a page
- **`_data/events/event-slug.yml`**: Data file that contains all event metadata

This separation keeps data clean and allows layouts to access structured information.

---

## Core YAML Fields

Every event **must** include these fields in `_data/events/[slug].yml`:

```yaml
type: "rota | poster | simple | custom"
name: "Full Event Name"
slug: "url-friendly-slug"
date: "YYYY-MM-DD"
start_time: "HH:MM"
end_time: "HH:MM"
location: "Room Name or Building"
description: "Optional brief summary (1-2 sentences)"
```

### Field Details

| Field | Required | Format | Example | Description |
|-------|----------|--------|---------|-------------|
| `type` | Yes | String | `"rota"` | Template to use: rota, poster, simple, or custom |
| `name` | Yes | String | `"PhD Seminar Series"` | Full event name (displayed as H1) |
| `slug` | Yes | String | `"phd-seminar-april"` | URL-friendly identifier (lowercase-with-hyphens) |
| `date` | Yes | YYYY-MM-DD | `"2025-04-15"` | Event date (used for sorting) |
| `start_time` | Yes | HH:MM | `"14:30"` | Start time (24-hour format) |
| `end_time` | Yes | HH:MM | `"16:00"` | End time (24-hour format) |
| `location` | Yes | String | `"Physics West 115"` | Venue or room name |
| `description` | No | String | `"Monthly seminar..."` | Brief summary (optional) |

---

## Event Types

### 1. Rota (Talk Schedule)

**Use for**: Seminars, conferences, workshop schedules

**Additional fields**:
```yaml
type: rota
talks:
  - start: "14:00"
    end: "14:20"
    speaker: "Speaker Name"
    title: "Talk Title"
    group: "Research Group or Affiliation"  # optional
    abstract: "Talk abstract text"  # optional
    links:  # optional
      - text: "Slides"
        file: "assets/events/event-slug/slides.pdf"
      - text: "Paper"
        url: "https://arxiv.org/..."

  - type: break
    start: "14:20"
    end: "14:30"
    label: "Coffee break"
```

#### Talk Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `start` | Yes | HH:MM | Talk start time |
| `end` | Yes | HH:MM | Talk end time |
| `speaker` | Yes | String | Speaker name |
| `title` | Yes | String | Talk title |
| `group` | No | String | Research group or affiliation |
| `abstract` | No | String | Abstract (supports markdown) |
| `links` | No | Array | Links to slides, papers, etc. |

#### Break Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `type` | Yes | `"break"` | Marks this as a break |
| `start` | Yes | HH:MM | Break start time |
| `end` | Yes | HH:MM | Break end time |
| `label` | Yes | String | Break description (e.g., "Coffee break") |

#### Link Fields

Links can point to local files or external URLs:

```yaml
links:
  - text: "Slides"
    file: "assets/events/event-slug/slides.pdf"  # local file
  - text: "Paper"
    url: "https://example.com"  # external URL
  - text: "GitHub"
    url: "https://github.com/..."
```

**Complete example**: See `_data/events/mini-talks-2025.yml`

---

### 2. Poster

**Use for**: Poster sessions, single poster displays

**Additional fields**:
```yaml
type: poster
poster_file: "assets/events/event-slug/poster.pdf"  # required
authors:  # optional
  - "Author One"
  - "Author Two"
abstract: "Poster abstract text"  # optional
links:  # optional
  - text: "Full Paper"
    url: "https://..."
```

#### Poster-Specific Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `poster_file` | Yes | Path | Relative path to PDF file |
| `authors` | No | Array | List of author names |
| `abstract` | No | String | Research abstract |
| `links` | No | Array | Additional resources |

**Example**:
```yaml
type: poster
name: "Novel Battery Technologies Poster"
slug: "battery-poster-2025"
date: "2025-05-10"
start_time: "10:00"
end_time: "12:00"
location: "Main Hall"
description: "Poster presentation on lithium-ion alternatives"
poster_file: "assets/events/battery-poster-2025/battery-poster.pdf"
authors:
  - "Dr. Sarah Chen"
  - "Prof. Michael Rodriguez"
abstract: |
  We present novel approaches to solid-state battery design,
  demonstrating improved energy density and safety characteristics.
links:
  - text: "Full Paper (ArXiv)"
    url: "https://arxiv.org/abs/example"
  - text: "Lab Website"
    url: "https://example.ac.uk/battery-lab"
```

---

### 3. Simple

**Use for**: Information pages, freeform content, announcements

**Additional fields**:
```yaml
type: simple
content: |
  ## Markdown Content Here

  Any markdown-formatted content.

  - Lists
  - **Bold text**
  - [Links](https://...)
```

#### Simple-Specific Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `content` | No | Markdown | Freeform markdown content |

**Example**:
```yaml
type: simple
name: "Lab Safety Training"
slug: "safety-training-june"
date: "2025-06-01"
start_time: "09:00"
end_time: "12:00"
location: "Training Room B"
description: "Mandatory safety training for new lab members"
content: |
  ## What to Bring

  - Photo ID
  - Signed safety acknowledgment form
  - Notebook

  ## Agenda

  1. Introduction to lab safety protocols
  2. Equipment demonstrations
  3. Emergency procedures
  4. Q&A session

  ## Contact

  Questions? Email [safety@example.ac.uk](mailto:safety@example.ac.uk)
```

---

### 4. Custom

**Use for**: Events requiring unique layouts

Custom templates allow complete control over presentation. See [Creating Custom Templates](#creating-custom-templates).

**Example**:
```yaml
type: custom
name: "Custom Event"
slug: "custom-event"
date: "2025-07-01"
start_time: "10:00"
end_time: "12:00"
location: "Custom Venue"

# Add any custom fields needed
custom_field_one: "Value"
custom_field_two: ["Array", "Of", "Values"]
custom_nested:
  key: "value"
```

---

## Adding Assets

### Asset Location

Place event-specific files in the global `assets/events/` folder:

```
assets/
  events/
    my-event/
      slides.pdf
      poster.pdf
      image.jpg
      data.csv

_events/
  my-event/
    index.md
```

### Referencing Assets

In YAML, use paths relative to the site root:

```yaml
links:
  - text: "Slides"
    file: "assets/events/my-event/slides.pdf"

poster_file: "assets/events/my-event/poster.pdf"
```

These paths are relative to the site root and will be properly resolved by Jekyll.

### Supported File Types

- **PDFs**: Presentations, posters, papers
- **Images**: JPG, PNG, GIF, SVG
- **Documents**: DOCX, XLSX (will download on click)
- **Data**: CSV, JSON, etc.

### Asset Best Practices

1. **File size**: Keep PDFs under 10MB when possible
2. **Naming**: Use descriptive names (`smith-talk-slides.pdf`, not `file1.pdf`)
3. **Organization**: Group related files in subfolders if needed:
   ```
   assets/
     events/
       my-event/
         slides/
           talk1.pdf
           talk2.pdf
         posters/
           poster1.pdf
   ```

---

## Naming Conventions

### Event Slugs

Slugs are URL-friendly identifiers used in:
- Folder names: `_events/event-slug/`
- Data files: `_data/events/event-slug.yml`
- URLs: `https://site.com/events/event-slug/`

**Rules**:
- ✅ Lowercase only
- ✅ Use hyphens (not underscores or spaces)
- ✅ Alphanumeric characters only (a-z, 0-9, -)
- ✅ Descriptive but concise
- ✅ Include date or sequence number if recurring

**Good examples**:
- `phd-seminar-april-2025`
- `quantum-workshop-2025`
- `poster-session-spring`
- `lab-meeting-2025-04-15`

**Bad examples**:
- ❌ `PhD Seminar` (spaces, capitals)
- ❌ `event_123` (underscores, non-descriptive)
- ❌ `seminar` (too generic for recurring events)
- ❌ `physics-department-phd-student-seminar-series-april-2025-session` (too long)

### File Naming

- Use lowercase
- Use hyphens for spaces
- Be descriptive

**Examples**:
- `speaker-name-slides.pdf`
- `workshop-poster.pdf`
- `group-photo.jpg`

---

## Creating Custom Templates

Custom templates give you complete control over event presentation.

### Step 1: Create Layout File

Create `_layouts/my-custom-layout.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title | default: "Custom Event" }}</title>
  <link rel="stylesheet" href="{{ '/assets/css/theme.css' | relative_url }}">
  <link rel="stylesheet" href="{{ '/assets/css/my-custom.css' | relative_url }}">
  <script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
</head>
<body>
  {% include theme-toggle.html %}

  <main>
    {%comment %} Load event data {% endcomment %}
    {% assign event_path = page.path | split: '/' %}
    {% assign event_folder = event_path[-2] %}
    {% assign event = site.data.events[event_folder] %}

    {% include header.html event=event %}

    {%comment %} Your custom content here {% endcomment %}
    <div class="custom-content">
      <!-- Access event data: {{ event.name }}, {{ event.custom_field }}, etc. -->
    </div>
  </main>

  {% include footer.html %}
</body>
</html>
```

### Step 2: Create Custom Styles (Optional)

Create `assets/css/my-custom.css`:

```css
.custom-content {
  /* Your custom styles */
  max-width: 900px;
  margin: 0 auto;
}

/* Use CSS variables from theme.css for consistency */
.custom-element {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

### Step 3: Define Event Data

Create `_data/events/my-event.yml`:

```yaml
type: custom  # This tells the system to use a custom layout
name: "My Custom Event"
slug: "my-event"
date: "2025-08-01"
start_time: "10:00"
end_time: "12:00"
location: "Custom Venue"

# Add any custom fields your template needs
custom_field: "Custom value"
custom_list:
  - item: "One"
  - item: "Two"
```

### Step 4: Create Event Page

Create `_events/my-event/index.md`:

```yaml
---
layout: my-custom-layout
permalink: /events/my-event/
---
```

### Accessing Event Data in Templates

All event data is available in the `event` variable:

```liquid
{{ event.name }}           {%comment %} Core field {% endcomment %}
{{ event.custom_field }}   {%comment %} Custom field {% endcomment %}

{% for item in event.custom_list %}
  {{ item }}
{% endfor %}
```

### Using Shared Components

Include any shared component:

```liquid
{% include header.html event=event %}
{% include footer.html %}
{% include theme-toggle.html %}
```

### Best Practices for Custom Templates

1. **Reuse CSS variables** from `theme.css` for consistency
2. **Include theme toggle** for user preference
3. **Use shared header/footer** for navigation consistency
4. **Make it responsive** (test on mobile)
5. **Document custom fields** in comments or separate doc

---

## Global Features

### Theme Toggle (Light/Dark Mode)

**How it works**:
- Button in top-right corner
- User preference stored in browser
- Applies across all pages
- Respects system preference by default

**Implementation**:
All layouts automatically include theme toggle via:
```liquid
{% include theme-toggle.html %}
<script src="{{ '/assets/js/theme.js' | relative_url }}"></script>
```

**Customizing colors**:
Edit `assets/css/theme.css` CSS variables:
```css
:root {
  --bg-primary: #ffffff;  /* Light mode background */
  --text-primary: #1a1a1a;  /* Light mode text */
}

[data-theme="dark"] {
  --bg-primary: #0a0a0a;  /* Dark mode background */
  --text-primary: #f1f1f1;  /* Dark mode text */
}
```

### Abstract Toggle (Rota Only)

**Two-layer system**:
1. **Global toggle**: "Show/Hide all abstracts" button
2. **Per-talk toggle**: Individual "Show/Hide abstract" buttons

**Behavior**:
- Per-talk toggles work independently
- Global toggle overrides all and synchronizes
- State maintained during page session (not persistent)

**Implementation**:
Automatic in rota layout. Include this in your layout:
```liquid
{% include abstract-toggle.html %}
<script src="{{ '/assets/js/abstract.js' | relative_url }}"></script>
```

### Shared Header

Displays:
- Event name (H1)
- Date (formatted)
- Time range
- Location
- Description (optional)

**Usage in custom layouts**:
```liquid
{% include header.html event=event %}
```

### Shared Footer

Displays:
- Link to repository
- Contact email
- Copyright notice

**Configuration** (`_config.yml`):
```yaml
email: "your-email@example.ac.uk"
github:
  repository_url: "https://github.com/username/repo"
```

---

## Troubleshooting

### Event Not Appearing on Index Page

**Check**:
1. ✅ Event folder exists in `_events/`
2. ✅ Data file exists in `_data/events/[slug].yml`
3. ✅ Slug matches in both locations
4. ✅ YAML syntax is valid (use validator)
5. ✅ `date` field is present and properly formatted
6. ✅ Jekyll server restarted after adding event

### Event Page Shows 404

**Check**:
1. ✅ `index.md` exists in event folder
2. ✅ `index.md` has front matter with `layout:` field
3. ✅ Layout name matches file in `_layouts/`
4. ✅ Collections configured in `_config.yml`
5. ✅ URL matches slug: `/events/slug/`

### Event Data Not Displaying

**Check**:
1. ✅ YAML file in `_data/events/` (not just `_events/`)
2. ✅ Filename matches slug exactly
3. ✅ YAML syntax valid (indentation, colons, quotes)
4. ✅ No tabs (use spaces for indentation)
5. ✅ Required fields present

### PDF Links Not Working

**Check**:
1. ✅ PDF file exists in `assets/events/[slug]/`
2. ✅ Path in YAML: `file: "assets/events/[slug]/filename.pdf"`
3. ✅ Filename matches exactly (case-sensitive)
4. ✅ File committed to repository
5. ✅ Using `file:` for local files, `url:` for external

### Abstracts Not Toggling

**Check**:
1. ✅ Layout is `rota`
2. ✅ `abstract.js` loaded in layout
3. ✅ No JavaScript errors (check browser console)
4. ✅ Talks have `abstract` field populated
5. ✅ Browser JavaScript enabled

### Styling Looks Broken

**Check**:
1. ✅ `theme.css` loaded in layout `<head>`
2. ✅ Layout-specific CSS loaded (e.g., `rota.css`)
3. ✅ Browser cache cleared (Ctrl+Shift+R)
4. ✅ CSS file paths correct with `relative_url` filter
5. ✅ No CSS syntax errors

---

## Examples

### Example 1: Simple Rota Event

**Minimal seminar with two talks:**

`_data/events/seminar-may.yml`:
```yaml
type: rota
name: "May Seminar Series"
slug: "seminar-may"
date: "2025-05-15"
start_time: "14:00"
end_time: "15:00"
location: "Room 301"

talks:
  - start: "14:00"
    end: "14:30"
    speaker: "Dr. Alice Brown"
    title: "Introduction to Quantum Computing"

  - start: "14:30"
    end: "15:00"
    speaker: "Prof. Bob Smith"
    title: "Applications in Cryptography"
```

`_events/seminar-may/index.md`:
```yaml
---
layout: rota
permalink: /events/seminar-may/
---
```

### Example 2: Rota with Abstracts and Links

**Full-featured conference schedule:**

`_data/events/conference-2025.yml`:
```yaml
type: rota
name: "Annual Physics Conference 2025"
slug: "conference-2025"
date: "2025-06-20"
start_time: "09:00"
end_time: "17:00"
location: "Main Auditorium"
description: "Annual gathering of physics researchers from across the UK"

talks:
  - start: "09:00"
    end: "09:45"
    speaker: "Prof. Jane Wilson"
    title: "Keynote: The Future of Particle Physics"
    group: "CERN"
    abstract: |
      This keynote explores emerging trends in particle physics,
      including recent discoveries at the LHC and future experimental
      directions for understanding fundamental particles.
    links:
      - text: "Slides"
        file: "assets/events/conference-2025/wilson-keynote.pdf"
      - text: "CERN Website"
        url: "https://cern.ch"

  - type: break
    start: "09:45"
    end: "10:15"
    label: "Coffee and networking"

  - start: "10:15"
    end: "10:45"
    speaker: "Dr. Tom Chen"
    title: "Dark Matter Detection Methods"
    group: "University of Birmingham"
    abstract: "Novel approaches to detecting dark matter particles using underground detectors."
    links:
      - text: "Paper (ArXiv)"
        url: "https://arxiv.org/abs/example"
```

### Example 3: Poster Event

`_data/events/poster-session.yml`:
```yaml
type: poster
name: "Graduate Research Poster Session"
slug: "poster-session-spring"
date: "2025-04-25"
start_time: "13:00"
end_time: "15:00"
location: "Great Hall"
description: "Annual poster session showcasing graduate student research"
poster_file: "assets/events/poster-session-spring/research-poster.pdf"
authors:
  - "Emma Johnson (PhD Candidate)"
  - "Dr. Sarah Martinez (Supervisor)"
abstract: |
  Our research investigates novel machine learning techniques for
  predicting protein folding patterns. Preliminary results show
  15% improvement over existing methods.
links:
  - text: "GitHub Repository"
    url: "https://github.com/example/protein-ml"
  - text: "Lab Website"
    url: "https://example.ac.uk/bioml"
```

### Example 4: Simple Information Page

`_data/events/open-house.yml`:
```yaml
type: simple
name: "Department Open House"
slug: "open-house-2025"
date: "2025-03-10"
start_time: "10:00"
end_time: "16:00"
location: "Physics Building"
description: "Public open house showcasing our research and facilities"
content: |
  ## Welcome to Our Department!

  Join us for a day of science demonstrations, lab tours, and talks.

  ### Schedule

  - **10:00** - Welcome and registration
  - **10:30** - Lab tours begin (every 30 minutes)
  - **12:00** - Lunch break
  - **13:00** - Science demonstrations
  - **14:30** - Student panel Q&A
  - **16:00** - Event concludes

  ### What to Expect

  - Interactive demonstrations
  - Behind-the-scenes lab access
  - Meet our researchers
  - Refreshments provided

  ### Registration

  Free event, but [registration required](https://example.com/register).

  ### Parking

  Visitor parking available in Lot B. See [campus map](https://example.com/map).
```

### Example 5: Custom Template Event

`_data/events/award-ceremony.yml`:
```yaml
type: custom
name: "Annual Research Awards"
slug: "awards-2025"
date: "2025-07-15"
start_time: "18:00"
end_time: "20:00"
location: "Grand Hall"
description: "Celebrating excellence in research"

# Custom fields for awards layout
awards:
  - category: "Best PhD Thesis"
    winner: "Dr. Alex Thompson"
    title: "Quantum Entanglement in Biological Systems"

  - category: "Early Career Researcher"
    winner: "Dr. Maria Garcia"
    title: "Novel Cancer Immunotherapy Approaches"

schedule:
  - time: "18:00"
    activity: "Reception and networking"
  - time: "18:30"
    activity: "Welcome address"
  - time: "19:00"
    activity: "Award presentations"
  - time: "19:45"
    activity: "Closing remarks"
```

(Requires custom layout: `_layouts/awards.html`)

---

## Quick Reference

### Command Cheat Sheet

```bash
# Local development
bundle install              # Install dependencies
bundle exec jekyll serve    # Run dev server
bundle exec jekyll build    # Build site

# With live reload
bundle exec jekyll serve --livereload

# With drafts
bundle exec jekyll serve --drafts
```

### File Checklist for New Event

- [ ] `_data/events/[slug].yml` - Event data
- [ ] `_events/[slug]/index.md` - Page definition
- [ ] `assets/events/[slug]/` - Asset files (if needed)
- [ ] All required YAML fields present
- [ ] Slug follows naming conventions
- [ ] Tested locally before commit

### Common YAML Patterns

**Time format**: `"HH:MM"` (24-hour, with leading zeros)
- ✅ `"09:00"`, `"14:30"`, `"16:45"`
- ❌ `"9:00"`, `"2:30 PM"`, `"16.45"`

**Date format**: `"YYYY-MM-DD"`
- ✅ `"2025-04-15"`
- ❌ `"15/04/2025"`, `"April 15, 2025"`

**Multiline strings**:
```yaml
description: "Single line string"

abstract: |
  Multiline string
  preserves line breaks

content: >
  Multiline string
  folds to single line
```

---

## Getting Help

- **Technical issues**: Check [Troubleshooting](#troubleshooting)
- **Jekyll docs**: https://jekyllrb.com/docs/
- **Liquid syntax**: https://shopify.github.io/liquid/
- **Repository issues**: [GitHub Issues](https://github.com/username/repo/issues)

---

*Last updated: 2025-11-14*
