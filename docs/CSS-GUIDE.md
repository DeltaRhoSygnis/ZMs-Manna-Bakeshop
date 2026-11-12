# CSS Guide — Zm's Manna Bakeshop

Complete reference for `styles/`. Covers the layering model, every token,
every selector, every breakpoint, the motion inventory, the stacking order,
and what the refactor removed.

Related: [`BEGINNER-GUIDE.md`](./BEGINNER-GUIDE.md) ·
[`JS-CSS-BRIDGE.md`](./JS-CSS-BRIDGE.md) · [`JS-GUIDE.md`](./JS-GUIDE.md) ·
[`../DESIGN.md`](../DESIGN.md)

---

## 1. How the CSS is organised

### 1.1 The five files

| File | Lines | Rules | Owns |
| --- | --- | --- | --- |
| `theme.css` | 32 | 1 | Every custom property. Nothing else. |
| `base.css` | 66 | 24 | The reset, typography, layout primitives, page overlays, the reveal system. |
| `components.css` | 195 | 96 | The parts used more than once: labels, buttons, the tag, fallback text, the header, the menu, the popup, the photo viewer, the footer. |
| `sections.css` | 244 | 87 | This particular page: banner, ticker, story, products, craft, freshness, visit. |
| `responsive.css` | 49 | 26 | Every breakpoint, plus reduced motion. |

### 1.2 Load order

`index.html` links them in this order, and the order is the cascade order:
the most general rules first, the most specific last.

```
theme.css → base.css → components.css → sections.css → responsive.css
```

The same order is used inside `index.html` for the `<link>` tags. Each file
opens with a header comment listing the groups it holds.

**A note on order.** The consolidation moved several rules between files, and
rule order decides which of two equally specific rules wins. Every rule that
moved was checked for a competitor that could match the same element at the
same specificity. None of them has one — but if you move a rule between
files, check that too. The pairs that *do* rely on specificity are listed in
§1.4.

### 1.3 The layering rules

- **Tokens never appear as literals in later files.** Always `var(--color-gold)`.
- **Base holds primitives, not sections.** `.container`, `.section`,
  `.screen-reader-only`, `.skip-link`, `.noise-overlay`, `.scroll-progress`
  and the reveal system are the only things allowed in `base.css`.
- **A section file may only style its own section**, plus shared components
  scoped to that section (`.banner-text .btn` in `sections.css`).
- **`responsive.css` owns every breakpoint override**, so a breakpoint rule is
  never scattered through the section files.
  - **Exception:** `sections.css` carries local `@media` blocks for the
    banner only, because its layout changes are specific to that one block.

### 1.4 Specificity, and where the rules rely on it

Two pairs depend on specificity rather than source order:

| Pair | Specificity | Why it works |
| --- | --- | --- |
| `.btn.btn-secondary` vs `.banner-text .btn.btn-secondary` | (0,2,0) vs (0,3,0) | The banner's outlined button is transparent and cream, because the banner rule is more specific. |
| `.product-card:hover .product-caption` vs `.product-grid .product-caption` | (0,3,0) vs (0,2,0) | In the product grid the caption is always visible. The hover rule is stronger, but it sets the same values, so it changes nothing there — it only matters for captions outside the grid. |

---

## 2. Design tokens

All in `theme.css`, under `:root`. This is the one place to change the
palette or the type system.

### 2.1 Colour

| Token | Value | Where it is used |
| --- | --- | --- |
| `--color-background` | `#F8F3E8` | The page cream, with a 1.375rem dot grid |
| `--color-surface` | `#FFFDF8` | Cards, footer, the outlined button |
| `--color-surface-alt` | `#F2EDE3` | The alternating band behind products and freshness |
| `--color-ink` | `#172033` | Body copy. Also the mandatory text colour on gold. |
| `--color-heading` | `#123B68` | Display type, headings, values |
| `--color-muted` | `#4D5667` | Secondary copy |
| `--color-border` | `#DED5C6` | Every hairline border |
| `--color-gold` | `#D2A62A` | Buttons, marks, accents — always paired with `--color-ink` |
| `--color-gold-dark` | `#C39722` | The gold gradient's end, and the menu button's border |
| `--color-gold-soft` | `#F2DF9E` | Accents **on navy** |
| `--color-accent` | `#945F2F` | Section labels, the tag, the spec labels, the focus ring |
| `--color-accent-soft` | `rgba(210,166,42,.14)` | The tag's and the icon's tinted fill |

### 2.4 The raw values that stay raw

Six values are written literally outside `theme.css`, because they are not
tokens — they are either a second colour on the same surface, or a scrim:

| Value | Where | Why |
| --- | --- | --- |
| `#172033` | `base.css` ×2, `components.css` ×7, `sections.css` ×1 | The ink on a gold surface. It is `--color-ink`, spelled out because the rule is "a gold surface carries ink", not "a gold surface carries this token". |
| `#F8F3E8` | `components.css` ×3, `sections.css` ×5 | The cream on the navy banner panel and on the dark overlays. |
| `#123B68` | `sections.css` ×1 | The navy banner panel itself — a *field*, not text. |
| `rgba(11,39,70,…)` | `components.css` ×2, `sections.css` ×2 | The scrim over the page and the photo-viewer arrows. |
| `#D9A05B` / `#8C4A1F` | `components.css` ×1 each | The fallback gradient behind a card whose `--gradient-from` has not been set yet. |

Changing the palette means changing these too. They are listed in §10.

### 2.2 Type

| Token | Value | Role |
| --- | --- | --- |
| `--font-heading` | `"Fraunces", Georgia, serif` | Headings, the brand name, the banner title, the stat numbers, the photo caption |
| `--font-body` | `"DM Sans", Arial, sans-serif` | Everything else: body, labels, buttons, meta rows |

Both are loaded from Google Fonts in `index.html` `<head>` with `preconnect`.
Fraunces is requested at `opsz` 9–144, weights 600/700, italic.

### 2.3 Shape, depth and spacing

| Token | Value | Where it is used |
| --- | --- | --- |
| `--card-radius` | `1.375rem` | Card radius: `.stat`, `.feature-card`, `.visit-card`, `.product-card`, `.map-wrapper` |
| `--header-height` | `4rem` | `scroll-padding-top`, the mobile menu's padding, the banner's top margin |
| `--shadow` | `0 1.125rem 2.75rem -1.125rem` | The banner card, `.modal-box`, `#menu-button:hover`, `#back-to-top` |
| `--shadow-small` | `0 0.5rem 1.5rem -0.75rem` | Resting cards, `.brand`, `.map-wrapper` |

Radii that are **not** tokens, because they are one-off by design: `1.5rem`
banner, `1.625rem` popup, `1.375rem` photo frame, `999px` pill.

`--card-radius` also drives `.map-wrapper`.

---

## 3. The unit policy

One rule, applied everywhere:

> **`rem` for anything that measures a size. `px` only for hairlines and for
> the pill shape. `%` for anything relative to its parent.**

`1rem` is `16px` at the browser default, so this is numerically identical for
a visitor who has not changed their font size, and it scales with the font
size for one who has.

**`px` survives in exactly four kinds of place:**

| Kind | Where |
| --- | --- |
| Border widths | `border:1px`, `border:1.5px`, `border:2px` |
| Outline | `outline:2px`, `outline-offset:3px` |
| The pill radius | `border-radius:999px` on `.btn`, `.tag`, `.brand`, `#menu-button` |
| Breakpoints | `@media (max-width:1024px)` |

The full glossary of units is in
[`BEGINNER-GUIDE.md` §3](./BEGINNER-GUIDE.md#3-css-units--what-each-one-means).

---

## 4. Selector index

Every selector in `styles/`, grouped by file.

### theme.css

- `:root` — all 18 custom properties.

### base.css

**Reset** — `*`, `*::before`, `*::after`, `img`, `a`, `button`

**The page** — `html`, `body`, `body.scroll-locked`

**Headings and selection** — `h1`, `h2`, `h3`, `::selection`, `:focus-visible`

**Layout primitives** — `.container`, `.section`

**Reading aids** — `.screen-reader-only`, `.skip-link`, `.skip-link:focus`

**Page overlays** — `.noise-overlay`, `.scroll-progress`, `.scroll-progress span`

**Reveal on scroll** — `.js [data-reveal]`, `.js [data-reveal].is-visible`

### components.css

**Section labels** — `.section-label`, `.section-label::before`,
`.section-header`, `.section-header h2`, `.section-subtitle`

**Buttons** — `.btn`, `.btn .btn-arrow`, `.btn:hover .btn-arrow`,
`.btn.btn-primary`, `.btn.btn-primary:hover`, `.btn.btn-secondary`,
`.btn.btn-secondary:hover`

**The tag** — `.tag`

**Fallback text** — `.fallback-text`, `.image-missing img`,
`.image-missing .fallback-text`

**The header** — `#navbar`, `#navbar.is-hidden`, `#navbar > *`, `.brand`,
`.brand-logo`, `.brand-logo img`, `.brand-name`, `.brand small`,
`#menu-button`, `#menu-button:hover`, `.menu-button-text`, `.menu-icon`,
`.menu-icon span`, `#menu-button.is-active .menu-icon span:nth-child(1|2|3)`

**The full-screen menu** — `#mobile-menu`, `#mobile-menu.is-open`,
`.menu-links`, `.menu-links a`, `.menu-links a:hover`, `.menu-links a i`,
`#mobile-menu.is-open .menu-links a`,
`#mobile-menu.is-open .menu-links a:nth-child(1…7)`, `.menu-footer`,
`.menu-footer-text`

**The product popup** — `.modal`, `.modal.is-open`, `.modal-box`,
`.modal.is-open .modal-box`, `.modal-close`, `.modal-close:hover`,
`.modal-media`, `.modal-media::after`, `.modal-media img`,
`.modal-media img.is-contained`, `.modal-media.is-logo`,
`.modal-media .fallback-text`, `.modal-info`, `.modal-info h3`,
`.modal-description`, `.spec`, `.spec div`, `.spec dt`, `.spec dd`,
`.modal-note`

**The photo viewer** — `.photo-viewer`, `.photo-viewer.is-open`,
`.photo-frame`, `.photo-viewer.is-open .photo-frame`, `.photo-image`,
`.photo-bar`, `.photo-caption`, `.photo-counter`, `.photo-close`,
`.photo-close:hover`, `.photo-prev`, `.photo-next`, `.photo-prev:hover`,
`.photo-next:hover`

**The footer** — `.footer`, `.footer-grid`, `.footer-brand p`,
`.footer-column h3`, `.footer-column a`, `.footer-column span`,
`.footer-column a:hover`, `.footer-bottom`, `.footer-star`, `#back-to-top`,
`#back-to-top.is-shown`, `#back-to-top:hover`

### sections.css

**The banner** — `.banner`, `.banner-image`, `.banner-image img`,
`.banner-image .fallback-text`, `.banner-caption`, `.banner-text`,
`.banner-logo img`, `.banner-copy`, `.banner-text .section-label`,
`.banner-text .section-label::before`, `.banner-title`, `.banner-tagline`,
`.banner-description`, `.banner-description b`, `.banner-buttons`,
`.banner-text .btn`, `.banner-text .btn.btn-secondary`,
`.banner-text .btn.btn-secondary:hover`, `.banner-details`,
`.banner-details > div`, `.banner-details > div:last-child`,
`.banner-details span`, `.banner-details p`

**The ticker** — `.ticker`, `.ticker-track`, `.ticker:hover .ticker-track`,
`.ticker-item`, `.ticker-star`, `@keyframes ticker-scroll`

**The story** — `.story-grid`, `.story-copy h2`, `.story-copy p`,
`.story-copy p b`, `.stats`, `.stat`, `.stat:hover`, `.stat .stat-number`,
`.stat .stat-label`

**The products** — `#products`, `.product-grid`, `.product-card`,
`.product-card:hover`, `.product-card img`, `.product-card:hover img`,
`.product-caption`, `.product-card:hover .product-caption`,
`.product-card:focus-visible .product-caption`, `.product-grid .product-caption`,
`.product-grid .product-card`, `.product-grid .product-card img.is-contained`,
`.product-grid .product-card.is-logo`,
`.product-grid .product-card.is-logo .product-caption`

**The craft** — `.steps`, `.steps::before`, `.step`, `.step-number`,
`.step:hover .step-number`, `.step h3`, `.step p`

**The freshness** — `#freshness`, `.feature-list`, `.feature-card`,
`.feature-card:hover`, `.feature-icon`, `.feature-icon svg`,
`.feature-card h3`, `.feature-card p`

**The visit** — `.visit-grid`, `.visit-cards`, `.visit-card`,
`a.visit-card:hover`, `.visit-label`, `.visit-value`, `.visit-detail`,
`.map-wrapper`, `.map-wrapper iframe`, `.visit-note`, `.visit-note b`

**The banner on smaller screens** (its own `@media` blocks in this file) —
`@media (max-width:1024px)`: `.banner`, `.banner-image`, `.banner-text`,
`.banner-title` · `@media (max-width:768px)`: `.banner-title` ·
`@media (max-width:560px)`: `.banner`, `.banner-text`, `.banner-title`,
`.banner-details > div`

### responsive.css

- `@media (max-width:1024px)` — `.product-grid`, `.steps`, `.feature-list`,
  `.steps::before`, `.story-grid`, `.visit-grid`, `.footer-grid`
- `@media (max-width:768px)` — `#menu-button`, `.modal-box`, `.modal-media`
- `@media (max-width:560px)` — `.section`, `.product-grid`, `.visit-cards`,
  `.steps`, `.feature-list`, `.stats`, `.footer-grid`, `.spec div`,
  `.photo-prev`, `.photo-next`
- `@media (prefers-reduced-motion:reduce)` — `html`, `*`, `*::before`,
  `*::after`, `.js [data-reveal]`, `.ticker-track`

---

## 5. Breakpoints

Three breakpoints, all `max-width`. Above 1024px the layout is fluid, so no
rule is needed.

| Width | What changes |
| --- | --- |
| **1024px** | `.product-grid` → 2 columns. `.steps`, `.feature-list` → 2 columns and the dashed rail is hidden. `.story-grid`, `.visit-grid` → 1 column. `.footer-grid` → 2 columns. |
| **768px** | `#menu-button` stays visible. `.modal-box` → 1 column, 90vh max. `.modal-media` → `17.5rem` min-height. |
| **560px** | `.section` padding tightens. `.product-grid`, `.visit-cards`, `.steps`, `.feature-list`, `.stats` → 1 column. `.footer-grid` → 1 column. `.spec div` stacks the label above the value. `.photo-prev` / `.photo-next` move to `0.5rem` from the edges. |

The banner has its own local breakpoints in `sections.css`: at 1024px it
stacks into one column with a 16:9 photo; at 768px and 560px its type scale
and padding shrink.

**No breakpoint above 1024px.** Above that, `clamp()`, `min()` and `fr` do the
work.

### Reduced motion

`responsive.css` `@media (prefers-reduced-motion:reduce)`:

1. `html { scroll-behavior:auto }` — no smooth scroll.
2. `*, *::before, *::after` — animation and transition durations forced to
   `.01ms`, iteration count to 1.
3. `.js [data-reveal]` — forced visible.
4. `.ticker-track` — `animation:none`; the strip stops.

`app.js` mirrors this: the `userPrefersLessMotion` flag disables the counter
animation, the smooth scroll on back-to-top, and the whole mouse-effects
block.

---

## 6. Motion inventory

### Keyframes

| Name | File | Used by |
| --- | --- | --- |
| `ticker-scroll` | sections.css | `.ticker-track` |

### Transitions

| Effect | Where |
| --- | --- |
| `opacity` + `visibility` | `.modal`, `.photo-viewer`, `#mobile-menu` — `visibility 0s linear .35s` delays the hide until the fade finishes |
| `transform` + `border-color` | `.stat`, `.feature-card`, `.visit-card` |
| `transform` + `box-shadow` | `.product-card` |
| `all` | `.step-number` |
| `transform` on the image | `.product-card img` — a slow zoom on hover |
| `opacity` + `translate` | `.product-caption`, `#back-to-top` |
| `opacity` + `transform` | `.js [data-reveal]` — the rise and fade |
| `background` / `color` / `border-color` | Buttons, the tag, hover states |
| `rotate` | `.modal-close`, `.photo-close` |
| `top` | `.skip-link` |
| `color` | `body`, `.footer-column a` |
| `transform` on `.btn-arrow` | The arrow nudges right on hover |
| `transform` on `.menu-icon span` | The three bars fold into an X |

---

## 7. Stacking order

Every `z-index` in the project.

| z-index | Element | File |
| --- | --- | --- |
| 300 | `.skip-link` | base |
| 150 | `.scroll-progress` | base |
| 140 | `.noise-overlay` | base |
| 130 | `.photo-viewer` | components |
| 120 | `.modal` | components |
| 90 | `#navbar` | components |
| 85 | `#mobile-menu` | components |
| 80 | `#back-to-top` | components |

Five more `z-index` values are local to one component — they keep a button
above its own card rather than ordering the page:

| z-index | Element | File |
| --- | --- | --- |
| 2 | `.modal-close`, `.photo-prev` / `.photo-next`, `.banner-caption` | components, sections |
| 1 | `.step-number` (so the circle sits above the dashed rail), the image inside `.modal-media` | components, sections |

Rule of thumb: **scrims above chrome, chrome above content.** The grain and
the progress bar sit above the nav so they never get covered.

---

## 8. Layout primitives

| Primitive | Where | Notes |
| --- | --- | --- |
| `.container` | base | `min(73.75rem, 92%)`, centred. The outer width of every section. |
| `.section` | base | Vertical rhythm: `clamp(3.5rem,7vw,6rem)`. |
| `.banner` | sections | Deliberately *not* inside `.container` — it is its own card with a radius and a shadow, so it reads as a physical card rather than a page band. |
| `.product-grid` | sections | 3 → 2 → 1 columns. |
| `.steps` / `.feature-list` | sections | 4 → 2 → 1 columns. |
| `.story-grid` | sections | `1.1fr .9fr` → 1 column. |
| `.visit-grid` | sections | 1fr 1fr → 1 column. |
| `.footer-grid` | sections | `1.4fr 1fr 1fr` → 2 → 1 columns. |
| `.stats` | sections | 2×2 → 1 column. |

---

## 9. The rules that keep it coherent

These are not suggestions; breaking them is how the design drifts.

1. **One gold, one ink.** Any gold surface uses `#172033` for its text.
   Enforced in `.btn.btn-primary`, `#menu-button`, `#back-to-top`,
   `.step:hover .step-number`, `.modal-close:hover`, `.photo-close:hover`.
2. **The banner is the only dark block.** Navy appears as a *field* only on
   `.banner-text`. Elsewhere navy is text (`--color-heading`) or a translucent
   scrim over media.
3. **Borders do the work.** Cards are separated by `--color-border` hairlines,
   not by shadow. `--shadow` is reserved for the banner card, the popup and
   floating controls. `--shadow-small` is a resting lift, not a separator.
4. **The logo card is a label, not a photo.** The Otap & Loaf line has no
   photograph, so its card renders as a cream card with the mark centred, a
   hairline, and navy caption text.
5. **Copy is the shop's own.** Keep new copy at that register.
6. **Never use `box-shadow` as a border.** If a card needs to stand out, use
   `border:1px solid var(--color-border)`.

---

## 10. Recipes

### Change the whole palette

Edit `theme.css` only. Then check the values that are **not** tokens:

- `.banner-text { background:#123B68 }` and its `color:#F8F3E8`
- `.banner-title`, `.banner-description b`, `.banner-caption` — cream
- The scrims `rgba(11,39,70,…)` and `rgba(7,22,40,…)`

### Change a font

1. Change `--font-heading` / `--font-body` in `theme.css`.
2. Change the Google Fonts `<link>` in `index.html` `<head>`.

### Change the rhythm between sections

`.section` padding in `base.css`, and the narrower override at 560px in
`responsive.css`.

### Change the card radius

`--card-radius` in `theme.css` — it drives `.stat`, `.feature-card`,
`.visit-card` and `.product-card`.

### Add a button variant

`components.css`, next to `.btn.btn-primary`. Follow the `.btn.btn-…`
compound so the variant cannot be used without the base, and remember rule 1:
if the fill is gold, the text must be `#172033`.

### Add a section

1. Add `styles/what-it-contains.css`, following the header-comment format of
   the existing files.
2. Link it in `index.html` `<head>` **after `sections.css` and before
   `responsive.css`**.
3. Add the markup inside `<main>` in `index.html`. Wrap content in
   `.container` and give the section `class="section"` plus an `id`.
4. Add any mobile overrides to `responsive.css`, not to the new file.
5. Do not grow `base.css` — it stays tokens/reset/primitives only.

---

## 11. What the refactor removed, and why

Three things were deleted. If you are following an older copy of the code,
this is why they are not here.

| Removed | Why |
| --- | --- |
| The previous design's card grid (`.card`, `.ph`, `.filters`, …) | The product cards are `.product-card` now. The old rules matched nothing and would have taught the wrong pattern. |
| The previous design's full-bleed hero (`.hero`, `.blob`, `.float-chip`, `.scroll-cue`, `.hero-ring`, …) | Replaced by the split banner card. Its `.hero-photo` rule in particular had to go, or the banner image would have become a rounded arch. |
| An unused catalog band (`.catalog`, `.cat-card`, …) | Never linked from `index.html` and never rendered. |

Also removed from `app.js`: the tilt handler (nothing had `class="tilt"`),
the hero parallax (no `#heroVisual` element existed), and the scroll spy (no
`.nav-link` elements existed).
