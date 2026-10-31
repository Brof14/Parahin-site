#!/usr/bin/env bash
set -euo pipefail

# Requires Google's WebP encoder (cwebp).
command -v cwebp >/dev/null || { echo "Install the 'webp' package first." >&2; exit 1; }
mkdir -p assets/images

cwebp -quiet -q 82 -resize 240 0 photo_2026-06-28_20-30-13.jpg -o assets/images/avatar.webp
cwebp -quiet -q 80 altai-bg.jpg -o assets/images/altai-bg.webp

echo "WebP images updated in assets/images/"
