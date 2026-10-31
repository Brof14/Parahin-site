# Arseniy Parakhin — Personal Website

A lightweight bilingual personal website hosted by GitHub Pages at **https://parahin.space/**.

## Contents

- `index.html`: home, featured ByMeVPN project and social/contact links
- `lifestory.html`: personal story
- `assets/styles.css`: shared design, responsive rules and accessibility
- `assets/site.js`: language switching, local clock and pointer interaction
- `assets/favicon.svg`: favicon
- `robots.txt` and `sitemap.xml`: search discovery
- `CNAME`: GitHub Pages custom domain

## Development

No framework, bundler or production JavaScript dependencies are needed.
Serve the root directory through a local static HTTP server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 and test both pages in a browser.

## Checks

Node.js 22 or newer:

```bash
node --check assets/site.js
node --test tests/site.test.mjs
```

The `Site quality` workflow runs the same checks on pushes and pull requests.
These source checks do not replace manual cross-browser and mobile testing.

## Accessibility, privacy and performance

- Content renders without JavaScript; there is no full-screen loading overlay.
- English and Russian use authored translations and update the HTML document language.
- Interactive controls expose their selected state and keyboard focus.
- Animations respect `prefers-reduced-motion`.
- Avoid publishing detailed commuting routines or unnecessary personal details.
- Images remain JPEG assets and should be exported to WebP/AVIF after visual comparison.
- Keep `CNAME` aligned with the domain and enable HTTPS in GitHub Pages settings.
