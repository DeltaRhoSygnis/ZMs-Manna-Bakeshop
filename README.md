# Zm’s Manna Bakeshop — website

Static site. No build step, no framework, no dependencies. Open `index.html`
in a browser, or serve the folder (`python3 -m http.server 8899`).

## What it is

A small-batch biscuit, bread and pasalubong bakehouse in P-2 Lumbo,
Valencia City, Bukidnon. The site is a single long page: a sticky header and
navigation, a split banner card, the wholesale and retail pathways, the
product catalog, packaging, a product showcase gallery, the story, contact
details with a map, and a footer.

## File map

| File | What it does |
| --- | --- |
| `index.html` | The whole page. Sections in order: header, `#home` (banner), wholesale & retail pathways, `#products`, `#packaging`, product showcase gallery, `#about`, `#contact`, footer. |
| `styles/` | Five stylesheets, loaded in order. See the table below. |
| `assets/` | Product photos, banner crops, marketing graphics, the logo, favicons. |
| `app.js` | The behaviour layer: site config, product data, tile rendering, product popup, photo viewer, mobile menu, scroll reveal, animated counters, scroll progress. |
| `googlef14fab38a01fa408.html` | Google Search Console site-verification file. Do not delete. |

## Stylesheets (load in this order)

| File | What it styles |
| --- | --- |
| `styles/global.css` | The design tokens (`:root`), reset, typography, `.container`, `.section`, and the shared parts: tags, buttons, boxes, product cards, packaging, about, map, contact, CTA. |
| `styles/header-footer.css` | The sticky header, the navigation and the footer. |
| `styles/home.css` | Homepage-specific section styling. |
| `styles/animation.css` | The scroll progress bar and the keyframes used by the reveal system. |
| `styles/media.css` | The breakpoints (1024 / 768 / 560) and the responsive overrides. |

## How it works

```
index.html          structure      →  <section id="products"> … </section>
styles/global.css   presentation   →  .product-box { … }
app.js              behaviour      →  builds the tiles, opens the popup, toggles .is-open
```

Three rules hold it together:

1. **JavaScript owns state, CSS owns appearance.** JS never sets a colour or
   a size; it toggles a class or sets a custom property, and the stylesheet
   reacts.
2. **One stylesheet per job.** `global` for tokens and shared parts,
   `header-footer` for chrome, `home` for this page, `animation` for motion,
   `media` for breakpoints.
3. **Tokens carry the layout.** Spacing lives in `:root` as `--gutter`,
   `--section-space`, `--grid-gap`, `--box-pad` and friends, so the rhythm
   changes in one place.

**Units.** `rem` for anything that measures a size, `px` only for hairlines
and pill shapes, `%` for anything relative to its parent. `1rem` is `16px` at
the browser default, so the design scales with the visitor’s font size.

## Editing cheat sheet

- **Change a colour or font** → the `:root` block in `styles/global.css`.
- **Change site-wide spacing or the section rhythm** → `--section-space` /
  `--gutter` in `styles/global.css`.
- **Add a button style** → `.btn` in `styles/global.css`.
- **Edit product names, photos, copy, gradients** → the `PRODUCTS` array in
  `app.js`.
- **Edit the photo viewer photos** → the `PHOTOS` array in `app.js`.
- **Change the Facebook link** → `SITE_CONFIG.facebook` in `app.js`.
- **Change hours / address / phone** → both `index.html` (contact section and
  footer) — keep them in sync.
- **Add a new section** → new file in `styles/`, a `<link>` in `index.html`
  `<head>` (before `media.css`), and the markup in `index.html`.
- **Change breakpoints** → `styles/media.css`.

## Conventions

- Cards are separated by hairline borders, not shadows.
- Copy stays in the bakehouse’s own register: location, hours, phone, DTI
  note, product notes from the label.
- Class names are plain words that say what the thing is, not what it looks
  like.

## Running checks

There is no build or test suite. Verify by hand:

- Open `index.html` in a browser, or serve with `python3 -m http.server 8899`.
- Check at 360 / 768 / 1024 / 1440 px widths.
- Tab through the page: header links, buttons, any open popup or viewer
  (trap + Escape), and confirm focus returns to the control that opened it.
- Toggle `prefers-reduced-motion` in DevTools and confirm content is still
  visible.
- Confirm no console errors and no broken images.

## Known gaps

- `index.html` has no `<script>` tag, so `app.js` is not loaded. The page
  currently renders from `index.html` + CSS only.
- The footer block at the end of `index.html` is wrapped in an unclosed
  `<!-- --` comment, so it does not render.
- Several links point at `wholesale.html`, which is not in this repository.
- A few `assets\...` paths use Windows backslashes, which do not resolve on
  the web.

## Local-only archive

Development scaffolding lives in `.archive/` on the author’s machine and is
gitignored, so it never appears in this repository: the older `zm-manna/`
build, layout `mockups/`, `rename/` image drafts, the OpenCode/Codespaces dev
container, and the `docs/` guides.
