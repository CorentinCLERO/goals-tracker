# Documentation Folder

This folder contains the project documentation built with **MkDocs**.

## What is this folder?

The `/docs` folder is dedicated to technical and user documentation for the Goals Tracker project. It uses **MkDocs**, a fast and simple static site generator designed for building project documentation.

## Structure

```
docs/
├── README.md           # This file
├── goal-tracker/       # MkDocs project
│   ├── mkdocs.yml     # MkDocs configuration file
│   └── docs/          # Documentation source files (Markdown)
│       └── index.md   # Homepage of the documentation
├── main.py            # Python scripts for documentation
├── pyproject.toml     # Python dependencies (uv)
└── .venv/             # Python virtual environment
```

## What can you find here?

This documentation includes:
- **API Documentation**: REST API endpoints, request/response formats
- **Architecture Overview**: System design, database schema, component diagrams
- **User Guides**: How to use the application features
- **Developer Guides**: Setup instructions, coding standards, contribution guidelines
- **Deployment**: Docker configuration, CI/CD pipeline details

## How to use

### Prerequisites
- Python 3.x
- `uv` package manager

### Setup & Run

1. **Navigate to the docs folder:**
   ```bash
   cd docs/goal-tracker
   ```

2. **Install dependencies:**
   ```bash
   uv sync
   ```

3. **Start the development server:**
   ```bash
   uv run mkdocs serve
   ```

4. **Open in browser:**
   - Navigate to `http://127.0.0.1:8000`
   - Live reload enabled: changes to `.md` files update automatically

### Build static site

To generate the static HTML documentation:
```bash
mkdocs build
```

Output will be in `goal-tracker/site/` directory.

## Adding documentation

1. Create new `.md` files in `goal-tracker/docs/`
2. Add navigation entries in `goal-tracker/mkdocs.yml`
3. Use Markdown syntax for content
4. Preview with `mkdocs serve`

## Resources

- [MkDocs Official Documentation](https://www.mkdocs.org)
- [Markdown Guide](https://www.markdownguide.org)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) (optional theme)

## Contributing

When adding features to the project:
1. Update relevant documentation pages
2. Add code examples where appropriate
3. Keep API documentation synchronized with backend changes
4. Include screenshots for UI features
