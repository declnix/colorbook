# Colorbook

A touch-friendly coloring book web app for young children.

## Motivation

My wife and I wanted a simple, distraction-free coloring experience for our 3-year-old son — no ads, no menus, no friction. Just pick an animal and start coloring. We built it together as a small family project.

## Requirements

- **Node.js** 18+ — for development
- **Nix** — required by the `add-image.py` script (fetches `librsvg`, `curl`, `python3+pillow` on first run) and for production builds

## Getting started

```bash
npm install
npm run dev
```

The dev server prints a QR code to the terminal so you can open the app on a phone or tablet without typing the URL.

## Adding images

Images are sourced from [picsvg.com](https://picsvg.com). To add a new one:

```bash
./scripts/add-image.py '<picsvg-url>' <id> '<Polish label>'
```

Example:

```bash
./scripts/add-image.py 'https://picsvg.com/svg/abc123.svg?t=123' lion 'Lew'
```

The script downloads the SVG, strips an artifact line picsvg injects at the bottom, detects the tight content bounding box by rendering to PNG, rewrites the `viewBox` accordingly, saves the file to `public/images/<id>.svg`, and appends the entry to `src/images.ts`.

The first run fetches dependencies from the Nix cache; subsequent runs are fast.

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds the app with Nix and deploys it to GitHub Pages automatically.

## Live app

[https://declnix.github.io/colorbook/](https://declnix.github.io/colorbook/)
