# Contributing

## Commit convention

Format: `type(scope): message`

### Types

| Type | When |
|------|------|
| `feat` | new feature, component, or page |
| `fix` | bug fix |
| `refactor` | restructuring without behavior change |
| `build` | build system, dependencies, bundler config |
| `ci` | CI/CD pipeline and workflow files |
| `docs` | documentation, README, CLAUDE.md, CONTRIBUTING.md |
| `chore` | housekeeping, renames |

### Scopes

Scope = name of the component, page, or file being changed (e.g. `drawPage`, `colorPicker`, `images`).

Omit scope only for truly global commits (e.g. `init`).

### Rules

- Message lowercase, no trailing period

### Examples

```
feat(selectionPage): add image preview on hover
fix(drawPage): prevent canvas resize from losing drawing
refactor(colorPicker): extract into standalone component
chore: update dependencies
```

## Adding coloring images

Use the helper script to add a new image from picsvg.com:

```
./scripts/add-image.py '<picsvg-url>' <id> '<Polish label>'
```

The script handles download, viewBox crop, and `src/images.ts` registration.
Each new image should be a separate commit with scope `images`:

```
feat(images): add lion coloring image
chore(images): replace bear with updated version
```

## Directory naming

Page directories use `camelCase` starting with a lowercase letter (e.g. `drawPage/`, `selectionPage/`). Files co-located within a page directory are private to that page.
