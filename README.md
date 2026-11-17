# Zm’s Manna Bakeshop — website

Static site. No build step, no framework, no dependencies. Open `index.html`
in a browser, or serve the folder (`python3 -m http.server 8899`).

## What it is

A small-batch biscuit, bread and pasalubong bakehouse in P-2 Lumbo,
Valencia City, Bukidnon. The site is a single long page: a split banner
card, a scrolling ticker of product names, the story, six products with
detail popups, the bake process, freshness and packaging, visit info with a
map, and a footer.

## Documentation

| Doc | What it covers |
| --- | --- |
| [`docs/README.md`](docs/README.md) | Navigation hub — "I want to… → go to". |
| [`docs/BEGINNER-GUIDE.md`](docs/BEGINNER-GUIDE.md) | **Start here.** How the project works, how to find the CSS for any element, the CSS units and JavaScript glossaries, the naming rules, a full walkthrough, and talking points for presenting the code. |
| [`docs/JS-CSS-BRIDGE.md`](docs/JS-CSS-BRIDGE.md) | How a JS function changes something you can see. The state-class contract, the custom properties, effect tables, worked examples. |
| [`docs/CSS-GUIDE.md`](docs/CSS-GUIDE.md) | Every token, every selector, every breakpoint, the motion inventory, the stacking order, the unit policy. |
| [`docs/JS-GUIDE.md`](docs/JS-GUIDE.md) | Every function and data structure in `app.js`, with DOM targets. |
| [`DESIGN.md`](DESIGN.md) | The visual system: brand, colour, type, layout, motion, and the rules that keep it coherent. |

**The one idea that makes this project click:** CSS owns the look, JavaScript
owns the state, and they talk through **class names and CSS custom
properties**. JavaScript never makes a design decision — it never picks a
colour, a size or a shadow. It toggles `.is-open` / `.is-visible` /
`.is-shown` or sets `--gradient-from`, and the stylesheet reacts. (There are
seven documented exceptions where JavaScript writes a measured value inline,
such as the progress bar's width.) See
[`docs/JS-CSS-BRIDGE.md`](docs/JS-CSS-BRIDGE.md).

<<<<<<< HEAD
=======
## OpenCode in GitHub Codespaces

The repository ships a dev container that installs OpenCode 2 and loads this
machine's OpenCode configuration — agents, commands, skills, plugins and ECC —
**without** the local database or service secret. Push, create a Codespace, and
the terminal prints a one-time pairing link for the forwarded web UI on port
4096. See [`docs/opencode-codespaces.md`](docs/opencode-codespaces.md).

>>>>>>> 4dcacea4060d42f8ebc1886ae37d1a7c60e6636f
## File map

| File | What it does |
| --- | --- |
| `index.html` | The whole page. Sections in order: header, banner, ticker, story, products, craft (with packaging), order, visit, footer, product popup, photo viewer. |
| `app.js` | All behaviour, as plain functions: product data, rendering, popup, photo viewer, menu, scroll reveal, counters, progress bar, back-to-top. |
| `styles/` | Five stylesheets, loaded in order. See the table below. |
| `assets/` | Product photos, the banner crops, the marketing graphics, the logo, favicons. |
| `docs/` | Project documentation. |
<<<<<<< HEAD
=======
| `.devcontainer/` | GitHub Codespaces image: OpenCode 2, the start/pair scripts and the config sync. |
| `opencode/` | Exported OpenCode configuration copied into the container (no database, no service secret). |
>>>>>>> 4dcacea4060d42f8ebc1886ae37d1a7c60e6636f
| `reference/hero.html` | The banner as a standalone fragment, for reuse in other pages. *Local only — not in version control.* |
| `archive/legacy-2026-11-12/` | The previous design. Not referenced by anything. *Local only — not in version control.* |

### Stylesheets (load in this order)

| File | What it styles |
| --- | --- |
| `theme.css` | The design tokens — every colour, font, radius and shadow. Change the palette here. |
| `base.css` | The reset, typography, `.container`, `.section`, the skip link, the noise overlay, the progress bar, the reveal system. |
| `components.css` | The parts used more than once: labels, buttons, the tag, the fallback letters, the header, the menu, the product popup, the photo viewer, the footer. |
| `sections.css` | This particular page: banner, ticker, story, products, craft (with packaging), order, visit. |
| `responsive.css` | The breakpoints (1024 / 768 / 560) and `prefers-reduced-motion`. |

See [`docs/CSS-GUIDE.md`](docs/CSS-GUIDE.md) for the full selector index.

## How it works

```
index.html          structure      →  <section id="products"> … </section>
styles/sections.css presentation   →  #products { background: var(--color-surface-alt) }
app.js              behaviour      →  opens the popup, adds .is-open, focuses the close button
```

Three rules hold it together:

1. **JavaScript owns state, CSS owns appearance.** JS never sets a colour or
   a size; it toggles a class or sets a custom property, and the stylesheet
   reacts.
2. **One stylesheet per job.** `theme` for values, `base` for structure,
   `components` for the reusable parts, `sections` for this page,
   `responsive` for the breakpoints.
3. **Tokens carry the palette.** `var(--color-gold)` in CSS. Six values stay
   literal on purpose — the ink on gold, the cream on navy, the navy banner
   panel, the two scrims and the gradient fallbacks — and they are all listed
   in [`docs/CSS-GUIDE.md` §2.4](docs/CSS-GUIDE.md#24-the-raw-values-that-stay-raw).

**Units.** `rem` for anything that measures a size, `px` only for hairlines
and for the pill shape, `%` for anything relative to its parent. `1rem` is
`16px` at the browser default, so the design scales with the visitor's font
size.

**Class names are plain words.** `banner`, `card`, `tag`, `photo viewer`,
`section label`, `primary button` — never `hero`, `marquee`, `tile`, `chip`
or `ghost`. The full list is in
[`docs/BEGINNER-GUIDE.md` §6](docs/BEGINNER-GUIDE.md#6-the-naming-rules).

## Editing cheat sheet

- **Change a colour or font** → `styles/theme.css`.
- **Change site-wide spacing or the section rhythm** → `styles/base.css` (`.section`).
- **Add a button style** → `styles/components.css`.
- **Edit product names, photos, copy, gradients** → the `PRODUCTS` array at the top of `app.js`.
- **Edit the photo viewer photos** → the `PHOTOS` array in `app.js`.
- **Change the Facebook link** → `SITE_CONFIG.facebook` in `app.js` (currently a search placeholder).
- **Change hours / address / phone** → both `index.html` (visit section + footer) — keep them in sync.
- **Add a new section** → new file in `styles/`, a `<link>` in `index.html` `<head>` (before `responsive.css`), and the section markup in `index.html`. Do not grow `base.css` past tokens/reset/primitives.
- **Change breakpoints** → `styles/responsive.css`.
- **Add a visual state that JS toggles** → add the class rule in the owning stylesheet, then add it to the state-class table in [`docs/JS-CSS-BRIDGE.md`](docs/JS-CSS-BRIDGE.md).

## Conventions

- Gold (`--color-gold`) never carries white text; it always uses `--color-ink` (`#172033`).
- The banner card is the only dark block; navy elsewhere is text only.
- Cards are separated by `--color-border` hairlines, not shadows. Shadows are reserved for the banner card, the popup and floating controls.
- The Otap & Loaf line has no photo, so its card renders as a cream "label card" (`.is-logo`).
- Copy stays in the bakehouse's own register: location, hours, phone, DTI note, product notes from the label.

## Running checks

There is no build or test suite. Verify by hand:

- Open `index.html` in a browser, or serve with `python3 -m http.server 8899`.
- Check at 360 / 768 / 1024 / 1440 px widths.
- Tab through the page: skip link, menu, product popup (trap + Escape), photo viewer (arrows + Escape).
- Close the popup and check the keyboard focus returns to the product card you clicked.
- Toggle `prefers-reduced-motion` in DevTools and confirm reveals are visible and the ticker stops.
- Confirm no console errors and no broken images.
