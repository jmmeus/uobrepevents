# Milestone 1: Foundation & Build Pipeline

## Overview

This milestone establishes the foundational infrastructure for the modular GitHub Pages event system. It sets up Jekyll, configures GitHub Actions for automatic deployment, and creates the basic directory structure. This is a prerequisite for all other work.

## Goals

- Set up Jekyll as the static site generator
- Configure GitHub Actions to automatically build and deploy to GitHub Pages on push
- Create the directory structure for the entire project
- Provide local development instructions for contributors

## Context & Architecture

This project uses:
- **Jekyll**: Static site generator that processes Markdown, Liquid templates, and YAML data
- **GitHub Actions**: CI/CD pipeline that builds Jekyll and deploys to GitHub Pages
- **GitHub Pages**: Hosting service for the generated static site
- **Collections**: Jekyll feature that treats each event folder as a "document" with metadata

The site will be accessible at: `https://<username>.github.io/<repo>/`

## Detailed Deliverables

### 1. GitHub Actions Workflow (`.github/workflows/deploy.yml`)

**Purpose**: Automatically build Jekyll site and deploy to GitHub Pages on every push to the main branch.

**Requirements**:
- Trigger on push to main branch
- Use official Jekyll build action or manual Ruby setup
- Deploy to GitHub Pages using `actions/deploy-pages` or equivalent
- Set appropriate permissions for GitHub Pages deployment
- Use Jekyll 4.x or later

**Specification**:
```yaml
name: Deploy Jekyll site to Pages

on:
  push:
    branches: ["main"]  # or your default branch name
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'
          bundler-cache: true

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Build with Jekyll
        run: bundle exec jekyll build --baseurl "${{ steps.pages.outputs.base_path }}"
        env:
          JEKYLL_ENV: production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 2. Jekyll Configuration (`_config.yml`)

**Purpose**: Configure Jekyll settings and define the events collection.

**Requirements**:
- Set site title and description
- Configure base URL for GitHub Pages
- Define `events` collection with output enabled
- Set permalink structure for events
- Enable required plugins
- Configure timezone (optional but recommended)

**Specification**:
```yaml
# Site settings
title: "UoB Research Events"
description: "University of Birmingham Research Events System"
baseurl: "" # Leave empty for org sites, or "/repo-name" for project sites
url: "https://username.github.io" # Your GitHub Pages URL

# Collections
collections:
  events:
    output: true
    permalink: /events/:name/

# Build settings
markdown: kramdown
theme: null  # We're using custom layouts

# Plugins
plugins:
  - jekyll-feed
  - jekyll-sitemap

# Timezone (adjust as needed)
timezone: Europe/London

# Exclude from processing
exclude:
  - Gemfile
  - Gemfile.lock
  - node_modules
  - vendor/
  - .git/
  - .github/
  - README.md
  - docs/milestone-*.md
```

### 3. Gemfile

**Purpose**: Define Ruby dependencies for Jekyll.

**Specification**:
```ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.3"
gem "webrick", "~> 1.8"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-sitemap", "~> 1.4"
end
```

### 4. Directory Structure

Create the following directories:

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── _layouts/          # Jekyll templates (empty for now)
├── _includes/         # Reusable components (empty for now)
├── events/            # Event folders will go here (empty for now)
├── assets/
│   ├── css/          # Stylesheets (empty for now)
│   └── js/           # JavaScript files (empty for now)
├── docs/             # Documentation and milestone files
├── _config.yml
├── Gemfile
├── .gitignore
└── README.md
```

All directories should be created even if empty (use `.gitkeep` files for empty directories that Git should track).

### 5. `.gitignore`

**Purpose**: Exclude Jekyll build artifacts and system files from version control.

**Specification**:
```
# Jekyll
_site/
.sass-cache/
.jekyll-cache/
.jekyll-metadata

# Ruby
*.gem
.bundle
vendor/

# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
*.swp
*.swo
*~
```

### 6. `README.md`

**Purpose**: Provide overview and local development instructions.

**Requirements**:
- Project description
- Prerequisites (Ruby, Bundler, Jekyll)
- Installation steps
- How to run locally
- How to add a new event (brief overview, link to full guidelines)
- Link to event guidelines documentation

**Specification**:
```markdown
# UoB Research Events

A modular GitHub Pages system for hosting research event schedules, posters, and information.

## Features

- Multiple event types: rota schedules, posters, simple pages
- Light/dark theme toggle
- Responsive mobile design
- Automatic deployment via GitHub Actions
- Expandable template system

## Local Development

### Prerequisites

- Ruby 3.1 or higher
- Bundler gem
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <repo-name>
   ```

2. Install dependencies:
   ```bash
   bundle install
   ```

3. Run the development server:
   ```bash
   bundle exec jekyll serve
   ```

4. Open your browser to `http://localhost:4000`

The site will automatically rebuild when you make changes to files.

### Development Options

- `bundle exec jekyll serve --livereload` - Auto-refresh browser on changes
- `bundle exec jekyll serve --drafts` - Include draft posts
- `bundle exec jekyll build` - Build site without serving

## Adding a New Event

See [Event Guidelines](docs/event-guidelines.md) for complete documentation.

Quick overview:
1. Create a folder in `events/` with a URL-friendly slug
2. Add `event.yml` with event metadata
3. Add `index.md` with layout reference
4. Commit and push - GitHub Actions will auto-deploy

## Project Structure

```
events/              # Event folders
_layouts/            # Page templates
_includes/           # Reusable components
assets/              # CSS, JS, and media files
docs/                # Documentation
```

## Contributing

1. Create a new branch
2. Make your changes
3. Test locally with `bundle exec jekyll serve`
4. Submit a pull request

## License

[Specify your license]
```

### 7. Empty Directory Markers

Create `.gitkeep` files in empty directories so Git tracks them:
- `_layouts/.gitkeep`
- `_includes/.gitkeep`
- `events/.gitkeep`
- `assets/css/.gitkeep`
- `assets/js/.gitkeep`

## Implementation Steps

1. Create `docs/` directory
2. Create `.github/workflows/` directory structure
3. Write `deploy.yml` workflow file
4. Write `_config.yml` with collections configuration
5. Write `Gemfile`
6. Create all required directories with `.gitkeep` files
7. Write `.gitignore`
8. Write `README.md`
9. Commit all files
10. Push to trigger first deployment

## Testing Procedures

### Test 1: Local Jekyll Build

**Objective**: Verify Jekyll can build the site locally.

**Steps**:
1. From repository root, run:
   ```bash
   bundle install
   ```
2. Run:
   ```bash
   bundle exec jekyll build
   ```

**Expected Result**:
- No errors in output
- `_site/` directory is created
- Output shows: `done in X.XX seconds.`

### Test 2: Local Jekyll Serve

**Objective**: Verify development server runs successfully.

**Steps**:
1. Run:
   ```bash
   bundle exec jekyll serve
   ```
2. Open browser to `http://localhost:4000`

**Expected Result**:
- Server starts without errors
- Output shows: `Server running... press ctrl-c to stop.`
- Browser shows a page (even if it's a 404 or blank page - that's expected at this stage)
- No 500 errors

### Test 3: GitHub Actions Workflow Triggers

**Objective**: Verify workflow runs on push.

**Steps**:
1. Commit all milestone 1 files
2. Push to main branch (or create main branch if needed)
3. Navigate to repository on GitHub
4. Click "Actions" tab
5. Find the "Deploy Jekyll site to Pages" workflow run

**Expected Result**:
- Workflow appears in Actions tab
- Workflow runs automatically
- Both "build" and "deploy" jobs complete successfully (green checkmarks)
- No red X's or failures

### Test 4: GitHub Pages Deployment

**Objective**: Verify site is accessible via GitHub Pages URL.

**Prerequisites**: GitHub Pages must be enabled in repository settings.

**Steps**:
1. In GitHub repository, go to Settings > Pages
2. Verify Source is set to "GitHub Actions"
3. Wait for workflow to complete (may take 1-2 minutes after push)
4. Navigate to the Pages URL shown in Settings > Pages

**Expected Result**:
- Settings > Pages shows a green success message with URL
- Visiting the URL shows a page (even if blank/404 - site is loading)
- No browser errors or "site not found" messages
- Page loads over HTTPS

### Test 5: Repository Structure Validation

**Objective**: Verify all directories and files exist.

**Steps**:
1. Run:
   ```bash
   ls -la
   ```
2. Check for each required file and directory from the structure above

**Expected Result**:
- All directories exist: `_layouts/`, `_includes/`, `events/`, `assets/css/`, `assets/js/`, `docs/`, `.github/workflows/`
- All files exist: `_config.yml`, `Gemfile`, `.gitignore`, `README.md`, `deploy.yml`
- `.gitkeep` files exist in empty directories

### Test 6: Gemfile Dependencies Install

**Objective**: Verify all gems install without conflicts.

**Steps**:
1. Delete `Gemfile.lock` if it exists
2. Run:
   ```bash
   bundle install
   ```

**Expected Result**:
- All gems install successfully
- `Gemfile.lock` is generated
- No version conflict errors
- Jekyll version is 4.x or higher

### Test 7: Configuration Validation

**Objective**: Verify Jekyll configuration is valid.

**Steps**:
1. Run:
   ```bash
   bundle exec jekyll doctor
   ```

**Expected Result**:
- Output: "Your test results are in. Everything looks fine."
- No configuration errors

## Success Criteria

All of the following must be true:

- ✅ All 7 tests pass
- ✅ GitHub Actions workflow completes successfully on push
- ✅ Site is accessible at GitHub Pages URL (even if showing default/empty page)
- ✅ `bundle exec jekyll serve` runs without errors locally
- ✅ All required files and directories exist
- ✅ `.gitignore` prevents build artifacts from being committed
- ✅ README.md provides clear local development instructions

## Troubleshooting

### Workflow Permission Errors

If deployment fails with permission errors:
1. Go to repository Settings > Actions > General
2. Under "Workflow permissions", select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"
4. Re-run the workflow

### Pages Not Enabled

If site doesn't deploy:
1. Go to Settings > Pages
2. Under "Source", ensure "GitHub Actions" is selected
3. If not available, you may need to enable Pages first with any source, then switch to GitHub Actions

### Ruby Version Issues

If bundle install fails:
1. Check Ruby version: `ruby -v`
2. Install Ruby 3.1+ if needed (use rbenv or rvm)
3. Reinstall bundler: `gem install bundler`

### Baseurl Issues

If site loads but links are broken:
- For organization sites (username.github.io): `baseurl: ""`
- For project sites (username.github.io/repo): `baseurl: "/repo"`
