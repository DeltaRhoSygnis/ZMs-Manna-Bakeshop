# JS ↔ CSS Bridge — Zm's Manna Bakeshop

**How a line of JavaScript ends up changing something you can see.**

This is the answer to "how do the JS functions relate to the CSS?".

Related: [`BEGINNER-GUIDE.md`](./BEGINNER-GUIDE.md) ·
[`JS-GUIDE.md`](./JS-GUIDE.md) · [`CSS-GUIDE.md`](./CSS-GUIDE.md)

---

## 1. The contract in one paragraph

JavaScript in this project **never styles anything directly**. It does not
set a `color`, a `width`, a `padding` or an `opacity`. What it does is
write *state* — a class name, a data attribute, or a CSS custom property —
and the stylesheet reacts to that state. So there are exactly four channels:

| Channel | JS writes | CSS reads |
| --- | --- | --- |
| **State class** | `el.classList.add("is-open")` | `.modal.is-open { … }` |
| **Custom property** | `el.style.setProperty("--gradient-from", "#D9A05B")` | `background:linear-gradient(…, var(--gradient-from), var(--gradient-to))` |
| **Inline style (exceptional)** | `el.style.width = "42%"` | inline style wins the cascade |
| **Text content** | `el.textContent = "3 / 6"` | the element's typography, not its text |

Everything else — colour, spacing, radius, shadow, easing, breakpoints —
lives in `styles/`.

### The three laws

1. **JS owns state, CSS owns appearance.** If you are about to write
   `el.style.background = "gold"` in JS, stop: add a class and write the
   rule in CSS instead.
2. **Every state class needs a CSS rule**, and every state class is listed
   in this document. If you add one, add it to the table below.
3. **CSS never invents behaviour.** CSS can animate and transition, but it
   cannot decide *when* — that is always JS's job.

---

## 2. The state classes

Every class JavaScript adds or removes at runtime, and the CSS that gives it
meaning. All of them start with `is-`, or are a body state.

| Class | Added / removed by | CSS rule | File | What you see |
| --- | --- | --- | --- | --- |
| `.is-visible` | The scroll reveal observer | `.js [data-reveal].is-visible` | base | The element rises 28px and fades in |
| `.is-open` | `setMenuOpen`, `openProductPopup`, `closeProductPopup`, `openPhotoViewer`, `closePhotoViewer` | `#mobile-menu.is-open`, `.modal.is-open`, `.photo-viewer.is-open` | components | The overlay fades in; its box scales up |
| `.is-active` | `setMenuOpen` | `#menu-button.is-active .menu-icon span` | components | The three bars fold into an X |
| `.is-hidden` | `onScroll` | `#navbar.is-hidden` | components | The header slides off the top while scrolling down |
| `.is-shown` | `onScroll` | `#back-to-top.is-shown` | components | The back-to-top button fades and slides in |
| `.is-logo` | `buildProductTiles`, `openProductPopup` | `.modal-media.is-logo`, `.product-grid .product-card.is-logo` | components, sections | A flat cream card instead of a gradient; navy caption with a hairline |
| `.is-contained` | `buildProductTiles`, `openProductPopup` | `.modal-media img.is-contained`, `.product-grid .product-card img.is-contained` | components, sections | The photo is shown whole instead of cropped |
| `.image-missing` | `handleBrokenImage` | `.image-missing img`, `.image-missing .fallback-text` | components | The broken photo is replaced by its letters |
| `.scroll-locked` | `setMenuOpen`, `openProductPopup`, `closeProductPopup`, `openPhotoViewer`, `closePhotoViewer` | `body.scroll-locked` | base | The page scroll freezes behind the overlay |

Two classes exist in CSS but are **not** written by JS — they come from the
markup and simply *enable* a state:

| Class | Where it comes from | CSS rule | File |
| --- | --- | --- | --- |
| `.js` | The inline `<script>` in `index.html` `<head>` | `.js [data-reveal]` | base |
| `.is-product` | *gone* — there is only one grid now | — | — |

---

## 3. Custom properties written from JS

| Property | Written by | Value | Read by | Effect |
| --- | --- | --- | --- | --- |
| `--gradient-from` | `buildProductTiles`, `openProductPopup` | a hex colour | `.product-card` background, `.modal-media` background | The gradient's start |
| `--gradient-to` | `buildProductTiles`, `openProductPopup` | a hex colour | the same | The gradient's end |

Those two are the **only** custom properties that carry data into CSS.
Everything else in `theme.css` is a design token.

---

## 4. Inline styles written from JS

These bypass the cascade, so they are worth knowing about. Every one of them
is a measurement, a position, or a transition override — never a design
decision.

| Written by | Property | Why inline |
| --- | --- | --- |
| `setupScrollChrome` | `#progress-bar`'s `width` | A live percentage that changes every frame |
| `setupScrollReveal` | `transitionDelay` | Read from `data-delay`; a per-element time |
| `openProductPopup` / `closeProductPopup` | the popup's `visibility` | Puts the overlay in and out of the focus order *instantly*, while CSS fades it over .35s |
| `openPhotoViewer` / `closePhotoViewer` | the viewer's `visibility` | The same trick |
| `setMenuOpen` | the menu's `visibility` | The same trick |
| `showCurrentPhoto` | `.photo-frame`'s `background` | The gradient is built per-photo and written as a whole `linear-gradient` |
| `setupMouseEffects` | `transform` | A per-frame position, on pointer move |

### The `visibility` trick, in detail

It looks redundant, because CSS already has `.modal.is-open { visibility:visible }`.
But CSS transitions `visibility` with a 0.35s delay, so without the inline
override the popup's buttons would stay in the tab order for a third of a
second *after* the overlay closed, and the first `.focus()` call would land
on an element the browser still considered hidden. JS sets it inline so
focus lands on the first paint.

---

## 5. The effect table

Every JS function, and the CSS it drives.

| JS function | DOM it touches | Class / property written | CSS that reacts | File |
| --- | --- | --- | --- | --- |
| `handleBrokenImage` | any `img` | `.image-missing` on the parent | `.image-missing img`, `.image-missing .fallback-text` | components |
| `buildProductTiles` | `#product-grid` | inline `--gradient-from`, `--gradient-to` | `.product-card` background | sections |
| `buildProductTiles` | each card | `data-reveal`, `data-delay` | `.js [data-reveal]` | base |
| `buildProductTiles` | the Otap card | `.is-logo`, `img.is-contained` | `.product-grid .product-card.is-logo`, `… img.is-contained` | sections |
| `buildProductTiles` | each card | `data-id` | — (read by the click handler) | — |
| `applySiteSettings` | `[data-fb]` | `href` | — (a link target, not a style) | — |
| the reveal observer | `[data-reveal]` | `.is-visible` | `.js [data-reveal].is-visible` | base |
| the reveal observer | `[data-reveal]` | `transitionDelay` | the transition timing | base |
| the counter observer | `[data-count]` | `textContent` | `.stat .stat-number` typography | sections |
| `setupScrollChrome` | `#progress-bar` | inline `width` | `.scroll-progress span` | base |
| `setupScrollChrome` | `#navbar` | `.is-hidden` | `#navbar.is-hidden` | components |
| `setupScrollChrome` | `#back-to-top` | `.is-shown` | `#back-to-top.is-shown` | components |
| `setMenuOpen` | `#menu-button` | `.is-active` | `#menu-button.is-active .menu-icon span` | components |
| `setMenuOpen` | `#mobile-menu` | `.is-open` | `#mobile-menu.is-open`, `… .menu-links a` | components |
| `setMenuOpen` | `body` | `.scroll-locked` | `body.scroll-locked` | base |
| `openProductPopup` | `.modal-media` | `--gradient-from`, `--gradient-to` | `.modal-media` background | components |
| `openProductPopup` | `.modal-media` | `.is-logo` | `.modal-media.is-logo` | components |
| `openProductPopup` | `.modal-info` | `innerHTML` | `.tag`, `.modal-description`, `.spec`, `.modal-note` | components |
| `openProductPopup` | the "View full image" button | `data-gl` | `.btn.btn-secondary` | components |
| `openProductPopup` | `#product-modal` | `.is-open` | `.modal.is-open`, `.modal.is-open .modal-box` | components |
| `openProductPopup` | `body` | `.scroll-locked` | `body.scroll-locked` | base |
| `closeProductPopup` | `#product-modal` | `.is-open` removed | `.modal` base state | components |
| `showCurrentPhoto` | `.photo-image`, `.photo-caption`, `.photo-counter`, `.photo-frame` | `src`, `alt`, `textContent`, inline `background` | `.photo-image`, `.photo-caption`, `.photo-counter` | components |
| `openPhotoViewer` | `#photo-viewer` | `.is-open` | `.photo-viewer.is-open`, `.photo-viewer.is-open .photo-frame` | components |
| `openPhotoViewer` | `body` | `.scroll-locked` | `body.scroll-locked` | base |
| `closePhotoViewer` | `#photo-viewer` | `.is-open` removed | `.photo-viewer` base state | components |
| `setupMouseEffects` | `.btn` | inline `transform` | `.btn`'s transition list includes `transform` | components |

---

## 6. The reverse index

If you want to change how something *behaves* rather than how it looks,
start here.

| CSS selector | Controlled by | File |
| --- | --- | --- |
| `.js [data-reveal].is-visible` | The scroll reveal observer | base |
| `body.scroll-locked` | `setMenuOpen` / `openProductPopup` / `openPhotoViewer` | base |
| `#navbar.is-hidden` | `setupScrollChrome` | components |
| `#menu-button.is-active …` | `setMenuOpen` | components |
| `#mobile-menu.is-open …` | `setMenuOpen` | components |
| `.image-missing img`, `.image-missing .fallback-text` | `handleBrokenImage` | components |
| `.modal.is-open`, `.modal.is-open .modal-box` | `openProductPopup` / `closeProductPopup` | components |
| `.modal-media.is-logo` | `openProductPopup` | components |
| `.product-grid .product-card.is-logo` | `buildProductTiles` | sections |
| `.photo-viewer.is-open`, `.photo-viewer.is-open .photo-frame` | `openPhotoViewer` / `closePhotoViewer` | components |
| `#back-to-top.is-shown` | `setupScrollChrome` | components |
| `.scroll-progress span` (width) | `setupScrollChrome` | base |
| `.stat .stat-number` (text) | The counter observer | sections |
| `.photo-caption`, `.photo-counter` (text) | `showCurrentPhoto` | components |

---

## 7. Worked example — clicking a product card

Everything that happens, in order, and where each step lives.

```
1. The visitor clicks a card
        │
2. The card's own listener fires                     app.js — buildProductTiles
   openProductPopup(card.dataset.id)
        │
3. Find the product in PRODUCTS                       app.js — openProductPopup
        │
4. Save document.activeElement                       app.js
   └→ so the focus can be restored on close
        │
5. Write the gradient onto .modal-media              app.js
   media.style.setProperty("--gradient-from", …)
   media.classList.toggle("is-logo", …)
        │
6. Rewrite .modal-media and .modal-info              app.js
   └→ CSS: .modal-media img, .modal-description, .spec, .tag
        │
7. productModal.classList.add("is-open")             app.js
   │  └→ CSS: .modal { visibility:hidden; opacity:0 }        components.css
   │  └→ CSS: .modal.is-open { visibility:visible; opacity:1 }
   │  └→ CSS: .modal.is-open .modal-box { transform:none }
        │
8. Set inline visibility, aria-hidden="false",       app.js
   lock the body, focus the close button
   │  └→ CSS: body.scroll-locked { overflow:hidden }        base.css
        │
9. From here the global keydown handler owns         app.js — setupKeyboardControls
   Escape (close) and Tab (trapped)
```

**Closing** runs `closeProductPopup`: restore the focus to
`productPopupPreviouslyFocused`, remove `.is-open`, clear the inline
`visibility`, set `aria-hidden="true"`, remove `.scroll-locked` from the
body. The CSS then plays the reverse transition — the opacity goes back to 0
over .35s, and `visibility` hides the overlay afterwards because of the
`visibility 0s linear .35s` delay in the transition list.

---

## 8. Worked example — scrolling

`setupScrollChrome` is the only scroll handler, and it does three
independent things in one pass:

```
scroll event (passive)                                app.js
        │  rAF-throttled by the waitingForFrame flag
        ▼
setupScrollChrome()
   │
   ├─ #progress-bar.style.width = "%"                app.js
   │     └→ CSS: .scroll-progress span { width:0; background:linear-gradient(gold→accent) }  base.css
   │
   ├─ #navbar.classList.toggle("is-hidden", y>220 && y>lastY)   app.js
   │     └→ CSS: #navbar.is-hidden { transform:translateY(-140%) }  components.css
   │
   └─ #back-to-top.classList.toggle("is-shown", y>600)  app.js
         └→ CSS: #back-to-top { opacity:0; translate:0 14px; pointer-events:none }
         └→ CSS: #back-to-top.is-shown { opacity:1; translate:0 0; pointer-events:auto }
```

`y > lastY` means "the visitor is scrolling **down**" — so the header hides
on the way down and comes back the moment they scroll up.

---

## 9. Gotchas

Things that will trip you up if you do not know the pattern.

### The fallback letters live in an unexpected place

`.fallback-text` and `.image-missing` are declared in `components.css`, but
they are used by the banner (`sections.css`), the product cards
(`sections.css`) and the popup (`components.css`). They are shared
components, so they belong with the shared parts.

### `handleBrokenImage` targets the **parent**, not the image

```js
image.parentElement.classList.add("image-missing");
```

So the CSS is written as `.image-missing img` and
`.image-missing .fallback-text` — never `.img.image-missing`. The parent
differs per context: `.product-card` for a card, `.modal-media` for the
popup, `.banner-image` for the banner.

### `body.scroll-locked` is added by three different features

The menu, the popup and the viewer all lock the body, and each removes it
when it closes. They cannot open at the same time — the popup's "View full
image" button closes the popup first — so there is no counter to maintain.
If you ever let two overlays overlap, you need a counter, not a boolean.

### The product grid has no markup

`#product-grid` is empty in `index.html`; JavaScript fills it. The
`<noscript>` note next to it is the only fallback. Any CSS you write for
`.product-card` will never appear without JavaScript.

### Custom properties inherit

`--gradient-from` and `--gradient-to` are set on the card and on
`.modal-media`. They inherit into descendants, so if you set them on a
container, every child inherits the same gradient unless it overrides them.

### `data-delay` is a *time*, not a class

`data-delay="90"` becomes `style.transitionDelay = "90ms"`. It is not a CSS
selector; you cannot target it from the stylesheet.

### The `.js` class exists so nothing hides without JavaScript

`.js [data-reveal] { opacity:0 }` means that if `app.js` never loads, the
inline `<script>` in `<head>` still added `.js` — so content *would* stay
hidden. The guard works the other way round: the inline script adds `.js`
only when JavaScript runs, so a browser without it never applies the hidden
state. Do not remove that inline script.

### Reduced motion is enforced twice

Once in CSS (`responsive.css` — it kills all durations), once in JS (the
`userPrefersLessMotion` flag — it skips the counter animation, the smooth
scroll and the whole mouse-effects block). A new animation has to respect
both.

### The focus restore uses two separate variables

`productPopupPreviouslyFocused` and `photoViewerPreviouslyFocused` restore
focus to different things: the popup returns to the product card, the viewer
returns to the card as well (because the popup was closed before the viewer
opened). They must not share a name.

---

## 10. Checklist for adding a new visual state

1. Decide the state name: a class like `.is-open`, `.is-active`, `.is-done`.
2. Add the CSS rule in the stylesheet that owns the element
   (`styles/components.css` or `styles/sections.css`), using tokens only.
3. Add the class from JavaScript with `classList.add` / `classList.toggle`.
4. If the state needs a value (a colour, a number, a position), use a custom
   property: `el.style.setProperty("--x", value)` and read it with
   `var(--x)`.
5. Document it in §2 (state classes) and §5 (effect table) of this file, and
   in the selector index of [`CSS-GUIDE.md`](./CSS-GUIDE.md).
