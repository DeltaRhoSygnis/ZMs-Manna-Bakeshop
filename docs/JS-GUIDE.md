# JS Guide — `app.js`

Every function, data structure and DOM target in the interaction layer.

Related: [`BEGINNER-GUIDE.md`](./BEGINNER-GUIDE.md) ·
[`JS-CSS-BRIDGE.md`](./JS-CSS-BRIDGE.md) ·
[`CSS-GUIDE.md`](./CSS-GUIDE.md)

---

## 1. Shape of the file

Plain JavaScript. No framework, no library, no build step. One file, ~500
lines, read from the top.

```
1.  Small helpers
2.  Site data
3.  Draw the product cards
4.  Apply the settings
5.  Reveal things as you scroll
6.  Count up the statistics
7.  The header, the progress bar and back-to-top
8.  The full-screen menu
9.  The product popup
10. The photo viewer
11. Keyboard controls
12. Small mouse effects
13. Run everything
```

Two environment flags are read once, at the top:

| Flag | Meaning |
| --- | --- |
| `userPrefersLessMotion` | The visitor's operating system asks for less animation |
| `userHasMouse` | The device has a real mouse or trackpad, not a touch screen |

Both gate the expensive effects. Nothing here runs on a phone that has told
the OS it wants less motion.

### The helpers

```js
function findElement(selector, parent) {
  return (parent || document).querySelector(selector);
}

function findElements(selector, parent) {
  return Array.from((parent || document).querySelectorAll(selector));
}
```

Both take an optional second argument, so you can look inside a particular
element: `findElement(".modal-close", popup)`.

### Why there is no "ready" event

`index.html` loads `app.js` with `defer`, which means the browser has
already read the whole page before the script runs. So the script can look up
elements straight away — there is no `DOMContentLoaded` wrapper.

---

## 2. Data

### `SITE_CONFIG`

| Key | Value | Notes |
| --- | --- | --- |
| `facebook` | a Facebook **search** URL | **Placeholder.** Replace with the real page URL. Every `[data-fb]` link gets this href. |
| `bannerImg` | `assets/Patatas.webp` | The photo in the banner |

### `PRODUCTS`

Six records. Field reference:

| Field | Type | Used for | Example |
| --- | --- | --- | --- |
| `id` | string | `data-id`; looked up by `openProductPopup` | `"biscocho"` |
| `name` | string | Card caption, popup title, `alt` | `"Biscocho"` |
| `cat` | string | Category key | `"toasted"` |
| `catLabel` | string | The `.tag` in the popup | `"Toasted Specialties"` |
| `tag` | string | Short badge | `"Top seller"` |
| `img` | string | Path under `assets/` | `"assets/Biscocho.webp"` |
| `fit` | string? | `"contained"` for the logo-style product | `"contained"` (Otap only) |
| `gradientFrom` / `gradientTo` | hex | The card's gradient → `--gradient-from` / `--gradient-to` | `"#D9A05B"` |
| `letters` | string | The fallback letters, shown when a photo cannot load | `"B"` |
| `desc` | string | The popup description | — |
| `texture` | string | The "Texture" spec row | — |
| `notes` | string | The "Flavor notes" spec row | — |
| `pair` | string | The "Best enjoyed with" spec row | — |
| `pack` | string | The "Pack" spec row | — |
| `keep` | string | The "Keeping it fresh" spec row | — |

### `PHOTOS`

Six photos for the viewer. Fields: `src`, `cap`, `gradientFrom`, `gradientTo`,
`letters`.

**The link between the two:** `openProductPopup` finds the photo index with
`PHOTOS.findIndex(photo => photo.src === product.img)`. If a product's image
has no matching photo, the popup omits the "View full image" button. The
sixth photo has no product, so it is viewer-only.

---

## 3. The modules

### `buildProductTiles()`

Builds the grid from `PRODUCTS`, then attaches a click listener to each card
as it creates it.

`#product-grid` is **empty in the HTML**. JavaScript fills it. Each card is:

```html
<button class="product-card" data-id="…" data-reveal data-delay="…"
        style="--gradient-from:…;--gradient-to:…"
        aria-haspopup="dialog" aria-label="View details: …">
  <span class="fallback-text" aria-hidden="true">…</span>
  <img src="…" class="…" alt="…" loading="lazy" decoding="async">
  <span class="product-caption">…</span>
</button>
```

Three things worth noticing:

1. The gradient is injected as **inline custom properties**, so the CSS stays
   generic and the colours live in the data.
2. `data-delay` is staggered `0 / 90 / 180ms` by column (`index % 3`), which
   gives the grid a left-to-right reveal.
3. `data-reveal` opts the card into the scroll-reveal system.

The logo-only product also gets `is-logo`, and its image gets `is-contained`.

### `handleBrokenImage(image)`

Adds `.image-missing` to the image's **parent** when the image fails to load.
CSS then hides the `<img>` and reveals the `.fallback-text` letters behind
it.

The second line matters: the `error` event alone misses images that already
failed before the listener was attached, so the function also checks
`image.complete && image.naturalWidth === 0`.

### `applySiteSettings()`

Sets the banner photo from `SITE_CONFIG.bannerImg`, writes the Facebook URL
into every `[data-fb]` link, and stamps the year into `#year`.

### `setupScrollReveal()`

An `IntersectionObserver` that adds `.is-visible` when an element is 12%
visible and at least 40px above the bottom of the viewport. Then it
**unobserves** it, so the animation runs once.

`data-delay` becomes an inline `transitionDelay`.

### `setupAnimatedCounters()`

Reads `data-count` (the target number) and `data-suffix` (e.g. `"g"`), and
animates over 1400ms with a cubic ease-out (`1 - (1 - progress)³`).

`threshold: 0.6` means the number must be 60% visible before it counts.
Under `userPrefersLessMotion` it writes the final value immediately.

### `setupScrollChrome()`

One scroll handler, four effects, throttled to one frame per scroll event
with the `waitingForFrame` flag:

| Effect | What changes |
| --- | --- |
| The progress bar | `#progress-bar`'s width becomes the percentage scrolled |
| The header | `.is-hidden` when scrolling down past 220px, back when scrolling up |
| The back-to-top button | `.is-shown` past 600px |

### `setupMobileMenu()` and `setMenuOpen(open)`

`setMenuOpen` does six things at once:

1. `.is-active` on the menu button — the three bars fold into an X
2. `aria-expanded` flips on the button
3. `.is-open` on the menu
4. Inline `visibility` — so the links leave the tab order the instant the
   menu closes
5. `aria-hidden` flips on the menu
6. `.scroll-locked` on the body — the page behind stops scrolling

And, when opening, it moves the keyboard focus to the first link.

`setMenuOpen` is top level because the keyboard handler also closes the menu.

### `keepFocusInside(event, box)`

The focus trap. Collects the focusable elements inside `box`, filters out
invisible ones, and wraps the ends: Tab from the last goes to the first,
Shift+Tab from the first goes to the last.

### `openProductPopup(productId)` and `closeProductPopup()`

**Opening** finds the product, saves `document.activeElement` into
`productPopupPreviouslyFocused`, writes the gradient onto `.modal-media`,
rewrites the media and the info panels, adds `.is-open`, sets inline
`visibility`, sets `aria-hidden="false"`, locks the body, and focuses the
close button.

**Closing** restores the focus, removes `.is-open`, clears the inline
`visibility`, sets `aria-hidden="true"` and unlocks the body.

`setupProductPopup()` wires the clicks: a `[data-gl]` button closes the popup
and opens the photo viewer; the close button or a click on the backdrop
closes the popup.

### `openPhotoViewer(index)`, `closePhotoViewer()`, `showNextPhoto(direction)`

The viewer saves its own focus target — `photoViewerPreviouslyFocused` — so
it must not share a variable with the popup: they restore focus to different
things.

`showNextPhoto` wraps around at the ends:

```js
currentPhotoIndex = (currentPhotoIndex + direction + PHOTOS.length) % PHOTOS.length;
```

`setupPhotoViewer()` wires the arrows, the close button, the backdrop, and
hides a photo that fails to load.

### `setupKeyboardControls()`

One `keydown` listener on the document, dispatching on **what is currently
open**, in priority order:

| If open | Escape | Arrows | Tab |
| --- | --- | --- | --- |
| The photo viewer | close it | step ±1 | trapped inside it |
| The product popup | close it | — | trapped inside it |
| The menu | close it, focus the menu button | — | trapped inside it |

### `setupMouseEffects()`

Makes the buttons drift towards the pointer, by up to 8px in each direction.
Skipped entirely when there is no mouse, or when less motion was asked for.

---

## 4. Accessibility behaviour

| Concern | How it is handled |
| --- | --- |
| Skip link | `<a class="skip-link">` in the markup, styled in `base.css`, slides in on focus |
| Dialog semantics | `role="dialog" aria-modal="true" aria-labelledby="modal-title"` on the popup; `aria-label` on the viewer |
| Hidden state | `aria-hidden` toggled on the popup, the viewer and the menu |
| Focus entry | `.modal-close`, `.photo-close`, or the first menu link |
| Focus exit | Restored to the element that opened the overlay |
| Focus containment | `keepFocusInside` on Tab and Shift+Tab |
| Escape | Closes the top-most overlay; on the menu, returns focus to the menu button |
| Button labelling | Cards carry `aria-label="View details: <name>"`; the monogram is `aria-hidden` |
| Motion | `prefers-reduced-motion` disables the counters, the smooth scroll, the ticker and the mouse effects |
| Progressive enhancement | The page is readable with JavaScript off; only the product grid needs it |

---

## 5. Performance notes

- The scroll handler is `passive:true` and throttled to one animation frame.
- Reveals and counters use `IntersectionObserver`, so off-screen work never runs.
- Revealed elements are unobserved, so the observer set shrinks as you scroll.
- Product images use `loading="lazy" decoding="async"`; the banner image uses
  `fetchpriority="high"`.

---

## 6. Editing the data

### Change a product's copy, photo or colours

Edit the record in `PRODUCTS`. Nothing else needs touching — the card, the
popup and the spec list are all generated from it.

### Add a seventh product

1. Append a record to `PRODUCTS` with all 15 fields.
2. Add its photo to `assets/`.
3. If you want a "View full image" button in its popup, add a matching
   `PHOTOS` entry with the **same `src` string** — the link is made by
   string equality, not by id.
4. Nothing in the CSS changes. The grid is three columns and wraps.

### Change the photos the viewer shows

Edit `PHOTOS`. The counter updates itself.

### Change the Facebook link

Edit `SITE_CONFIG.facebook`. Every element with `data-fb` picks it up on load.

---

## 7. Adding a new behaviour

The pattern to follow:

1. **Write the markup** in `index.html` with a stable `id` or `data-` hook.
2. **Query it** with `findElement` / `findElements`.
3. **Write the handler** as a named function, then attach it.
4. **Drive the CSS with a class or a custom property**, never with inline
   styles for anything that has a visual state.
5. **Document the new class** in [`CSS-GUIDE.md`](./CSS-GUIDE.md) and in
   [`JS-CSS-BRIDGE.md`](./JS-CSS-BRIDGE.md).

If the new behaviour needs its own CSS, add a file in `styles/` following the
numbering convention, and link it in `index.html` **before
`responsive.css`** so the breakpoint overrides still win.

---

## 8. Known gaps

These were removed in the refactor because nothing used them. They are listed
so you know they were not mistakes.

| Gap | Notes |
| --- | --- |
| The `.tilt` handler | No element had `class="tilt"`. The magnetic-button effect in `setupMouseEffects` covers the same ground. |
| The `#heroVisual` parallax | No `#heroVisual` element exists. The banner is a static card now. |
| The scroll spy | No `.nav-link` elements exist — the full-screen menu is the only navigation. If you ever add a desktop nav, the hook is a small addition. |
| The `.scrolled` class | It was toggled on the header but no CSS rule read it. |
