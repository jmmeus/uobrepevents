# Milestone 4: Documentation & Guidelines

## Overview

This milestone creates comprehensive documentation for the event system, enabling new users to add events and create custom templates. It includes event guidelines, YAML schema documentation, and examples for all use cases.

## Goals

- Document complete YAML schema for all event types
- Provide clear guidelines for adding new events
- Explain folder structure and naming conventions
- Document how to create custom templates
- Explain how global systems (theme, abstracts) work
- Create troubleshooting guide
- Add examples for common scenarios

## Context

This documentation is the primary resource for:
- Event organizers adding new events
- Developers creating custom event types
- Maintainers understanding the system architecture
- Contributors extending functionality

It must be comprehensive, clear, and example-driven.

## Detailed Deliverables

### 1. Event Guidelines (`docs/event-guidelines.md`)

**Purpose**: Complete reference for adding and managing events.

**Specification**:

```markdown
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
    assets/           ← Event-specific files (optional)
      slides.pdf
      poster.pdf
      image.jpg

_data/
  events/
    event-slug.yml    ← Event data (required)
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
        file: "assets/slides.pdf"
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
    file: "assets/slides.pdf"  # local file
  - text: "Paper"
    url: "https://example.com"  # external URL
  - text: "GitHub"
    url: "https://github.com/..."
```

**Complete example**: See `_data/events/birmingham-phd-gareth.yml`

---

### 2. Poster

**Use for**: Poster sessions, single poster displays

**Additional fields**:
```yaml
type: poster
poster_file: "assets/poster.pdf"  # required
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
poster_file: "assets/battery-poster.pdf"
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

Place event-specific files in the event's `assets/` folder:

```
_events/
  my-event/
    index.md
    assets/
      slides.pdf
      poster.pdf
      image.jpg
      data.csv
```

### Referencing Assets

In YAML, use relative paths:

```yaml
links:
  - text: "Slides"
    file: "assets/slides.pdf"

poster_file: "assets/poster.pdf"
```

Jekyll will automatically resolve these relative to the event folder.

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
1. ✅ PDF file exists in `_events/[slug]/assets/`
2. ✅ Path in YAML: `file: "assets/filename.pdf"`
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
        file: "assets/wilson-keynote.pdf"
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
poster_file: "assets/research-poster.pdf"
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
- [ ] `_events/[slug]/assets/` - Asset files (if needed)
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
```

### 2. Update README.md

Add prominent link to event guidelines in the existing README:

**Add after "Quick Overview" section**:

```markdown
## Documentation

📚 **[Event Guidelines](docs/event-guidelines.md)** - Complete guide to adding and managing events

Quick links:
- [Adding a new event](docs/event-guidelines.md#quick-start)
- [Event types](docs/event-guidelines.md#event-types)
- [Creating custom templates](docs/event-guidelines.md#creating-custom-templates)
- [Troubleshooting](docs/event-guidelines.md#troubleshooting)
```

### 3. Architecture Documentation (Optional)

Create `docs/architecture.md` for developers:

**Purpose**: Explain system architecture for maintainers and contributors.

**Key sections**:
- Jekyll collections architecture
- Data flow (YAML → Template → HTML)
- CSS architecture (variables, theming)
- JavaScript modules (theme, abstracts)
- File organization rationale
- Extension points

This is optional but valuable for future development.

## Implementation Steps

1. Create `docs/event-guidelines.md` with full content
2. Update `README.md` with documentation links
3. (Optional) Create `docs/architecture.md`
4. Review all documentation for accuracy
5. Test documentation by following it to create a new event
6. Check all links in documentation
7. Ensure examples are accurate
8. Proofread for clarity and completeness

## Testing Procedures

### Test 1: Follow Quick Start Guide

**Objective**: Verify quick start instructions work for new users.

**Steps**:
1. Create a new event following only the quick start section
2. Don't reference any other documentation
3. Try to complete the task using only those instructions
4. Note any confusion or missing steps

**Expected Results**:
- ✅ Can create event folder
- ✅ Can create index.md with correct syntax
- ✅ Can create YAML data file
- ✅ Can test locally
- ✅ Event appears on index page
- ✅ Event page loads correctly

### Test 2: Create Each Event Type from Examples

**Objective**: Verify all event type examples are complete and functional.

**Steps**:
1. Copy Example 1 (Simple Rota) exactly
2. Run Jekyll and verify it works
3. Repeat for Examples 2-4 (Complex Rota, Poster, Simple)
4. Verify each renders correctly

**Expected Results**:
- ✅ All examples have complete YAML
- ✅ All examples have necessary front matter
- ✅ Copy-paste works without modification
- ✅ Each example renders correctly
- ✅ No missing fields or errors

### Test 3: Naming Convention Validation

**Objective**: Verify slug naming rules are clear and examples are correct.

**Steps**:
1. Review "Good examples" list
2. Verify each follows stated rules
3. Review "Bad examples" list
4. Verify each violates stated rules
5. Try creating events with both good and bad slugs

**Expected Results**:
- ✅ Good examples all follow rules
- ✅ Bad examples clearly violate rules
- ✅ Rules are explicit and complete
- ✅ Easy to understand what makes a good slug

### Test 4: Troubleshooting Guide Accuracy

**Objective**: Verify troubleshooting steps solve real problems.

**Steps**:
1. Intentionally break an event (e.g., wrong slug)
2. Follow troubleshooting guide to fix it
3. Repeat for each troubleshooting scenario:
   - Event not appearing on index
   - 404 error
   - Data not displaying
   - PDF links broken
   - Abstracts not toggling
4. Verify solutions work

**Expected Results**:
- ✅ Each troubleshooting scenario is realistic
- ✅ Solutions correctly identify the problem
- ✅ Steps to fix are clear and complete
- ✅ Following steps resolves the issue

### Test 5: Custom Template Documentation

**Objective**: Verify custom template guide enables creating new templates.

**Steps**:
1. Follow "Creating Custom Templates" section
2. Create a new custom layout from scratch
3. Use only the documentation (no other source)
4. Create an event using the custom layout
5. Verify it works

**Expected Results**:
- ✅ All steps are present
- ✅ Code examples are complete and correct
- ✅ Can create working custom template
- ✅ Understand how to access event data
- ✅ Know how to include shared components

### Test 6: YAML Field Reference Completeness

**Objective**: Verify all YAML fields are documented.

**Steps**:
1. Review working example events
2. Extract all YAML fields used
3. Check each field is documented
4. Verify documentation includes:
   - Field name
   - Required/optional
   - Type
   - Format
   - Example
   - Description

**Expected Results**:
- ✅ All core fields documented
- ✅ All type-specific fields documented
- ✅ All optional fields documented
- ✅ Table format is clear and scannable
- ✅ Examples match descriptions

### Test 7: Link Validation

**Objective**: Verify all documentation links work.

**Steps**:
1. Click every link in documentation
2. Verify internal anchors work (#quick-start, etc.)
3. Verify external links open correct pages
4. Check table of contents links

**Expected Results**:
- ✅ All internal links navigate correctly
- ✅ All external links open (not 404)
- ✅ Table of contents links work
- ✅ Anchor IDs match headings

### Test 8: README Integration

**Objective**: Verify README links to documentation correctly.

**Steps**:
1. Open README.md
2. Follow link to event guidelines
3. Verify it opens correct file
4. Check quick links work
5. Verify link descriptions match destinations

**Expected Results**:
- ✅ Main documentation link works
- ✅ Quick links navigate to correct sections
- ✅ Link text accurately describes destination
- ✅ Easy to find from README

### Test 9: Beginner Comprehension

**Objective**: Ensure documentation is understandable for newcomers.

**Steps**:
1. Ask someone unfamiliar with Jekyll to review docs
2. Have them attempt to add an event
3. Note where they get confused
4. Note what questions they ask
5. Update documentation based on feedback

**Expected Results**:
- ✅ Minimal confusion for beginners
- ✅ Technical terms explained
- ✅ Examples clarify abstract concepts
- ✅ Logical flow from simple to complex

### Test 10: Completeness Check

**Objective**: Verify documentation covers all features.

**Steps**:
1. Review implemented features from Milestones 1-3
2. Check each is documented
3. Verify examples exist for each
4. Check troubleshooting covers each

**Features to verify**:
- [ ] Rota layout with talks
- [ ] Breaks in rota
- [ ] Abstracts (optional)
- [ ] Per-talk abstract toggle
- [ ] Global abstract toggle
- [ ] Talk links (file and URL)
- [ ] Poster layout
- [ ] Simple layout
- [ ] Custom layout
- [ ] Theme toggle
- [ ] Shared header/footer
- [ ] Asset management
- [ ] Event listing/sorting

**Expected Results**:
- ✅ All features documented
- ✅ Each has at least one example
- ✅ Usage instructions clear
- ✅ Troubleshooting available for complex features

## Success Criteria

All of the following must be true:

- ✅ All 10 tests pass
- ✅ `event-guidelines.md` is complete and comprehensive
- ✅ All event types documented with examples
- ✅ All YAML fields documented
- ✅ Custom template creation explained
- ✅ Troubleshooting guide covers common issues
- ✅ Quick start guide enables rapid event creation
- ✅ README links to documentation
- ✅ All internal links work
- ✅ Examples are copy-paste ready
- ✅ Naming conventions clear
- ✅ Asset management explained

## Troubleshooting

### Documentation Too Technical

Simplify by:
1. Adding more examples
2. Breaking down complex steps
3. Explaining technical terms
4. Using diagrams (if needed)
5. Adding "In plain English" explanations

### Examples Don't Work

Check:
1. YAML syntax valid
2. All required fields present
3. File paths correct
4. Tested locally before documenting
5. Jekyll version compatible

### Documentation Out of Sync

Keep docs current by:
1. Updating docs when features change
2. Adding "Last updated" date
3. Versioning documentation
4. Testing examples with each release

### Hard to Find Information

Improve by:
1. Better table of contents
2. More cross-references
3. Search functionality (if using docs site)
4. Clearer section headings
5. Quick reference cards

## Post-Milestone Validation

After completing documentation:

1. **User test**: Have someone unfamiliar with the system add an event using only the docs
2. **Peer review**: Get feedback from a colleague
3. **Completeness audit**: Verify every feature is documented
4. **Example validation**: Test every code example
5. **Link check**: Verify all links work

## Future Documentation Improvements

Consider adding:
- Video tutorials
- Interactive examples
- FAQ section
- Best practices guide
- Performance optimization tips
- Accessibility guidelines
- SEO best practices
- Analytics integration guide
