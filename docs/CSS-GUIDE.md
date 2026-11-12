# CSS Guide — Zm's Manna Bakeshop

Complete reference for `styles/`. Covers the layering model, every token,
every selector, every breakpoint, the motion inventory, and an audit of which
rules are live.

Related: [`JS-CSS-BRIDGE.md`](./JS-CSS-BRIDGE.md) ·
[`JS-GUIDE.md`](./JS-GUIDE.md) · [`../DESIGN.md`](../DESIGN.md)

---

## 1. How the CSS is organised

### 1.1 Load order

`index.html` `<head>` links the stylesheets in this order. The order is
**meaningful** — later files win at equal specificity, so this is the cascade
made explicit.

| # | File | Lines | Owns |
| --- | --- | --- | --- |
| 00 | `00-tokens.css` | 15 | `:root` variables only |
| 01 | `01-base.css` | 37 | Reset, typography, layout primitives, reveal system |
| 02 | `02-components.css` | 14 | `.btn`, `.chip` |
| 03 | `03-header.css` | 67 | Nav pill, burger, full-screen menu |
| 04 | `04-hero.css` | 139 | The split intro card |
| 05 | `05-marquee.css` | 54 | Marquee strip (+ legacy hero rules, see audit) |
| 06 | `06-story.css` | 13 | Story copy + stat cards |
| 07 | `07-products.css` | 32 | Legacy product cards (all orphaned — see audit) |
| 08 | `08-modal.css` | 30 | Product detail dialog |
| 09 | `09-craft.css` | 14 | Four-step bake timeline |
| 10 | `10-freshness.css` | 13 | Freshness tiles |
| 11 | `11-visit.css` | 14 | Visit cards + map |
| 12 | `12-gallery.css` | 45 | `.g-item` tiles + lightbox |
| 13 | `13-footer.css` | 18 | Footer + back-to-top |
| 14 | `14-responsive.css` | 33 | Breakpoints + reduced motion |
| 15 | `15-catalog.css` | 71 | Unused (see audit) |

`15-catalog.css` is **not linked** from `index.html`. The file exists only.

### 1.2 The five layers

```
Layer 0  tokens        00        :root { --var: value }
Layer 1  base          01        reset, element defaults, primitives
Layer 2  components    02        reusable pieces (.btn, .chip)
Layer 3  sections      03–13     one file per page section
Layer 4  overrides     14        breakpoints + reduced motion
```

Rules of the layering model:

- **Tokens never appear in later files as literals.** Always `var(--gold)`.
- **Base holds primitives, not sections.** `.container`, `.section`, `.eyebrow`,
  `.sec-head`, `.sr-only`, `.skip`, `.grain`, `.progress`, and the reveal system
  are the only things allowed in `01-base.css`.
- **A section file may only style its own section** plus shared components
  scoped to that section (e.g. `.intro-panel .btn` in `04-hero.css`).
- **`14-responsive.css` owns all breakpoint overrides**, so a breakpoint rule
  is never scattered through the section files. Exception: `04-hero.css` and
  `15-catalog.css` carry their own local `@media` blocks because their layout
  changes are specific to that one component.

---

## 2. Design tokens

All in `00-tokens.css`, under `:root`. This is the single place to change the
palette or the type system.

### 2.1 Colour

| Token | Value | Where it is used | Notes |
| --- | --- | --- | --- |
| `--bg` | `#F8F3E8` | `body` background, `.brand` blur base, `#mobileMenu` | Warm cream page. Carries a 22px radial dot grid. |
| `--surface` | `#FFFDF8` | Cards, footer, `.btn.ghost`, `.stat`, `.tile`, `.v-card`, `.g-item.is-logo` | Card fill. |
| `--surface2` | `#F2EDE3` | `#products`, `#freshness`, `#gallery` bands | Alternating band behind sections. |
| `--surface-blue` | `#EAF1F8` | **nothing** | Orphaned token — safe to delete. |
| `--ink` | `#172033` | `body` colour, `--gold` surfaces | Body copy. Also the mandatory text colour on gold. |
| `--heading` | `#123B68` | `h1,h2,h3`, `.v-value`, `.brand-name` | Navy display type. |
| `--muted` | `#4D5667` | Secondary copy: `.sec-sub`, `.card-body p`, `.f-col a`, `.story-copy p` | 6.7:1 on cream. |
| `--line` | `#DED5C6` | Every hairline border | The separation system — see *Rules*. |
| `--gold` | `#D2A62A` | `.btn.solid`, `#burger`, `.eyebrow::before`, `#toTop`, `.m-star`, focus accents | **Never carries white text.** Always `--ink`. |
| `--gold-dark` | `#C39722` | `.btn.solid` gradient end, `#burger` border | Gradient/edge partner of `--gold`. |
| `--gold-soft` | `#F2DF9E` | Accents **on navy**: `.intro-panel .eyebrow.light`, `.intro-tag`, `.intro-meta span` | Light gold for dark backgrounds. |
| `--accent-text` | `#945F2F` | `.eyebrow`, `.chip`, `.spec dt`, `.v-label`, `.more`, focus ring | Warm brown, 4.8:1 at smallest size. |
| `--accent-soft` | `rgba(210,166,42,.14)` | `.chip` background, `.tile-icon` background | Tinted fill behind accent text. |

Navy `#123B68` appears in three places: `--heading`, and hard-coded as the
hero panel background (`04-hero.css`) and overlay scrims. If you change the
navy, you must change `04-hero.css` too — it is not a token.

### 2.2 Type

| Token | Value | Role |
| --- | --- | --- |
| `--serif` | `"Fraunces", Georgia, serif` | Display: headings, `.brand-name`, `.intro-title`, `.stat .num`, `.v-value`, `.lb-cap`, `.step-num` |
| `--sans` | `"DM Sans", Arial, sans-serif` | Everything else: body, labels, buttons, meta rows |

Both are loaded from Google Fonts in `index.html` `<head>` with
`preconnect`. Fraunces is requested at `opsz` 9–144, weights 600/700, italic.

### 2.3 Space, shape, depth

| Token | Value | Where it is used |
| --- | --- | --- |
| `--r` | `22px` | Card radius: `.stat`, `.tile`, `.v-card`, `.g-item` |
| `--nav-h` | `64px` | `scroll-padding-top` in `01-base.css`, `#mobileMenu` padding, hero top margin |
| `--shadow` | `0 18px 44px -18px rgba(18,59,104,.25)` | Hero card, `.modal-box`, `#burger:hover`, `#toTop` |
| `--shadow-sm` | `0 8px 24px -12px rgba(18,59,104,.18)` | Cards, `.brand`, `.map-wrap`, lightbox stage variant |

Radii that are **not** tokens (they are one-off by design): `24px` intro card,
`26px` modal, `22px` lightbox stage, `18px` catalog card, `999px` pills.

---

## 3. Selector index

Every selector defined in `styles/`, grouped by file. `◉` = live (matches
markup), `○` = orphaned.

### 00-tokens.css

- `:root` — all 19 variables. ◉

### 01-base.css

**Reset**

- `*, *::before, *::after` — `box-sizing:border-box`, zero margins/padding ◉
- `img` — `max-width:100%; display:block` ◉
- `a` — inherits colour, no underline ◉
- `button` — inherits font/colour, no border, `cursor:pointer` ◉

**Document**

- `html` — `scroll-behavior:smooth`, `scroll-padding-top:calc(var(--nav-h) + 16px)`, `-webkit-text-size-adjust:100%` ◉
- `body` — sans font, cream + dot-grid background, ink colour, 16px/1.65, antialiased, `overflow-x:hidden`, `transition:color .4s` ◉
- `body.lock` — `overflow:hidden`. **Written by JS** when a modal, lightbox or mobile menu is open ◉
- `::selection` — gold background, ink text ◉
- `:focus-visible` — 2px `--accent-text` outline, 3px offset ◉

**Type**

- `h1, h2, h3` — serif, 600, `line-height:1.12`, tight tracking, `--heading` ◉

**Layout primitives**

- `.container` — `width:min(1180px, 92%)`, auto margins ◉
- `.section` — `padding:clamp(3.5rem,7vw,6rem) 0`, `position:relative` ◉

**Shared text parts**

- `.eyebrow` — inline-flex, uppercase, `.22em` tracking, `--accent-text`, with a 26×2px gold rule via `::before` ◉
- `.eyebrow.light` — scoped gold-soft variant, declared in `04-hero.css` ◉
- `.sec-head` — `max-width:640px` section header block ◉
- `.sec-head h2` — fluid size, vertical rhythm ◉
- `.sec-sub` — muted intro paragraph ◉
- `.sr-only` — visually hidden, still readable by screen readers ◉
- `.skip` — fixed skip link, parked off-screen at `top:-60px`, slides in on `:focus` ◉

**Chrome**

- `.grain` — fixed full-screen SVG noise overlay, `opacity:.045`, `pointer-events:none`, `z-index:140` ◉
- `.progress` — fixed 3px bar at the top of the viewport, `z-index:150` ◉
- `.progress span` — the gold→brown gradient fill, width driven by JS ◉

**Reveal system**

- `.js [data-reveal]` — `opacity:0; translateY(28px)` + transition. Gated behind `.js` so content is never hidden without JavaScript ◉
- `.js [data-reveal].in` — the revealed state. **`.in` is added by JS** ◉

### 02-components.css

- `.btn` — pill button, `inline-flex`, gold-safe transition set, `will-change:transform` ◉
- `.btn .arr` — the `→` glyph; slides right on hover ◉
- `.btn:hover .arr` — `translateX(4px)` ◉
- `.btn.solid` — gold gradient, ink text, gold shadow ◉
- `.btn.solid:hover` — deeper shadow ◉
- `.btn.ghost` — surface fill, `--line` border, navy text ◉
- `.btn.ghost:hover` — gold border, accent text ◉
- `.chip` — small uppercase pill for the modal's category label. **Injected by JS** ◉

### 03-header.css

- `#navbar` — fixed top bar, `pointer-events:none` so it never blocks the page; children re-enable it ◉
- `#navbar.hide` — `translateY(-140%)`. **Toggled by JS** on scroll-down ◉
- `#navbar > *` — `pointer-events:auto` ◉
- `.brand` — floating frosted-glass pill (`backdrop-filter:blur(14px)`) ◉
- `.brand-mark` / `.brand-mark img` — 34px square logo, `object-fit:contain` ◉
- `.brand-name` / `.brand small` — stacked name + uppercase subtitle ◉
- `#burger` — gold pill menu button ◉
- `.menu-word` — the word "Menu" beside the bars ◉
- `.burger-lines` / `.burger-lines span` — three 18×2px bars ◉
- `#burger.active .burger-lines span:nth-child(1|2|3)` — X transform. **`.active` is added by JS** ◉
- `#mobileMenu` — fixed full-screen overlay, `visibility:hidden; opacity:0` ◉
- `#mobileMenu.open` — `visibility:visible; opacity:1`. **`.open` is added by JS** ◉
- `.mm-links` / `.mm-links a` / `.mm-links a i` / `.mm-links a:hover` — the numbered nav list ◉
- `#mobileMenu.open .mm-links a` — staggered entry ◉
- `#mobileMenu.open .mm-links a:nth-child(1…7)` — 60ms-per-item stagger via `transition-delay` ◉
- `.mm-bottom` / `.mm-foot` — footer strip inside the menu ◉

### 04-hero.css

- `.intro` — the hero card: `min(1180px, 92%)` wide, `1.15fr .85fr` two-column grid, 24px radius, `--shadow` ◉
- `.intro-photo.hero-photo` — left cell; overrides the legacy `.hero-photo` rules in `05-marquee.css` ◉
- `.intro-photo img` — absolutely positioned, `object-fit:cover` ◉
- `.intro-photo .mono` — fallback monogram size ◉
- `.intro-caption` — blurred pill caption over the photo ◉
- `.intro-panel` — right cell; navy `#123B68` field, cream text ◉
- `.intro-logo img` — 52px logo ◉
- `.intro-copy` — vertical stack ◉
- `.intro-panel .eyebrow.light` / `::before` — gold-soft eyebrow on navy ◉
- `.intro-title` — the "Zm's / Manna" wordmark, `clamp(2.0rem,3.6vw,3.0rem)` ◉
- `.intro-tag` — italic gold-soft tagline ◉
- `.intro-desc` — 46ch measure, 78% cream ◉
- `.intro-desc b` — full-opacity cream for `<b>` spans ◉
- `.intro-cta` — flex row of buttons ◉
- `.intro-panel .btn` — tighter padding inside the panel ◉
- `.intro-panel .btn.ghost.light` / `:hover` — transparent ghost variant on navy ◉
- `.intro-meta` — bottom meta block, `margin-top:auto` pins it to the bottom ◉
- `.intro-meta > div` — `96px 1fr` label/value grid ◉
- `.intro-meta > div:last-child` — drops the final border ◉
- `.intro-meta span` / `.intro-meta p` — gold-soft labels, cream values ◉
- `.intro .scroll-cue` — `display:none` (hero has no scroll cue) ○
- Local `@media (max-width:1024px | 768px | 560px)` — single column, then type/padding tuning ◉

### 05-marquee.css

**Live**

- `.marquee` — full-bleed band, top/bottom hairline, surface fill ◉
- `.marquee-track` — flex strip, `width:max-content`, `animation:marquee 30s linear infinite` ◉
- `.marquee:hover .marquee-track` — pauses on hover ◉
- `.m-item` — the product name; serif, muted, `white-space:nowrap` ◉
- `.m-star` — the `✦` separator, gold ◉
- `@keyframes marquee` — `to { transform:translateX(-50%) }` (the track holds two identical spans, so -50% loops seamlessly) ◉

**Also live but oddly placed here**

- `.mono` — the fallback monogram: absolutely centred, `opacity:0`. **Used by the hero, the product tiles, and the modal**, all of which live in other files ◉
- `.no-img img` — hides a broken image. **`.no-img` is added by JS** to the image's parent ◉
- `.no-img .mono` — reveals the monogram when the image fails ◉

**Orphaned legacy block** (previous design; nothing in `index.html` matches)

- `.hero`, `.hero-bg`, `.blob`, `.blob.b1`, `.blob.b2` ○
- `.hero-inner`, `.hero-title`, `.hero-title em`, `.hero-tag`, `.hero-desc`, `.hero-cta`, `.hero-meta`, `.meta-chip` ○
- `.hero-visual`, `.layer`, `.hero-frame`, `.hero-ring` ○
- `.float-chip`, `.float-chip small`, `.float-chip.fc1`, `.float-chip.fc2` ○
- `.scroll-cue`, `.scroll-cue .mouse`, `.scroll-cue .mouse::after` ○
- `@keyframes floaty`, `spin`, `cue` — only used by the orphaned rules above ○

### 06-story.css

- `.story-grid` — `1.1fr .9fr` two-column: copy left, stats right ◉
- `.story-copy h2` — heading rhythm ◉
- `.story-copy p` — muted, `max-width:56ch` ◉
- `.story-copy p b` — navy emphasis ◉
- `.stats` — 2×2 grid of stat cards ◉
- `.stat` — surface card, `--r` radius, lifts on hover ◉
- `.stat .num` — the big serif number. **Value is written by JS** (`data-count`) ◉
- `.stat .lbl` — muted caption ◉

### 07-products.css — entirely orphaned

Kept from the previous design. The current product grid uses `.g-item` from
`12-gallery.css`.

- `.filters`, `.filter`, `.filter:hover`, `.filter.active` ○
- `.grid-products` ○
- `.card`, `.card:hover`, `.card.hide`, `.card.pop` ○
- `.ph`, `.ph img`, `.ph img.contain`, `.card:hover .ph img`, `.card:hover .ph img.contain` ○
- `.card-body`, `.card-body h3`, `.card-body p`, `.card-foot` ○
- `.tag`, `.more`, `.more .arr`, `.card:hover .more .arr` ○
- `@keyframes cardIn` ○ (only used by `.card.pop`)

### 08-modal.css

- `.modal` — fixed scrim, navy 55% + `blur(8px)`, `visibility:hidden; opacity:0` ◉
- `.modal.open` — visible. **`.open` is added by JS** ◉
- `.modal-box` — `min(960px,100%)`, 90vh max, two columns, 26px radius, `--shadow` ◉
- `.modal.open .modal-box` — `transform:none` (enters from `translateY(26px) scale(.97)`) ◉
- `.modal-close` — circular close button, rotates 90° on hover ◉
- `.modal-media` — left media cell, `min-height:460px`, background uses `--g1`/`--g2` ◉
- `.modal-media::after` — soft radial highlight over the gradient ◉
- `.modal-media img` / `.modal-media img.contain` — cover / contain variants ◉
- `.modal-media.is-logo` — flat surface instead of gradient. **`.is-logo` is added by JS** ◉
- `.modal-media .mono` — fallback monogram ◉
- `.modal-info` — right text cell ◉
- `.modal-info h3` — product name ◉
- `.modal-desc` — description. **Injected by JS** ◉
- `.spec`, `.spec div`, `.spec dt`, `.spec dd` — the five-row spec list. **Injected by JS** ◉
- `.modal-note` — the "baked in small batches" footnote. **Injected by JS** ◉

### 09-craft.css

- `.steps` — 4-column grid, `position:relative` for the rail ◉
- `.steps::before` — the dashed rail: a `repeating-linear-gradient` 2px line at `top:27px`, inset 6% each side ◉
- `.step` — one step ◉
- `.step-num` — 54px gold-ringed circle, `z-index:1` so it sits above the rail ◉
- `.step:hover .step-num` — fills gold, scales 1.08 ◉
- `.step h3`, `.step p` — copy ◉
- `#freshness` — stray duplicate of the rule in `10-freshness.css` (harmless, identical) ○

### 10-freshness.css

- `#freshness` — alternating band fill + hairlines ◉
- `.tiles` — 4-column grid ◉
- `.tile` — surface card, lifts on hover ◉
- `.tile-icon` — 48px rounded square with `--accent-soft` fill ◉
- `.tile-icon svg` — `stroke:var(--accent-text)`, `fill:none`, 1.8 stroke width, round caps ◉
- `.tile h3`, `.tile p` — copy ◉

### 11-visit.css

- `.visit-grid` — two columns: cards left, map right ◉
- `.v-cards` — 2×2 grid of visit cards ◉
- `.v-card` — surface card; `display:flex; flex-direction:column` so the three spans stack tightly ◉
- `a.v-card:hover` — lifts and goes gold (only anchors get the hover treatment) ◉
- `.v-label` — uppercase accent label ◉
- `.v-value` — serif value ◉
- `.v-sub` — muted sub-line ◉
- `.map-wrap` — rounded bordered frame, `min-height:380px` ◉
- `.map-wrap iframe` — fills the frame, `filter:saturate(.85)` to match the palette ◉
- `.visit-note` / `.visit-note b` — the closing note with a gold `✦` ◉

### 12-gallery.css

- `#gallery` — band fill (no such section in the current markup) ○
- `.grid-gallery` — 3-column grid. **Live** via `.grid-gallery.is-product` on `#productGrid` ◉
- `.g-item` — the product tile button: 4:3 aspect, `--r` radius, gradient background from `--g1`/`--g2`, lifts on hover ◉
- `.g-item:hover` — `translateY(-6px)` + `--shadow` ◉
- `.g-item img` / `.g-item:hover img` — cover, scales 1.07 on hover ◉
- `.g-cap` — caption gradient bar, hidden by default, slides up ◉
- `.g-item:hover .g-cap`, `.g-item:focus-visible .g-cap` — reveal on hover **and keyboard focus** ◉
- `.grid-gallery.is-product .g-cap` — captions always visible in the product grid ◉
- `.grid-gallery .g-item img.contain` — `object-fit:contain` with padding, for the logo-only product ◉
- `.grid-gallery .g-item.is-logo` — flat surface instead of gradient. **`.is-logo` is added by JS** ◉
- `.grid-gallery .g-item.is-logo .g-cap` — navy caption on surface with a top hairline ◉
- `.lightbox` — fixed near-black scrim, `blur(10px)`, `visibility:hidden; opacity:0` ◉
- `.lightbox.open` — visible. **`.open` is added by JS** ◉
- `.lb-stage` — the photo stage, `min(880px, 92vw)`, 4:3, scales in ◉
- `.lightbox.open .lb-stage` — `transform:none` ◉
- `.lb-img` — `object-fit:contain` with padding ◉
- `.lb-bar` — caption + counter strip ◉
- `.lb-cap` — serif italic caption. **Text written by JS** ◉
- `.lb-count` — "3 / 6". **Text written by JS** ◉
- `.lb-close` — circular close, rotates on hover ◉
- `.lb-prev`, `.lb-next` — circular arrows at the sides ◉
- `.lb-prev:hover`, `.lb-next:hover`, `.lb-close:hover` — gold fill ◉

### 13-footer.css

- `.footer` — surface band, top hairline, `padding:4rem 0 0` ◉
- `.f-grid` — `1.4fr 1fr 1fr` columns ◉
- `.f-brand p` — brand paragraph ◉
- `.f-col h3` — uppercase column heading ◉
- `.f-col a`, `.f-col span` — link/line rows ◉
- `.f-col a:hover` — accent colour ◉
- `.f-bottom` — copyright strip, hairline top ◉
- `.f-mark` — the gold `✦` ◉
- `#toTop` — fixed gold circle, hidden (`opacity:0`, `pointer-events:none`) ◉
- `#toTop.show` — visible. **`.show` is added by JS** ◉
- `#toTop:hover` — stays gold, lifts shadow ◉

### 14-responsive.css

- `@media (max-width:1024px)` — hero stacks, galleries drop to 2 columns, steps/tiles to 2, story & visit to 1, footer to 2 ◉
- `@media (max-width:768px)` — burger visible, modal stacks, modal media shorter ◉
- `@media (max-width:560px)` — everything to 1 column, tighter section padding, spec rows stack ◉
- `@media (prefers-reduced-motion:reduce)` — kills all animation and transition durations, forces revealed content visible, stops the marquee ◉

### 15-catalog.css — entirely orphaned, and not linked

`.catalog`, `.catalog-title`, `.catalog-grid`, `.cat-card`, `.cat-card img`,
`.cat-card figcaption`, `.catalog-strip`, `.catalog-info`, `.catalog-callout`,
plus its two local media queries. Kept in case a catalog band comes back.

---

## 4. Breakpoints

Three breakpoints, all `max-width`. Each one is a global override file.

| Width | What changes |
| --- | --- |
| **1024px** | `.hero-inner`, `.hero-visual` (orphaned) → single column. `.grid-products`, `.grid-gallery` → 2 columns. `.steps`, `.tiles` → 2 columns, dashed rail hidden. `.story-grid`, `.visit-grid` → 1 column. `.f-grid` → 2 columns. |
| **768px** | `.nav-links` hidden (orphaned). `#burger` forced visible. `.modal-box` → 1 column, `max-height:90vh`. `.modal-media` → `min-height:280px`. `.scroll-cue` hidden (orphaned). |
| **560px** | `.section` padding tightens to `clamp(2.5rem,6vw,3.5rem)`. `.grid-products`, `.grid-gallery`, `.v-cards`, `.steps`, `.tiles`, `.stats` → 1 column. `.f-grid` → 1 column. `.spec div` → stacked label above value. `.lb-prev`/`.lb-next` pulled to 8px from the edges. |

`04-hero.css` also carries local breakpoint blocks for the hero's own type
scale and grid (1024 / 768 / 560).

**No breakpoint above 1024px.** Above that the layout is fluid — `clamp()`,
`min()`, `%` and `fr` do the work. There is no max-width container that needs
a breakpoint because `.container` is `min(1180px, 92%)`.

### Reduced motion

`14-responsive.css` `@media (prefers-reduced-motion:reduce)`:

1. `html { scroll-behavior:auto }` — no smooth scroll.
2. `*, *::before, *::after` — animation and transition durations forced to
   `.01ms`, iteration count to 1.
3. `.js [data-reveal]` — forced visible (no rise).
4. `.marquee-track` — `animation:none` (the strip stops).

`app.js` mirrors this in JS: `reduced` disables the counter animation, the
smooth scroll on back-to-top, and the whole tilt/magnetic/parallax block.

---

## 5. Motion inventory

### Keyframes

| Name | File | Used by | Live? |
| --- | --- | --- | --- |
| `marquee` | 05 | `.marquee-track` | ◉ |
| `floaty` | 05 | `.float-chip` | ○ |
| `spin` | 05 | `.hero-ring` | ○ |
| `cue` | 05 | `.scroll-cue .mouse::after` | ○ |
| `cardIn` | 07 | `.card.pop` | ○ |

### Transition families

| Effect | Where |
| --- | --- |
| `opacity` + `visibility` | `.modal`, `.lightbox`, `#mobileMenu` — `visibility 0s linear .35s` delays the hide until the fade finishes |
| `transform` + `box-shadow` | Cards (`.stat`, `.tile`, `.v-card`, `.g-item`) |
| `transform` | `.btn`, `#burger`, `#toTop`, `.g-item` image zoom |
| `opacity` + `translate` | `.g-cap`, `#toTop` |
| `opacity` + `transform` | `.js [data-reveal]` (rise + fade) |
| `background` / `color` / `border-color` | Buttons, chips, hover states |
| `rotate` | `.modal-close`, `.lb-close` |
| `top` | `.skip` |
| `color` | `body`, `.f-col a` |
| `transform` on `.btn .arr` | arrow nudge on hover |

---

## 6. Stacking order

Every `z-index` in the project, so overlays always land in the right order.

| z-index | Element | File |
| --- | --- | --- |
| 300 | `.skip` (skip link) | 01 |
| 150 | `.progress` (scroll bar) | 01 |
| 140 | `.grain` (noise overlay) | 01 |
| 130 | `.lightbox` | 12 |
| 120 | `.modal` | 08 |
| 90 | `#navbar` | 03 |
| 85 | `#mobileMenu` | 03 |
| 80 | `#toTop` | 13 |

Rule of thumb: **scrims above chrome, chrome above content.** The grain and
progress bar sit above the nav so they never get covered.

---

## 7. Layout primitives

| Primitive | Where | Notes |
| --- | --- | --- |
| `.container` | `01` | `min(1180px, 92%)`, centred. The outer width of every section. |
| `.section` | `01` | Vertical rhythm: `clamp(3.5rem,7vw,6rem)`. Narrower on mobile. |
| `#intro` (`.intro`) | `04` | Deliberately *not* inside `.container` — it is its own `min(1180px, 92%)` card with a radius and a shadow, so it reads as a physical card rather than a page band. |
| `.grid-gallery` | `12` | 3 → 2 → 1 columns. |
| `.steps` / `.tiles` | 09 / 10 | 4 → 2 → 1 columns. |
| `.story-grid` | `06` | `1.1fr .9fr` → 1 column. |
| `.visit-grid` | `11` | 1fr 1fr → 1 column. |
| `.f-grid` | `13` | `1.4fr 1fr 1fr` → 2 → 1 columns. |
| `.stats` | `06` | 2×2 → 1 column. |

---

## 8. The rules that keep it coherent

These are not suggestions; breaking them is how the design drifts.

1. **One gold, one ink.** Any gold surface uses `#172033` for its text.
   Enforced in `.btn.solid`, `#burger`, `#toTop`, `.step:hover .step-num`,
   `.modal-close:hover`, `.lb-close:hover`.
2. **The hero is the only dark block.** Navy `#123B68` appears as a *field* only
   on `.intro-panel`. Elsewhere navy is text (`--heading`) or a translucent
   scrim over media.
3. **Borders do the work.** Cards are separated by `--line` hairlines, not
   shadows. `--shadow` is reserved for the hero card, the modal, and floating
   controls (`#toTop`, `#burger`). `--shadow-sm` is used for resting cards,
   which is a low-opacity lift, not a separator.
4. **The logo card is a label, not a photo.** The Otap & Loaf line has no
   photograph, so its tile renders as a cream card with the mark centred, a
   hairline, and navy caption text.
5. **Copy is the shop's own.** Keep new copy at that register.
6. **Never use `box-shadow` as a border.** If you need a card to stand out,
   use `border:1px solid var(--line)`.

---

## 9. Recipes

### Change the whole palette

Edit `00-tokens.css` only. Then check three things that are **not** tokens:

- `.intro-panel { background:#123B68 }` in `04-hero.css`
- `.intro-panel { color:#F8F3E8 }` and `.intro-title { color:#F8F3E8 }`
- The cream literals `#F8F3E8` in `.intro-caption`, `.lb-bar`, `.lb-cap`,
  `.lb-close`, `.lb-prev`, `.lb-next`, and the navy scrim `rgba(11,39,70,…)`
  in `.intro-caption`, `.modal`, `.lb-prev/.lb-next`.

### Change a font

1. Change `--serif` / `--sans` in `00-tokens.css`.
2. Change the Google Fonts `<link>` in `index.html` `<head>`.

### Change section rhythm

`.section` padding in `01-base.css`. Narrower override at 560px in
`14-responsive.css`.

### Change card radius

`--r` in `00-tokens.css` — it drives `.stat`, `.tile`, `.v-card`, `.g-item`.

### Add a button variant

`02-components.css`. Follow the `.btn.solid` pattern and remember rule 1:
if the fill is gold, the text must be `#172033`.

### Add a new section

1. Add `styles/NN-newsection.css`, following the header-comment format of the
   existing files.
2. Link it in `index.html` `<head>` **after `13-footer.css` and before
   `14-responsive.css`**.
3. Add the markup inside `<main>` in `index.html`. Wrap content in
   `.container` and give the section `class="section"` plus an `id`.
4. Add any mobile overrides to `14-responsive.css`, not to the new file.
5. Do not grow `01-base.css` — it stays tokens/reset/primitives only.

---

## 10. Audit — orphaned rules

Selectors that currently match nothing. Harmless, but they will send the next
reader hunting for markup that does not exist. Two options per entry: delete
it, or wire it up.

| File | Orphaned selectors | Note |
| --- | --- | --- |
| `00-tokens.css` | `--surface-blue` | Unused variable |
| `05-marquee.css` | `.hero`, `.hero-bg`, `.blob*`, `.hero-inner`, `.hero-title*`, `.hero-tag`, `.hero-desc`, `.hero-cta`, `.hero-meta`, `.meta-chip`, `.hero-visual`, `.layer`, `.hero-frame`, `.hero-ring`, `.float-chip*`, `.scroll-cue*`, `@keyframes floaty/spin/cue` | Previous design's full-bleed hero. `.hero-photo`, `.mono`, `.no-img` in this file are still live. |
| `07-products.css` | Everything | Previous design's card grid, replaced by `.g-item` in `12-gallery.css` |
| `09-craft.css` | `#freshness` | Duplicate of the rule in `10-freshness.css` |
| `12-gallery.css` | `#gallery` | No gallery section in the current markup |
| `14-responsive.css` | `.hero-inner`, `.hero-visual`, `.nav-links`, `.scroll-cue`, `.grid-products`, `.float-chip.fc1/.fc2` | Dead selectors inside otherwise-live media blocks |
| `15-catalog.css` | Everything, and the file is not linked | Kept for a future catalog band |

### Dead code in `app.js` for the same reason

| Code | Line | Why |
| --- | --- | --- |
| `$$(".tilt")` tilt handler | 269–277 | No element has `class="tilt"` |
| `#heroVisual` parallax loop | 285–300 | No `#heroVisual` element exists in `index.html` |
| Scroll spy | 139–145 | No `.nav-link` elements exist; the observer runs but has nothing to highlight |

The scroll spy is worth keeping in mind if you later add a desktop nav — the
hook is already there.
