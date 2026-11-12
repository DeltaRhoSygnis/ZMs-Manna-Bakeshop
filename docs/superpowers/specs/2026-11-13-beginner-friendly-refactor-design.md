# Design — Beginner-friendly refactor

**Date:** 2026-11-13
**Status:** Awaiting approval
**Approach chosen:** C — rename classes, simplify `app.js`, consolidate CSS, normalise units, write a beginner guide

> Revised twice. The builder check caught three real bugs (marked **⚠**).
> The file structure and unit strategy were then changed after feedback that
> 16 numbered stylesheets are too many and too cryptic to present.

---

## Intent and the why

This is a teaching project, and it will be **presented to IT professionals**.
It has to satisfy two audiences at once:

- A **first-year IT student** who opens it to learn HTML, CSS and JavaScript.
- An **IT professional** reviewing the code, who will ask *why 16 files?*,
  *what do the `00`/`01` prefixes mean?*, and *px or rem — which, and why?*

Right now it fails both:

1. **Class names are abbreviated to the point of being unguessable.**
   `.g-item`, `.g-cap`, `.mono`, `.no-img`, `.v-card`, `.lb-stage`, `.mm-links`,
   `.sec-head`. A student has to reverse-engineer each one before they can use it.
2. **`app.js` opens with techniques a first-year student cannot read.** An
   IIFE, `$`/`$$` arrow helpers, `IntersectionObserver`, event delegation via
   `closest()`, template literals, focus traps, rAF loops.
3. **Dead code teaches the wrong pattern.** `07-products.css` and
   `15-catalog.css` are the previous design's card grid and an unused catalog
   band. A student studying "how are product cards built here?" reads a file
   that nothing renders.
4. **16 numbered stylesheets.** The `00`/`01` prefixes exist only to force
   load order — but load order is already visible where it belongs, in the
   `<link>` tags in `index.html`. The numbers are a redundant copy of
   information, and `05-marquee.css` holding the image-fallback rules is
   actively misleading.
5. **Units are mixed without a rule.** `px`, `rem`, `em`, `%`, `vw`, `vh`,
   `svh`, `ch`, `fr`, `deg`, `s`, `ms` all appear, with no stated policy.

**Non-goal:** changing anything a visitor can see. The rendered site must be
identical before and after — not "identical by eye", but *provably* identical
(see Verification).

**Anti-goal:** making the JavaScript *worse* to be beginner-friendly. We do
not replace `IntersectionObserver` with a scroll loop, and we do not drop
focus management. We keep the right techniques and explain them.

---

## Approach

Chosen: **C**.

- Rejected **A (docs only)**: the student still has to decode `.g-item` every
  time they open the CSS. Documentation cannot fix a name.
- Rejected **B (rename only)**: leaves `app.js` reading like expert code, and
  leaves 16 files and mixed units in place.

---

## Part 0 — Rules that govern the whole change

### 0.1 The rename is token-wise

Every occurrence of an old name is replaced **inside every selector that
contains it** — not just the selectors listed in the map. This includes
descendant selectors (`.intro-photo img` → `.banner-image img`), compound
selectors (`.intro-panel .btn.ghost.light` → `.banner .btn.btn-secondary`),
and pseudo-element forms (`.eyebrow::before` → `.section-label::before`).

The map lists the *names*, not the *rules*. Any selector containing a renamed
name is rewritten in full.

### 0.2 Specificity must not change

| Before | After | Specificity | Handling |
| --- | --- | --- | --- |
| `.intro-photo.hero-photo` | `.banner-image` | (0,2,0) → (0,1,0) | The legacy `.hero-photo` rule in `05-marquee.css` **must be deleted** (⚠ see §1.6). Otherwise it wins on source order and the banner image becomes a rounded arch with a drop shadow. |
| `.intro-panel .btn.ghost.light` | `.banner .btn.btn-secondary` | (0,3,0) → (0,3,0) | Equal. The banner rule lives in `sections.css`, loaded after `components.css`, so source order keeps the banner winning. |

Every other rename keeps the number of class selectors in the compound
identical, so specificity is unchanged everywhere else.

### 0.3 The naming philosophy — plain words, no design jargon

The single biggest reason a first-year student cannot read this codebase is
that the class names are **designer jargon**. They know HTML and CSS; they do
not know that "hero" means "the big block at the top", that "marquee" means
"scrolling text", that "tile" means "card", or that a "ghost button" is an
outlined one.

So: **every class name is a word a student would use out loud to describe the
thing to a classmate.**

| Jargon you will meet in a design tool | What we call it here |
| --- | --- |
| hero, intro | **banner** — the big block at the top of the page |
| marquee, ticker | **ticker** — a strip of text that scrolls sideways (like a news ticker) |
| tile | **card** |
| solid button / ghost button | **primary button** / **secondary button** |
| chip, pill, badge | **tag** — a small label |
| monogram | **fallback text** — the letters shown when a photo is missing |
| lightbox | **photo viewer** — the overlay that shows a big photo |
| eyebrow, kicker | **section label** — the small line above a heading |
| grain | **noise overlay** |

Two conventions on top of that, both standard in what IT courses teach:

- **Kebab-case.** Lowercase words joined by hyphens: `.product-card`,
  `.section-header`. (BEM — `block__element--modifier` — is a stricter
  version of this you may meet later; it is not needed here.)
- **A class name says what the element IS, not what it looks like.**
  `.product-card`, never `.shadow-box`.

### 0.4 The button system

Three classes, always used together:

```html
<a class="btn btn-primary">Explore the products</a>
<a class="btn btn-secondary">Plan your visit</a>
```

- `.btn` — the base button (shape, font, padding, transition). **Never
  removed**: JavaScript selects `$$(".btn")` for the magnetic-button effect,
  and the banner overrides `.btn` padding.
- `.btn-primary` — gold fill. The main action on a screen.
- `.btn-secondary` — bordered, surface fill. The less important action.

CSS uses compound selectors `.btn.btn-primary` and `.btn.btn-secondary` so a
variant can never be used without the base.

`primary` / `secondary` are used because they describe the *role* of the
button, and they are the convention almost every IT course teaches — a
reviewer recognises them instantly, whereas `solid` and `ghost` only make
sense if you have seen the design tool that invented them.

The old `.light` modifier is **removed entirely**. It appeared on exactly two
elements, both inside the banner, and both now get their light look from
`.banner` scoping. That removes a modifier class from the vocabulary.

### 0.5 The state-class vocabulary

Every class JavaScript toggles for a *state* uses the same `is-` prefix, so
there is one rule to learn instead of seven arbitrary names.

| Old | New | Set by |
| --- | --- | --- |
| `.in` | `.is-visible` | scroll reveal |
| `.open` | `.is-open` | menu, product popup, photo viewer |
| `.active` | `.is-active` | menu button (the X) |
| `.hide` | `.is-hidden` | nav bar |
| `.show` | `.is-shown` | back-to-top button |
| `.is-logo` | `.is-logo` | logo-only product |
| `.contain` | `.is-contained` | product image shown whole, not cropped |
| `body.lock` | `body.scroll-locked` | any overlay open |
| `.no-img` | `.image-missing` | broken image fallback |
| `.mono` | `.fallback-text` | the letters shown when a photo is missing |
| `.scrolled` | *deleted* | no CSS rule uses it — the JS line goes too |

### 0.6 The unit policy

One rule, stated in one sentence, applied everywhere:

> **`rem` for anything that measures a size. `px` only for borders and
> hairlines. `%` for anything relative to its parent. Everything else keeps
> its own unit — and every file says what that unit means.**

| Kind of value | Unit | Example |
| --- | --- | --- |
| Font size | `rem` | `1.5rem` |
| Spacing — padding, margin, `gap` | `rem` | `2rem` |
| Widths, heights, `max-width`, `min-height` | `rem` | `73.75rem` (was 1180px) |
| Border radius | `rem` | `1.375rem` (was 22px) |
| Shadows — offset and blur | `rem` | `0 1.125rem 2.75rem -1.125rem` |
| Border width, `outline` width | `px` | `border:1px solid` |
| Hairline separators | `px` | `border-top:1px` |
| Line height | unitless number | `1.65` |
| Anything relative to its parent | `%` | `width:92%` |
| Relative to the viewport | `vw` `vh` `svh` | keep, and comment it |
| Relative to text width | `ch` | keep, and comment it |
| Grid column widths | `fr` | keep, and comment it |
| Angles | `deg` | keep |
| Durations | `s` `ms` | keep |
| Letter spacing | `em` | keep — it is relative to the font size |

`1rem` is `16px` at the browser default, so the conversion is numerically
identical for default users and makes the whole design scale with the user's
font size. That is the presentation talking point: *"the layout scales because
I used rem, not because I wrote three breakpoints for every device."*

A `px` → `rem` conversion table is generated from the current values during
the refactor; no value is rounded or rounded away.

### 0.7 The five stylesheets

```
styles/
  theme.css        the design system: every custom property
  base.css         reset, typography, layout primitives, page overlays
  components.css   reusable parts: buttons, chips, header, menu, modal, viewer, footer
  sections.css     this particular page: banner, ticker, story, products, craft, freshness, visit
  responsive.css   every breakpoint, plus reduced-motion
```

Each file has one sentence that explains it:

- **theme.css** — *what things look like* (colours, fonts, spacing, shadows).
- **base.css** — *what things are* (reset, typography, containers, the reveal system).
- **components.css** — *the parts we reuse* (a button, a card, a dialog).
- **sections.css** — *this particular page*.
- **responsive.css** — *how it changes on different screens*.

Load order in `index.html` is `theme → base → components → sections →
responsive`, which is also the cascade order: the most general rules first,
the most specific last. This is the same relative order the 16 files had, so
nothing about the cascade changes.

### 0.8 The ID convention

All IDs become **kebab-case**, matching the class convention, because a
mixed set (`#navbar` but `#mobileMenu` but `#toTop`) reads as an accident:

| Old | New |
| --- | --- |
| `#burger` | `#menu-button` |
| `#toTop` | `#back-to-top` |
| `#mobileMenu` | `#mobile-menu` |
| `#productModal` | `#product-modal` |
| `#productGrid` | `#product-grid` |
| `#lightbox` | `#photo-viewer` |
| `#progressBar` | *removed* — the element becomes `.scroll-progress-bar` and is found by class |

`#navbar`, `#main`, `#home`, `#story`, `#products`, `#craft`, `#freshness`,
`#visit`, `#year` all stay.

---

## Part 1 — The rename map

### 1.1 Design tokens (`00-tokens.css` → `theme.css`)

| Old | New | Why |
| --- | --- | --- |
| `--bg` | `--color-background` | Self-documenting |
| `--surface` | `--color-surface` | |
| `--surface2` | `--color-surface-alt` | "alt" for the alternating band |
| `--surface-blue` | *deleted* | Unused |
| `--ink` | `--color-ink` | |
| `--heading` | `--color-heading` | |
| `--muted` | `--color-muted` | |
| `--line` | `--color-border` | "border" says what it is used for |
| `--gold` | `--color-gold` | |
| `--gold-dark` | `--color-gold-dark` | |
| `--gold-soft` | `--color-gold-soft` | |
| `--accent-text` | `--color-accent` | |
| `--accent-soft` | `--color-accent-soft` | |
| `--shadow` / `--shadow-sm` | `--shadow` / `--shadow-small` | "sm" → "small" |
| `--r` | `--card-radius` | |
| `--nav-h` | `--header-height` | |
| `--serif` / `--sans` | `--font-heading` / `--font-body` | "heading" / "body" beat "serif" / "sans" for a beginner |

### 1.2 Base (`01-base.css` → `base.css`)

| Old | New |
| --- | --- |
| `.eyebrow` (+ `.light`) | `.section-label` |
| `.sec-head` | `.section-header` |
| `.sec-sub` | `.section-subtitle` |
| `.sr-only` | `.screen-reader-only` |
| `.skip` | `.skip-link` |
| `.grain` | `.noise-overlay` |
| `.progress` / `.progress span` | `.scroll-progress` / `.scroll-progress span` |
| `.js [data-reveal].in` | `.js [data-reveal].is-visible` |
| `body.lock` | `body.scroll-locked` |

`.section-label`, `.section-header` and `.section-subtitle` move to
`components.css` — they are used by every section, so they are components,
not base. Everything else in this table stays in `base.css`.

### 1.3 Components (`02-components.css` → `components.css`)

| Old | New |
| --- | --- |
| `.btn .arr` | `.btn-arrow` |
| `.btn.solid` | `.btn.btn-primary` |
| `.btn.ghost` | `.btn.btn-secondary` |
| `.btn.ghost.light` | *(merged into `.banner .btn-secondary`)* |
| `.chip` | `.tag` |
| `.lightbox` | `.photo-viewer` |
| `.mono` | `.fallback-text` |

**Also moved here:** `.mono` → `.fallback-text` and `.no-img` → `.image-missing`.
They currently live in `05-marquee.css` but are used by the banner, the
product cards *and* the modal. They are shared components, so they belong
here.

### 1.4 Header (`03-header.css` → `components.css`)

| Old | New |
| --- | --- |
| `.burger-lines` / `.burger-lines span` | `.menu-icon` / `.menu-icon-line` |
| `.menu-word` | `.menu-button-text` |
| `.mm-links` | `.menu-links` |
| `.mm-bottom` | `.menu-footer` |
| `.mm-foot` | `.menu-footer-text` |

### 1.5 Banner (`04-hero.css` → `sections.css`)

The section is called `.intro` in HTML but `.hero` in the old CSS, and
`05-marquee.css` still carries the old design's `.hero*` rules. We delete the
old ones and use `.banner` for the real thing — a word a student would use
out loud to describe it.

| Old | New |
| --- | --- |
| `.intro` | `.banner` |
| `.intro-photo.hero-photo` | `.banner-image` (single class) |
| `.intro-panel` | `.banner-text` |
| `.intro-logo` | `.banner-logo` |
| `.intro-copy` | `.banner-copy` |
| `.intro-title` | `.banner-title` |
| `.intro-tag` | `.banner-tagline` |
| `.intro-desc` | `.banner-description` |
| `.intro-cta` | `.banner-buttons` |
| `.intro-meta` | `.banner-details` |
| `.intro-caption` | `.banner-caption` |

### 1.6 Ticker (`05-marquee.css` → `sections.css`)

| Old | New |
| --- | --- |
| `.marquee` | `.ticker` |
| `.marquee-track` | `.ticker-track` |
| `.m-item` | `.ticker-item` |
| `.m-star` | `.ticker-star` |
| `@keyframes marquee` | `@keyframes ticker-scroll` |

The whole orphaned legacy block is **deleted**: `.hero`, `.hero-bg`, `.blob`,
`.hero-inner`, `.hero-title`, `.hero-tag`, `.hero-desc`, `.hero-cta`,
`.hero-meta`, `.meta-chip`, `.hero-visual`, `.layer`, `.hero-frame`,
`.hero-ring`, `.float-chip`, `.scroll-cue`, and `@keyframes floaty|spin|cue`.

**⚠ `.hero-photo` must be in that delete list.** The legacy rule at
`05-marquee.css:24-27` is currently neutralised only by the higher specificity
of `.intro-photo.hero-photo`. Once the compound collapses to `.banner-image`,
the legacy rule wins (it loads later) and the banner image becomes a rounded
arch with a drop shadow instead of a square-cornered grid cell. So
`.hero-photo`, `.hero-photo img` and `.hero-photo .mono` are deleted from
`05-marquee.css` along with the rest of the legacy block, and the banner
keeps the properties the compound rule already had.

### 1.7 Story (`06-story.css` → `sections.css`)

| Old | New |
| --- | --- |
| `.stat .num` | `.stat-number` |
| `.stat .lbl` | `.stat-label` |

### 1.8 Products — file deleted, but one live rule moves out

**⚠ `07-products.css` is not entirely orphaned.** Line 4 of that file is:

```css
#products{background:var(--surface2);border-block:1px solid var(--line)}
```

This is the **only** rule that gives the products section its alternating
cream band and hairline borders. It moves to `sections.css` (the products
part) before the file is deleted. Without this the products band loses its
fill and its hairlines.

Everything else in `07-products.css` — `.filters`, `.filter`, `.grid-products`,
`.card`, `.ph`, `.card-body`, `.card-foot`, `.tag`, `.more`, `@keyframes
cardIn` — is genuinely orphaned and is deleted.

### 1.9 Modal (`08-modal.css` → `components.css`)

| Old | New |
| --- | --- |
| `.modal-desc` | `.modal-description` |
| `.modal-media img.contain` | `.modal-media img.is-contained` |

`.modal`, `.modal-box`, `.modal-close`, `.modal-media`, `.modal-info`,
`.spec`, `.modal-note` stay.

### 1.10 Craft / Freshness / Visit / Products-tiles / Footer

| Old | New | New home |
| --- | --- | --- |
| `.step-num` | `.step-number` | sections.css |
| `.tiles` | `.feature-list` | sections.css |
| `.tile` | `.feature-card` | sections.css |
| `.tile-icon` | `.feature-icon` | sections.css |
| `.v-cards` | `.visit-cards` | sections.css |
| `.v-card` | `.visit-card` | sections.css |
| `.v-label` | `.visit-label` | sections.css |
| `.v-value` | `.visit-value` | sections.css |
| `.v-sub` | `.visit-detail` | sections.css |
| `.map-wrap` | `.map-wrapper` | sections.css |
| `.grid-gallery` (+ `.is-product`) | `.product-grid` | sections.css |
| `.g-item` | `.product-card` | sections.css |
| `.g-cap` | `.product-caption` | sections.css |
| `.lb-stage` | `.photo-frame` | components.css |
| `.lb-img` | `.photo-image` | components.css |
| `.lb-bar` | `.photo-bar` | components.css |
| `.lb-cap` | `.photo-caption` | components.css |
| `.lb-count` | `.photo-counter` | components.css |
| `.lb-close` | `.photo-close` | components.css |
| `.lb-prev` / `.lb-next` | `.photo-prev` / `.photo-next` | components.css |
| `.f-grid` | `.footer-grid` | components.css |
| `.f-brand` | `.footer-brand` | components.css |
| `.f-col` | `.footer-column` | components.css |
| `.f-bottom` | `.footer-bottom` | components.css |
| `.f-mark` | `.footer-star` | components.css |

Two collisions are avoided here:

- The freshness tiles were `.tile`, and the product caption was going to be
  `.tile-caption`. Both would start with "tile" and mean different things, so
  the freshness ones become `.feature-card` / `.feature-icon` and the product
  one becomes `.product-caption`.
- The `.is-product` modifier disappears entirely: there is only one grid, so
  `.product-grid` alone carries the rules.

### 1.11 File consolidation — where every rule ends up

| New file | Takes its rules from | Owns |
| --- | --- | --- |
| `styles/theme.css` | `00-tokens.css` | Every custom property |
| `styles/base.css` | `01-base.css` | Reset, element defaults, `.container`, `.section`, `.screen-reader-only`, `.skip-link`, `.noise-overlay`, `.scroll-progress`, reveal system |
| `styles/components.css` | `02-components.css`, `03-header.css`, `08-modal.css`, `12-gallery.css` (viewer half), `13-footer.css` | `.section-label`, `.section-header`, `.section-subtitle`, buttons, `.tag`, fallback text, header, menu, modal, photo viewer, footer, back-to-top |
| `styles/sections.css` | `04-hero.css`, `05-marquee.css`, `06-story.css`, `09-craft.css`, `10-freshness.css`, `11-visit.css`, `12-gallery.css` (cards half), plus the `#products` band rule rescued from `07-products.css` | The seven page sections |
| `styles/responsive.css` | `14-responsive.css` | Every breakpoint + reduced motion |

**Deleted outright:** `07-products.css` (after rescuing one rule),
`15-catalog.css` (unused and unlinked), and the legacy block inside
`05-marquee.css`.

### 1.12 Custom properties written by JS

| Old | New | Why |
| --- | --- | --- |
| `--g1` / `--g2` | `--gradient-from` / `--gradient-to` | "g1" means nothing; this says what it is |

`--mx` / `--my` disappear with the dead parallax code. The `var(--g1, …)` /
`var(--g2, …)` fallbacks inside `08-modal.css` and `12-gallery.css` are
rewritten to the new names in the same pass.

### 1.13 JavaScript data keys

| Old | New |
| --- | --- |
| `g1` / `g2` | `gradientFrom` / `gradientTo` |
| `fit: "contain"` | `fit: "contained"` |

`fit: "contained"` is what makes the CSS class `.is-contained` and the
`is-logo` treatment apply, so the data value and the class name now agree.

### 1.14 The responsive file is in scope

`responsive.css` contains live names that must change — `#burger` →
`#menu-button`, `.grid-gallery` → `.product-grid`, `.v-cards` →
`.visit-cards`, `.f-grid` → `.footer-grid`, `.lb-prev`/`.lb-next` →
`.photo-prev`/`.photo-next` — plus dead selectors pointing at classes this
refactor deletes (`.grid-products`, `.hero-inner`, `.hero-visual`,
`.scroll-cue`, `.float-chip.fc1`/`.fc2`, `.nav-links`). The dead ones are
removed rather than renamed.

---

## Part 2 — The `app.js` rewrite

Same behaviour, different shape. Written for someone who has just met the DOM.

### 2.1 Structure

No IIFE. Plain top-level `function` declarations, grouped in numbered
sections with a comment banner each.

```js
/* 1. Small helpers */
function findElement(selector, parent) { ... }
function findElements(selector, parent) { ... }

/* 2. Site data — edit this part */
const SITE_CONFIG = { ... };
const PRODUCTS = [ ... ];
const PHOTOS = [ ... ];

/* 3. Draw the product tiles */
function buildProductTiles() { ... }
function handleBrokenImage(img) { ... }

/* 4. Apply the settings in SITE_CONFIG */
function applySiteSettings() { ... }        /* banner image, facebook link, year */

/* 5. Reveal things as you scroll */
function setupScrollReveal() { ... }

/* 6. Count up the statistics */
function setupAnimatedCounters() { ... }

/* 7. Header, progress bar, back-to-top */
function setupScrollChrome() { ... }

/* 8. The full-screen menu */
function setupMobileMenu() { ... }

/* 9. The product popup */
function openProductPopup(productId) { ... }
function closeProductPopup() { ... }

/* 10. The photo viewer */
function openPhotoViewer(index) { ... }
function closePhotoViewer() { ... }
function showNextPhoto(direction) { ... }

/* 11. Keyboard controls */
function setupKeyboardControls() { ... }

/* 12. Small mouse effects */
function setupMouseEffects() { ... }          /* magnetic buttons */

/* 13. Run everything */
buildProductTiles();
applySiteSettings();
setupScrollReveal();
setupAnimatedCounters();
setupScrollChrome();
setupMobileMenu();
setupKeyboardControls();
setupMouseEffects();
```

### 2.2 The run order is fixed, and one step is load-bearing

**`buildProductTiles()` must run before `setupScrollReveal()`.** The tiles are
created with `data-reveal`, and `.js [data-reveal]` hides them until
`.is-visible` is added. If the observer is set up first, the tiles are not in
the DOM yet, they never get observed, and the product grid stays invisible
forever.

`app.js` is loaded with `defer`, so the HTML is already parsed when it runs —
no `DOMContentLoaded` wrapper needed. The comment at the top of the file says
so.

### 2.3 Naming

| Old | New |
| --- | --- |
| `$` / `$$` | `findElement` / `findElements` |
| `reduced` | `userPrefersLessMotion` |
| `finePointer` | `userHasMouse` |
| `CONFIG` | `SITE_CONFIG` |
| `GALLERY` | `PHOTOS` |
| `bindFallback` | `handleBrokenImage` |
| `ro` / `co` | `revealObserver` / `counterObserver` |
| `nav` / `bar` / `toTop` | `navBar` / `progressBar` / `backToTop` |
| `burger` / `menu` | `menuButton` / `mobileMenu` |
| `modal` | `productModal` |
| `lb` / `lbIndex` / `lbFocus` | `photoViewer` / `currentPhotoIndex` / `photoViewerPreviouslyFocused` |
| `updateLb` | `showCurrentPhoto` |
| `openLightbox` / `closeLb` / `stepLb` | `openPhotoViewer` / `closePhotoViewer` / `showNextPhoto` |
| `trapTab` | `keepFocusInside` |
| `lastFocus` | `productPopupPreviouslyFocused` |

**⚠ The two focus variables must stay separate.** `lastFocus` (the product
popup) and `lbFocus` (the photo viewer) were both going to be renamed to
`previouslyFocused`. With the IIFE gone they share one top-level scope, so a
single name is a `SyntaxError` and would kill the whole script. They are now
`productPopupPreviouslyFocused` and `photoViewerPreviouslyFocused`.

They must stay separate because they restore focus to different things: the
popup returns focus to the product tile, the photo viewer returns focus to the
"View full image" button inside the popup.

### 2.4 Techniques kept, with plain-language comments

| Technique | Kept? | Comment explains |
| --- | --- | --- |
| `IntersectionObserver` | yes | "Watches when an element scrolls into view" |
| Focus trap | yes | "Keeps Tab inside the open popup" |
| Event delegation | **removed** | We attach a click listener to each tile as we create it — far easier to follow than `closest()` |
| rAF scroll throttle | yes | "Only runs once per frame, so scrolling stays smooth" |
| `classList` | yes | "add/remove a class so CSS can react" |
| Template literals | yes | "Builds the HTML for one tile" |
| Custom properties | yes | "Lets the CSS pick up a colour from the data" |
| `matchMedia` | yes | "Asks the browser if the user wants less motion" |
| Magnetic buttons | **yes** | It is live — `.btn` elements exist — and it is a visible desktop behaviour. It gets its own section, `setupMouseEffects()`. |
| IIFE | **removed** | — |

### 2.5 Dead code removed

| Code | Why |
| --- | --- |
| `.tilt` handler | No element uses `class="tilt"` |
| `#heroVisual` parallax | No `#heroVisual` element exists |
| Scroll spy | No `.nav-link` elements exist |
| `.scrolled` class | No CSS rule reads it |

Each removal is noted in the beginner guide so a student knows they were not
mistakes — they are hooks for features the site does not have.

---

## Part 3 — Documentation

| File | New? | Purpose |
| --- | --- | --- |
| `docs/README.md` | update | Navigation hub, task lookup |
| `docs/BEGINNER-GUIDE.md` | **new** | The teaching document. Plain words, **CSS units and properties glossary**, **JavaScript glossary**, the naming rules, how to find the CSS for an element, an old→new name map, a walkthrough of one feature end to end, and **talking points for presenting this to reviewers**. |
| `docs/CSS-GUIDE.md` | rewrite | Same structure, new names, new file layout, per-rule plain comments |
| `docs/JS-GUIDE.md` | rewrite | Same structure, new names, plain-language explanations |
| `docs/JS-CSS-BRIDGE.md` | rewrite | The state-class contract, updated names |
| `README.md` | update | Point at the new docs, new file layout |
| `DESIGN.md` | update | Point at the new docs, fix the stale section-rhythm value |
| `CLAUDE.md` | new | Short project instructions for future agents |

### 3.1 Naming conventions to document

1. **Plain words, no design jargon.** `banner`, `card`, `tag`, `photo viewer`,
   `section label`, `primary button`. Never `hero`, `marquee`, `tile`,
   `chip`, `ghost`, `monogram` — a student reading the class list should
   never have to look something up.
2. **Kebab-case.** Lowercase words joined by hyphens: `.product-card`,
   `.section-header`.
3. **A class name says what the element IS**, not what it looks like:
   `.product-card`, never `.shadow-box`.
4. **State classes start with `is-`.** `.is-open`, `.is-visible`,
   `.is-active`. One rule to learn.
5. **IDs are used only for elements JavaScript needs to find**, and are
   always kebab-case. Everything else is found by class.
6. **Files are named for what they contain**, never numbered. Load order is
   shown in `index.html`, where it belongs.

### 3.2 The units and properties glossary

`docs/BEGINNER-GUIDE.md` gets two tables a student can read in five minutes:

**CSS units** — `px`, `rem`, `em`, `%`, `vw`, `vh`, `svh`, `ch`, `fr`, `deg`,
`ms`/`s`. What each one is relative to, when to use it, and what this project
uses it for.

**CSS properties this project uses** — `clamp()`, `min()`, `max()`,
`color-mix()`, `backdrop-filter`, `aspect-ratio`, `inset`, `gap`,
`translate`/`rotate` as standalone properties, `grid-template-columns`,
`:focus-visible`, `prefers-reduced-motion`.

**JavaScript vocabulary** — `querySelector`, `classList`, `dataset`,
`addEventListener`, `matchMedia`, `IntersectionObserver`,
`requestAnimationFrame`, `setProperty`, `textContent`, `innerHTML`,
`focus()`, `preventDefault`, and the `aria-*` attributes in use.

### 3.3 Comments added to the code

- `index.html`: a comment block per section, saying what it is and which
  stylesheet owns it.
- Every CSS file: a `CONTENTS` index at the top listing the selectors, and a
  short plain comment above each rule group.
- `app.js`: a numbered banner per section, and a comment above each function
  saying what it does, what it touches, and what it changes on screen.

### 3.4 `reference/hero.html`

Updated to the new class names, because `README.md` and `DESIGN.md` both
describe it as a reusable fragment and a student will copy from it. Its extra
`.scroll-cue` element — which the live page does not have — is removed,
because that class is being deleted from the CSS.

---

## Constraints

- The rendered output must be **identical**. Only names, comments, file
  organisation, units, and JavaScript structure change.
- `px` → `rem` is numerically identical at the browser's default font size.
- No new dependencies, no build step.
- The site must still work with JavaScript disabled for everything except the
  product grid (which already needs JS and already says so).
- `prefers-reduced-motion` behaviour must be unchanged.
- `archive/legacy-2026-11-12/` is **frozen** — it is the previous design, it
  is not referenced by anything, and it keeps the old class names and the old
  units on purpose.

---

## Verification plan

There is no test runner and no headless browser available, so verification is
**structural**, not visual. It is stronger than an eyeball diff.

### V1 — The rename map is complete

Grep the whole repo (excluding `archive/`) for every old name. Expected:
**zero hits**.

### V2 — The CSS is provably equivalent

A throwaway script (in `/tmp`, not in the repo) parses every stylesheet into
`(selector, declarations)` pairs and:

1. Takes the **before** set and applies the rename map and the `px` → `rem`
   conversion to each declaration.
2. Takes the **after** set from the refactored files.
3. Diffs the two sets.

Expected: **the sets are identical**. Any difference is a rule that was
gained, lost, or changed — exactly the class of bug that breaks a site
silently. File order is compared too, so the cascade order is preserved.

### V3 — The markup is provably equivalent

Same idea for `index.html`: parse the element tree, normalise `class` and
`id` attributes through the rename map, and diff before against after.
Expected: **identical**.

### V4 — Every JS selector resolves

Extract every selector string used in `app.js` (`querySelector`,
`querySelectorAll`, `closest`) and check that it matches at least one element
in `index.html` **or** in the markup `app.js` itself generates. Expected:
**every selector resolves**.

### V5 — The unit policy is followed

Grep the refactored CSS for `px`. Expected hits: **only** border widths and
hairlines. Every other `px` value is now `rem`.

### V6 — Behaviour, by hand

Serve the folder (`python3 -m http.server 8899`) and confirm:

1. Banner, ticker, story, product grid, craft, freshness, visit and footer all
   render; the products band keeps its cream fill and hairlines.
2. Click a tile → the popup opens with the right product, the five spec
   rows, and the "View full image" button → the photo viewer opens and
   steps → Escape closes each → focus returns to the tile.
3. The Otap card renders as a cream label card with the fallback letters, not a
   gradient.
4. The menu opens, focus moves into it, Escape returns focus to the menu
   button, and the bars fold into an X.
5. Scrolling fills the progress bar, hides the nav on the way down, shows
   the back-to-top button past 600px, counts the statistics up, and reveals
   the sections.
6. Resize to 360 / 768 / 1024 / 1440 and compare against the current build.
7. Toggle `prefers-reduced-motion` in DevTools → reveals visible, ticker
   stopped, counters jump to their final value.
8. No console errors, no broken images.

---

## What's left to the builder

- Nothing. This document specifies the whole change.
