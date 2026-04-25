# CLAUDE.md

## Commits

- Never add `Co-Authored-By` lines to commits.
- Read `CONTRIBUTING.md` and follow its commit convention before committing.

## Adding coloring images

To add a new image from picsvg.com, run:

```
./scripts/add-image.py '<picsvg-url>' <id> '<Polish label>'
```

Example:
```
./scripts/add-image.py 'https://picsvg.com/svg/abc123.svg?t=123' lion 'Lew'
```

The script: downloads the SVG, removes the stray bottom line picsvg injects,
detects the tight content bounding box by rendering to PNG, rewrites the
viewBox/width/height accordingly, saves to `public/images/<id>.svg`, and
appends the entry to `src/images.ts`.

The script requires `nix-shell` (present on this machine). First run fetches
`librsvg`, `curl`, and `python3+pillow` from the Nix cache — subsequent runs
reuse the cache and are fast.

## Comments

- Only add a comment when it explains a non-obvious workaround at a specific location. Do not describe what code does.
- Never add decorative section banners (`###…`) unless a file is long enough that navigation aids are genuinely necessary.
- All comments must be in English.
