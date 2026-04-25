#!/usr/bin/env nix-shell
#!nix-shell -i python3 -p "python3.withPackages(ps: [ps.pillow])" librsvg curl

"""
Add a coloring-book image from picsvg.com to the project.

Usage:
  ./scripts/add-image.py <url> <id> <label>

Example:
  ./scripts/add-image.py 'https://picsvg.com/svg/abc123.svg?t=...' lion 'Lew'

What it does:
  1. Downloads the SVG from picsvg.com.
  2. Removes the stray horizontal line that picsvg adds at the bottom.
  3. Renders the SVG to a small PNG and finds the tight content bounding box.
  4. Rewrites the SVG's viewBox / width / height to that box (with a margin).
  5. Saves the result to public/images/<id>.svg.
  6. Appends an entry to src/images.ts if the id is not already there.
"""

import io
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = ROOT / 'public' / 'images'
IMAGES_TS  = ROOT / 'src' / 'images.ts'

MARGIN = 30          # SVG units of padding around the detected content
RENDER_WIDTH = 500   # pixels used when rendering the SVG for bbox detection

# Horizontal-line path picsvg adds at the bottom of every SVG
LINE_RE = re.compile(r'\n<path d="M\d+ 10 .*?"/>', re.DOTALL)


def download(url: str) -> str:
    result = subprocess.run(['curl', '-fsSL', url], capture_output=True)
    if result.returncode != 0:
        sys.exit(f'Download failed: {result.stderr.decode().strip()}')
    return result.stdout.decode()


def remove_bottom_line(svg: str) -> str:
    return LINE_RE.sub('', svg)


def content_bbox(svg: str, W: float, H: float) -> tuple[float, float, float, float]:
    """
    Render the SVG and return (x, y, width, height) in SVG units
    for the tight bounding box of non-white content.
    """
    from PIL import Image

    # Render at RENDER_WIDTH wide; height proportional
    render_h = int(RENDER_WIDTH * H / W)
    png = subprocess.run(
        ['rsvg-convert', '-w', str(RENDER_WIDTH), '-h', str(render_h),
         '--keep-aspect-ratio', '-'],
        input=svg.encode(), capture_output=True
    ).stdout

    img = Image.open(io.BytesIO(png)).convert('RGBA')
    pw, ph = img.size
    pixels = img.load()

    min_x, max_x = pw, 0
    min_y, max_y = ph, 0
    for y in range(ph):
        for x in range(pw):
            r, g, b, a = pixels[x, y]
            if a > 20 and not (r > 240 and g > 240 and b > 240):
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y

    if min_x > max_x:
        sys.exit('No content detected in rendered SVG.')

    sx = W / pw
    sy = H / ph
    x0 = max(0.0, min_x * sx - MARGIN)
    y0 = max(0.0, min_y * sy - MARGIN)
    x1 = min(W,   max_x * sx + MARGIN)
    y1 = min(H,   max_y * sy + MARGIN)
    return x0, y0, x1 - x0, y1 - y0


def apply_bbox(svg: str, vx: float, vy: float, vw: float, vh: float) -> str:
    vb = f'{vx:.2f} {vy:.2f} {vw:.2f} {vh:.2f}'
    svg = re.sub(r'viewBox="[^"]*"', f'viewBox="{vb}"', svg)
    svg = re.sub(r'width="[^"]*"',   f'width="{vw:.2f}"',  svg)
    svg = re.sub(r'height="[^"]*"',  f'height="{vh:.2f}"', svg)
    return svg


def add_to_images_ts(img_id: str, label: str) -> None:
    text = IMAGES_TS.read_text()
    if f"id: '{img_id}'" in text:
        print(f'images.ts: entry for "{img_id}" already exists, skipping.')
        return
    entry = (
        f"  {{ id: '{img_id}',{' ' * max(1, 10 - len(img_id))}"
        f"label: '{label}',{' ' * max(1, 12 - len(label))}"
        f"src: `${{import.meta.env.BASE_URL}}images/{img_id}.svg` }},"
    )
    text = re.sub(r'(\n\])', f'\n{entry}\\1', text)
    IMAGES_TS.write_text(text)
    print(f'images.ts: added entry for "{img_id}".')


def main():
    if len(sys.argv) != 4:
        sys.exit('Usage: add-image.py <url> <id> <label>')

    url, img_id, label = sys.argv[1], sys.argv[2], sys.argv[3]

    if not re.fullmatch(r'[a-z0-9_-]+', img_id):
        sys.exit('id must be lowercase letters, digits, hyphens, or underscores.')

    print(f'Downloading {url} ...')
    svg = download(url)

    svg = remove_bottom_line(svg)

    m = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg)
    if not m:
        sys.exit('SVG does not have the expected "0 0 W H" viewBox. Is this a picsvg URL?')
    W, H = float(m.group(1)), float(m.group(2))
    print(f'Original canvas: {W} × {H} SVG units')

    print('Detecting content bounding box ...')
    vx, vy, vw, vh = content_bbox(svg, W, H)
    print(f'Content bbox: x={vx:.1f} y={vy:.1f} w={vw:.1f} h={vh:.1f}  (aspect {vw/vh:.2f}:1)')

    svg = apply_bbox(svg, vx, vy, vw, vh)

    out_path = IMAGES_DIR / f'{img_id}.svg'
    out_path.write_text(svg)
    print(f'Saved: {out_path}')

    add_to_images_ts(img_id, label)


if __name__ == '__main__':
    main()
