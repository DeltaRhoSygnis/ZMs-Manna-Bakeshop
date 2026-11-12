# JS Guide — `app.js`

Every function, data structure, and DOM target in the interaction layer.

Related: [`JS-CSS-BRIDGE.md`](./JS-CSS-BRIDGE.md) ·
[`CSS-GUIDE.md`](./CSS-GUIDE.md) · [`../DESIGN.md`](../DESIGN.md)

---

## 1. Shape of the file

```js
(() => {
  "use strict";
  // ...everything...
})();
```

- **One IIFE.** No globals leak, no module system, no imports. `app.js` is
  loaded with `defer`, so the DOM is ready when it runs.
- **Zero dependencies.** No jQuery, no build step.
- **~304 lines.** Read top to bottom: data first, then rendering, then
  behaviour.

Two environment flags are captured once at the top and used throughout:

| Flag | Line | Meaning |
| --- | --- | --- |
| `reduced` | 25 | `matchMedia("(prefers-reduced-motion: reduce)")` — true when the OS asks for less motion |
| `finePointer` | 26 | `matchMedia("(hover: hover) and (pointer: fine)")` — true on mouse/trackpad, false on touch |

These two flags gate every "expensive" animation in the file. Nothing here
runs on a phone that has told the OS it wants less motion.

### Helpers

```js
const $  = (s, c = document) => c.querySelector(s);      // one element
const $$ = (s, c = document) => [...c.querySelectorAll(s)]; // all elements, as an array
```

Both take an optional context, so `$(".modal-media", modal)` searches inside
the modal rather than the whole document.

---

## 2. Module map

| Lines | Module | What it does |
| --- | --- | --- |
| 1–16 | File-map comment | A table of contents, kept up to date by hand |
| 21–26 | IIFE + helpers | `$`, `$$`, `reduced`, `finePointer` |
| 28–32 | `CONFIG` | Site-wide values |
| 34–65 | `PRODUCTS` | The 6 product records |
| 67–74 | `GALLERY` | The 6 lightbox photos |
| 76–81 | `bindFallback` | Broken-image → monogram fallback |
| 83–96 | Render | Builds the product grid, wires the hero image and Facebook links |
| 98–102 | Scroll reveal | `IntersectionObserver` → `.in` |
| 104–120 | Counters | `IntersectionObserver` → animated numbers |
| 122–136 | Nav / progress / to-top | One rAF-throttled scroll handler |
| 138–145 | Scroll spy | Highlights the active nav link (no `.nav-link` in markup yet) |
| 147–161 | Mobile menu | `setMenu` + burger wiring |
| 163–171 | `trapTab` | Focus trap helper |
| 173–217 | Product modal | `openModal` / `closeModal` + click wiring |
| 219–249 | Lightbox | `updateLb` / `openLightbox` / `closeLb` / `stepLb` |
| 251–265 | Global keyboard | Escape / arrows / Tab, dispatched by what is open |
| 267–301 | Pointer effects | Tilt, magnetic buttons, hero parallax (fine pointer only) |
| 303 | Year | `#year` text content |

---

## 3. Data

### 3.1 `CONFIG` (lines 29–32)

| Key | Value | Notes |
| --- | --- | --- |
| `facebook` | a Facebook **search** URL | **Placeholder.** Replace with the real page URL. Every `[data-fb]` link gets this href. |
| `heroImg` | `assets/Patatas.webp` | Overwrites the `src` of `.hero-photo img` at runtime |

### 3.2 `PRODUCTS` (lines 34–65)

Six records. Field reference:

| Field | Type | Used for | Example |
| --- | --- | --- | --- |
| `id` | string | `data-id`; looked up by `openModal` | `"cookie-de-longa"` |
| `name` | string | Tile caption, modal title, `alt` | `"Cookie de Longa"` |
| `cat` | string | Category key | `"cookies"` |
| `catLabel` | string | The `.chip` in the modal | `"Cookies & Biscuits"` |
| `tag` | string | Short badge | `"Top seller"` |
| `img` | string | Path under `assets/` | `"assets/Biscocho.webp"` |
| `fit` | string? | `"contain"` for logo-style products | `"contain"` (Otap only) |
| `g1`, `g2` | hex | Gradient endpoints → `--g1` / `--g2` | `"#D9A05B"` |
| `mono` | string | Fallback monogram text | `"B"` |
| `desc` | string | Modal description | — |
| `texture` | string | "Texture" spec row | — |
| `notes` | string | "Flavor notes" spec row | — |
| `pair` | string | "Best enjoyed with" spec row | — |
| `pack` | string | "Pack" spec row | — |
| `keep` | string | "Keeping it fresh" spec row | — |

### 3.3 `GALLERY` (lines 67–74)

Six photos for the lightbox. Fields: `src` (path), `cap` (caption),
`g1`/`g2` (stage gradient), `mono` (fallback text).

**Link between the two:** `openModal` finds the gallery index with
`GALLERY.findIndex(g => g.src === p.img)`. If a product's `img` has no
matching `GALLERY.src`, the modal omits the "View full image" button. The
sixth gallery entry (`BiscochoNice.webp`) has no product, so it is
lightbox-only.

---

## 4. Rendering

### `bindFallback(img)` — lines 77–81

```js
function bindFallback(img){
  const fail = () => img.parentElement.classList.add("no-img");
  img.addEventListener("error", fail, { once:true });
  if (img.complete && img.naturalWidth === 0 && img.src) fail();
}
```

Adds `.no-img` to the **image's parent** when the image fails to load. CSS
then hides the `<img>` and reveals the `.mono` monogram behind it.

Note the second line: the `error` event alone misses images that already
failed before the listener was attached (cached 404s), so the file checks
`complete && naturalWidth === 0` too.

### Product grid render — lines 84–96

```js
const grid = $("#productGrid");
grid.innerHTML = PRODUCTS.map((p, i) => `...`).join("");
```

`#productGrid` is **empty in the HTML**. JavaScript builds the whole grid.
The template per product:

```html
<button class="g-item" data-id="…" data-reveal data-delay="…"
        style="--g1:…;--g2:…"
        aria-haspopup="dialog" aria-label="View details: …">
  <span class="mono" aria-hidden="true">…</span>
  <img src="…" class="…" alt="…" loading="lazy" decoding="async">
  <span class="g-cap">…</span>
</button>
```

Three things to notice:

1. The gradient is injected as **inline custom properties** (`--g1`, `--g2`),
   so the CSS in `12-gallery.css` stays generic and the colours live in the
   data.
2. `data-delay` is staggered `0 / 90 / 180ms` by column (`i % 3`), giving the
   grid a left-to-right reveal.
3. `data-reveal` opts the tile into the scroll-reveal system.

Then, lines 93–96:

- `$$(".g-item img, .hero-photo img").forEach(bindFallback)` — wire fallbacks.
- `$(".hero-photo img").src = CONFIG.heroImg` — apply the config hero.
- `$$("[data-fb]").forEach(a => a.href = CONFIG.facebook)` — apply the social link.

---

## 5. Behaviour modules

### 5.1 Scroll reveal — lines 99–102

```js
const ro = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting){ en.target.classList.add("in"); ro.unobserve(en.target); } });
}, { threshold:.12, rootMargin:"0px 0px -40px 0px" });
```

Fires when an element is 12% visible and at least 40px above the bottom of
the viewport. Adds `.in`, then **unobserves** so the animation runs once.

`data-delay` becomes an inline `transitionDelay`:
`el.style.transitionDelay = el.dataset.delay + "ms"`.

CSS side: `.js [data-reveal]` starts hidden and translated; `.js [data-reveal].in`
resets it. The `.js` class is added by a tiny inline script in `index.html`
`<head>` so that with JavaScript disabled nothing is ever invisible.

### 5.2 Counters — lines 105–120

```js
const co = new IntersectionObserver(entries => { ... }, { threshold:.6 });
```

Reads `data-count` (the target number) and `data-suffix` (e.g. `"g"`).
Animates over 1400ms with a cubic ease-out
(`e = 1 - Math.pow(1 - k, 3)`), writing to `textContent` each frame.

Under `prefers-reduced-motion`, it writes the final value immediately.

`threshold:.6` means the number must be 60% visible before it counts.

### 5.3 Scroll chrome — lines 123–136

One handler, four effects, throttled to one rAF per frame:

```js
function onScroll(){
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";   // progress bar width
  nav.classList.toggle("scrolled", y > 24);              // (no CSS uses .scrolled)
  nav.classList.toggle("hide", y > 220 && y > lastY);    // hide on scroll-down
  lastY = y;
  toTop.classList.toggle("show", y > 600);                // show back-to-top
  ticking = false;
}
```

The `ticking` flag guarantees at most one `onScroll` per animation frame
regardless of how many scroll events fire.

`.scrolled` is toggled but **no CSS rule uses it** — a leftover hook if you
want the nav pill to change after the hero.

### 5.4 Scroll spy — lines 139–145

Observes `main section[id]` and marks the matching `.nav-link` as `.active`.
There are currently **no `.nav-link` elements** in the markup (the site uses
a full-screen mobile menu instead), so this runs but does nothing. The hook
is ready if you add a desktop nav.

### 5.5 Mobile menu — lines 148–161

```js
function setMenu(open){
  menuOpen = open;
  burger.classList.toggle("active", open);      // → X icon
  burger.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("open", open);           // → fade/slide in
  menu.style.visibility = open ? "visible" : "";
  menu.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("lock", open);  // → stop page scroll
  if (open){ const first = $("a", menu); if (first) first.focus(); }
}
```

Six things happen at once: the burger becomes an X, `aria-expanded` flips,
the overlay opens, `aria-hidden` flips, the page scroll locks, and focus moves
to the first link.

The `menu.style.visibility` line is deliberate. CSS alone would leave the
overlay's links focusable while it is faded out, so JS sets `visibility`
inline to take it out of the focus order instantly.

### 5.6 Focus trap — lines 164–171

```js
function trapTab(e, box){ ... }
```

Collects the focusable elements inside `box`, filters out invisible ones
(`el.offsetParent !== null`), and wraps Tab around the ends: Tab from the last
element goes to the first, Shift+Tab from the first goes to the last.

### 5.7 Product modal — lines 174–217

**`openModal(id)`**

1. Looks up the product by `id`; returns if not found.
2. Saves `document.activeElement` in `lastFocus` for restoration.
3. Writes `--g1` / `--g2` onto `.modal-media` and toggles `.is-logo`.
4. Rewrites `.modal-media` innerHTML with the monogram + image.
5. Rewrites `.modal-info` innerHTML with the chip, title, description, the
   five-row `<dl class="spec">`, the note, and — if the product exists in
   `GALLERY` — a "View full image" button carrying `data-gl="<index>"`.
6. Adds `.open` to the modal, sets inline `visibility`, sets
   `aria-hidden="false"`, locks the body, and focuses `.modal-close`.

**`closeModal()`**

Restores focus to `lastFocus`, removes `.open`, clears the inline
`visibility`, sets `aria-hidden="true"`, unlocks the body.

**Wiring (lines 212–217)**

- Delegated click on `#productGrid`: `e.target.closest(".g-item")` →
  `openModal(c.dataset.id)`. Delegation works because the grid is rebuilt
  from scratch — no re-binding needed.
- Delegated click on the modal: a `[data-gl]` button closes the modal and
  opens the lightbox at that index; a click on the backdrop or on `.modal-close`
  closes it.

### 5.8 Lightbox — lines 220–249

**`updateLb()`** writes the current photo into the DOM: image `src`/`alt`,
caption text, the "3 / 6" counter, and the stage background as an inline
`linear-gradient` from the entry's `g1`/`g2`.

**`openLightbox(i)`** saves focus, sets the index, updates, adds `.open`,
sets inline `visibility`, sets `aria-hidden="false"`, locks the body, focuses
`.lb-close`.

**`closeLb()`** is the mirror image — restores focus, removes `.open`, clears
visibility, unlocks the body.

**`stepLb(d)`** advances or rewinds, wrapping around:
`(lbIndex + d + GALLERY.length) % GALLERY.length`.

**Wiring** — `.lb-prev` / `.lb-next` click handlers, a backdrop click, and an
`error` handler on `.lb-img` that hides a broken image (`display:none`).

### 5.9 Global keyboard — lines 252–265

A single `keydown` listener on `document` that dispatches on **what is
currently open**, in priority order:

| If open | Escape | Arrows | Tab |
| --- | --- | --- | --- |
| Lightbox | close lightbox | step ±1 | trapped in lightbox |
| Modal | close modal | — | trapped in modal |
| Mobile menu | close menu, focus the burger | — | trapped in menu |

Only one overlay can be open at a time, so the `else if` chain is a
priority order, not a queue.

### 5.10 Pointer effects — lines 268–301

All gated behind `finePointer && !reduced`.

**Tilt** (`.tilt`) — tracks the pointer inside the element and applies a 3D
rotation with `perspective(900px)`, max 5° on each axis, plus a 6px lift.
Resets on `pointerleave`. **Dead code:** nothing in the markup has
`class="tilt"`.

**Magnetic buttons** (`.btn`) — the button follows the pointer by up to 8px in
each direction. Reset on `pointerleave`.

**Hero parallax** (`#home` → `#heroVisual`) — a rAF loop eases two values
(`cx`, `cy`) toward the pointer position at 6% per frame, and writes them as
`--mx` / `--my` custom properties. The CSS then uses them for parallax layers
via `calc(var(--mx) * var(--depth) * 1px)`. **Dead code:** there is no
`#heroVisual` element in the current markup (the hero was redesigned as the
split card in `04-hero.css`), so the loop never starts.

### 5.11 Year — line 303

`$("#year").textContent = new Date().getFullYear()` — the footer copyright
year.

---

## 6. Accessibility behaviour summary

| Concern | How it is handled |
| --- | --- |
| Skip link | `<a class="skip">` in the HTML, styled in `01-base.css`, slides in on focus |
| Dialog semantics | `role="dialog" aria-modal="true" aria-labelledby="modalTitle"` on the modal; `aria-label` on the lightbox |
| Hidden state | `aria-hidden` toggled on the modal, lightbox and mobile menu |
| Focus entry | `.modal-close`, `.lb-close`, or the first menu link |
| Focus exit | Restored to the element that opened the overlay |
| Focus containment | `trapTab` on Tab/Shift+Tab |
| Escape | Closes the top-most overlay; on the menu, returns focus to the burger |
| Button labelling | Tiles carry `aria-label="View details: <name>"`; the monogram is `aria-hidden` |
| Live region | None — no announcements are made on open/close |
| Motion | `prefers-reduced-motion` disables counters, smooth scroll, tilt and parallax |

---

## 7. Performance notes

- Scroll handler is `passive:true` and rAF-throttled.
- Reveals and counters use `IntersectionObserver`, so off-screen work never runs.
- Reveal elements are unobserved after firing, so the observer set shrinks.
- Product images use `loading="lazy" decoding="async"`; the hero image uses
  `fetchpriority="high"`.
- The hero parallax rAF loop runs forever — but only on fine-pointer devices,
  and only if `#heroVisual` exists.

---

## 8. Editing product data

### Change a product's copy, photo, or colours

Edit the record in `PRODUCTS` (`app.js` lines 34–65). Nothing else needs
touching — the tile, the modal, and the spec list are all generated from it.

### Add a seventh product

1. Append a record to `PRODUCTS` with all 15 fields.
2. Add its photo to `assets/`.
3. If you want a "View full image" button in its modal, add a matching
   `GALLERY` entry with the **same `src` string** — the link is made by
   string equality, not by id.
4. Nothing in the CSS changes. The grid is 3 columns and wraps.

### Change the lightbox photos

Edit `GALLERY` (`app.js` lines 67–74). The counter updates automatically.

### Change the Facebook link

Edit `CONFIG.facebook`. Every element with `data-fb` picks it up on load.

---

## 9. Adding a new behaviour

The pattern to follow:

1. **Write the markup** in `index.html` with a stable `id` or `data-` hook.
2. **Query it** with `$` / `$$` at module scope. Query inside the IIFE, near
   the top of the file if the element must exist before `defer` runs.
3. **Write the handler** as a named function, then attach it.
4. **Delegate** if the element is created dynamically (the product grid is
   rebuilt, so it uses delegation on the container).
5. **Drive CSS with a class or a custom property**, never with inline styles
   for anything that has a visual state. Document the new class in
   [`CSS-GUIDE.md`](./CSS-GUIDE.md) and the new class in
   [`JS-CSS-BRIDGE.md`](./JS-CSS-BRIDGE.md).

If the new behaviour needs its own CSS, add a file in `styles/` following the
numbering convention, and link it in `index.html` **before
`14-responsive.css`** so the breakpoint overrides still win.

---

## 10. Known gaps

| Gap | Where | Notes |
| --- | --- | --- |
| `.tilt` handler | 269–277 | No element uses `class="tilt"` |
| Hero parallax | 285–300 | `#heroVisual` does not exist |
| Scroll spy | 139–145 | No `.nav-link` elements exist |
| `.scrolled` class | 128 | Toggled, but no CSS rule consumes it |
| `#gallery` styles | `12-gallery.css` | The section was replaced by the product grid |
| `productGrid` empty in HTML | 148 | Requires JavaScript; a `<noscript>` note sits next to it |
