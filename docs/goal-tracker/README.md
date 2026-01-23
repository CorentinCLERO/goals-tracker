# Goals Tracker Documentation

This directory contains the complete documentation for the Goals Tracker application using MkDocs.

## Documentation Structure

```
docs/
├── index.md                    # Home page
├── getting-started/            # Getting started guides
│   ├── installation.md         # Installation instructions
│   └── quick-start.md          # Quick start guide
├── architecture/               # Architecture documentation
│   ├── overview.md             # System architecture overview
│   ├── backend.md              # Backend architecture (Spring Boot)
│   ├── frontend.md             # Frontend architecture (React)
│   └── database.md             # Database schema (PostgreSQL)
├── development/                # Development guides
│   ├── backend.md              # Backend development
│   ├── frontend.md             # Frontend development
│   └── docker.md               # Docker setup and usage
├── ci-cd/                      # CI/CD documentation
│   ├── github-actions.md       # GitHub Actions workflows
│   └── deployment.md           # Deployment guide
└── api/                        # API documentation
    ├── authentication.md       # Authentication endpoints
    ├── goals.md                # Goals API
    └── habits.md               # Habits API
```

## Prerequisites

To build and view the documentation, you need:

- **Python 3.7+**
- **pip** (Python package manager)

## Installation

Install MkDocs and the Material theme:

```bash
pip install mkdocs mkdocs-material
```

Or using a virtual environment (recommended):

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install mkdocs mkdocs-material
```

## Usage

### Option 1: Serve Locally (Development)

Start the development server with live reload:

```bash
cd docs/goal-tracker
mkdocs serve
```

The documentation will be available at: **http://localhost:8000**

Any changes to markdown files will automatically reload the browser.

### Option 2: Docker (Production)

Run the documentation in a Docker container:

```bash
# Build and run
cd docs/goal-tracker
docker build -t goals-tracker-docs .
docker run -d -p 8001:80 --name goals-tracker-docs goals-tracker-docs
```

Or use Docker Compose from project root:

```bash
docker compose up goals-tracker-docs
```

Documentation will be available at: **http://localhost:8001**

See [DOCKER.md](DOCKER.md) for detailed Docker deployment instructions.

### Build Static Site

Generate static HTML files:

```bash
mkdocs build
```

This creates a `site/` directory with all the HTML files.

### Deploy to GitHub Pages

Deploy documentation to GitHub Pages:

```bash
mkdocs gh-deploy
```

This builds the site and pushes to the `gh-pages` branch.

## Configuration

The documentation is configured in `mkdocs.yml`:

```yaml
site_name: Goals Tracker Documentation
theme:
  name: material
  palette:
    primary: indigo
    accent: indigo
```

### Theme

Using **Material for MkDocs** theme with features:
- Navigation tabs
- Search functionality
- Code syntax highlighting
- Responsive design

### Markdown Extensions

Enabled extensions:
- `pymdownx.highlight` - Code syntax highlighting
- `pymdownx.superfences` - Advanced code blocks
- `pymdownx.tabbed` - Tabbed content
- `admonition` - Note/warning boxes
- `codehilite` - Code highlighting
- `toc` - Table of contents with permalinks

## Writing Documentation

### Markdown Syntax

Standard Markdown is supported with extensions:

**Code Blocks:**
\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`

**Admonitions:**
```markdown
!!! note
    This is a note

!!! warning
    This is a warning
```

**Tabs:**
```markdown
=== "Tab 1"
    Content for tab 1

=== "Tab 2"
    Content for tab 2
```

### Adding New Pages

1. Create a new `.md` file in the appropriate directory
2. Add it to the `nav` section in `mkdocs.yml`
3. MkDocs will automatically include it

Example:
```yaml
nav:
  - New Section:
      - New Page: section/new-page.md
```

## Documentation Coverage

### ✅ Completed Sections

- **Home**: Welcome page with overview
- **Getting Started**: Installation and quick start guides
- **Architecture**: Complete system architecture documentation
  - Overview of system design
  - Backend architecture (Spring Boot, JWT, API design)
  - Frontend architecture (React, TypeScript, state management)
  - Database schema (PostgreSQL tables, relationships)
- **Development**: Setup and development guides
  - Backend development workflow
  - Frontend development workflow
  - Docker setup and commands (complete guide)
- **CI/CD**: Complete pipeline documentation
  - GitHub Actions workflow breakdown
  - Build, test, and deployment process
  - Secrets configuration
  - Optimization strategies
- **API Reference**: Authentication, Goals, and Habits APIs

### 📊 Documentation Statistics

- **Total Pages**: 15
- **Sections**: 6
- **Lines of Documentation**: ~2,500+
- **Code Examples**: 100+

## Contributing

When adding documentation:

1. **Follow structure** - Place files in appropriate directories
2. **Use templates** - Match existing documentation style
3. **Add examples** - Include code samples and diagrams
4. **Link pages** - Cross-reference related content
5. **Test locally** - Run `mkdocs serve` to preview

## Troubleshooting

### MkDocs Not Found

```bash
pip install mkdocs mkdocs-material
```

### Theme Not Loading

```bash
pip install --upgrade mkdocs-material
```

### Port Already in Use

```bash
mkdocs serve -a localhost:8001
```

### Build Errors

Check for:
- Broken internal links
- Invalid YAML in mkdocs.yml
- Missing files referenced in nav

## Additional Resources

- [MkDocs Documentation](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [Markdown Guide](https://www.markdownguide.org/)

## License

This documentation is part of the Goals Tracker project.
