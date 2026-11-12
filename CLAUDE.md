# Project Instructions — Zm's Manna Bakeshop

A static website for a bakery. Vanilla HTML, CSS and JavaScript. No build
step, no framework, no dependencies, no package manager. Nothing to install.

## Layout

```
index.html      the whole page
app.js          all behaviour, as plain functions
styles/
  theme.css        the design tokens — every colour, font, radius, shadow
  base.css         the reset, typography, layout primitives, reveal system
  components.css   the reusable parts: labels, buttons, header, menu, popup, viewer, footer
  sections.css     this particular page: banner, ticker, story, products, craft, freshness, visit
  responsive.css   every breakpoint, plus reduced motion
assets/         photos, logo, favicons
docs/           beginner guide, CSS guide, JS guide, JS↔CSS bridge
reference/      the banner as a reusable fragment
archive/        the previous design — frozen, not referenced
```

## Code style

- **Class names are plain words**, never design jargon. `banner`, `card`,
  `tag`, `photo viewer`, `section label`, `primary button`. Never `hero`,
  `marquee`, `tile`, `chip`, `ghost`, `monogram`.
- **Kebab-case** for classes and ids: `.product-card`, `#product-modal`.
- **State classes always start with `is-`**: `.is-open`, `.is-visible`,
  `.is-active`, `.is-hidden`, `.is-shown`.
- **A class name says what the element IS**, not what it looks like.
- **Ids are only for elements JavaScript needs to find.**
- **JavaScript owns state, CSS owns appearance.** JS toggles a class or sets
  a custom property; it never sets a colour or a size.
- **Units:** `rem` for anything that measures a size, `px` only for
  hairlines and the pill radius, `%` for anything relative to its parent.
- **Tokens only:** `var(--color-gold)` in CSS, never a raw hex outside
  `theme.css` (and the two deliberate navy/cream exceptions in
  `sections.css` and `components.css`).
- Every stylesheet opens with a `CONTENTS` index. Every function carries a
  comment saying what it looks for and what it changes on screen.

## The one thing to understand

```js
productModal.classList.add("is-open");   // JavaScript changes the state
```

```css
.modal.is-open{visibility:visible;opacity:1}   /* CSS reacts to it */
```

Read [`docs/JS-CSS-BRIDGE.md`](docs/JS-CSS-BRIDGE.md) before changing any
interaction.

## Commands

There is no build, no test runner and no linter. Verify by hand:

```bash
python3 -m http.server 8899     # serve the folder
```

Then check, at 360 / 768 / 1024 / 1440 px:

- Every section renders with its backgrounds, borders and spacing.
- Clicking a product card opens the popup with the right product and five
  spec rows; "View full image" opens the viewer; the arrows step; Escape
  closes each one; focus returns to the card.
- The Otap card renders as a cream label card with fallback letters.
- The menu opens, focus moves into it, Escape returns focus to the button.
- Scrolling fills the progress bar, hides the header on the way down, shows
  the back-to-top button, counts the statistics and reveals the sections.
- With `prefers-reduced-motion` on, reveals are visible and the ticker stops.
- No console errors, no broken images.

## Before you finish

- Run the grep for stale names: no `hero`, `marquee`, `chip`, `mono`,
  `g-item`, `lb-`, `mm-`, `v-card`, `f-grid` anywhere outside `archive/`.
- If you added a state class, add it to the table in
  [`docs/JS-CSS-BRIDGE.md`](docs/JS-CSS-BRIDGE.md) §2 and to the selector
  index in [`docs/CSS-GUIDE.md`](docs/CSS-GUIDE.md) §4.
- If you added a product or changed the site settings, note it in
  [`docs/BEGINNER-GUIDE.md`](docs/BEGINNER-GUIDE.md).

## Docs

- [`docs/BEGINNER-GUIDE.md`](docs/BEGINNER-GUIDE.md) — start here.
- [`docs/CSS-GUIDE.md`](docs/CSS-GUIDE.md) — every token and selector.
- [`docs/JS-GUIDE.md`](docs/JS-GUIDE.md) — every function.
- [`docs/JS-CSS-BRIDGE.md`](docs/JS-CSS-BRIDGE.md) — the state contract.
