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
   git clone https://github.com/jmmeus/uobrepevents.git
   cd uobrepevents
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

## Documentation

📚 **[Event Guidelines](docs/event-guidelines.md)** - Complete guide to adding and managing events

Quick links:
- [Adding a new event](docs/event-guidelines.md#quick-start)
- [Event types](docs/event-guidelines.md#event-types)
- [Creating custom templates](docs/event-guidelines.md#creating-custom-templates)
- [Troubleshooting](docs/event-guidelines.md#troubleshooting)

## Project Structure

```
_events/             # Event folders (Jekyll collection)
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

MIT License - see [LICENSE](LICENSE) file for details
