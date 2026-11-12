# JS ↔ CSS Bridge — Zm's Manna Bakeshop

**How a line of JavaScript ends up changing something you can see.**

This is the answer to "how do the JS functions relate to the CSS?".

Related: [`JS-GUIDE.md`](./JS-GUIDE.md) · [`CSS-GUIDE.md`](./CSS-GUIDE.md)

---

## 1. The contract in one paragraph

JavaScript in this project **never styles anything directly**. It does not
set a `color`, a `width`, a `padding`, or an `opacity`. What it does is
write *state* — a class name, a data attribute, or a CSS custom property —
and the stylesheet reacts to that state. So there are exactly four channels:

| Channel | JS writes | CSS reads |
| --- | --- | --- |
| **State class** | `el.classList.add("open")` | `.modal.open { … }` |
| **Custom property** | `el.style.setProperty("--g1", "#D9A05B")` | `background:linear-gradient(…, var(--g1), var(--g2))` |
| **Inline style (exceptional)** | `el.style.width = "42%"`, `el.style.transform = "…"` | inline style wins the cascade |
| **Text content** | `el.textContent = "3 / 6"` | `content` is not CSS, but the element's typography is |

Everything else — colour, spacing, radius, shadow, easing, breakpoints —
lives in `styles/`.

### The three laws

1. **JS owns state, CSS owns appearance.** If you are about to write
   `el.style.background = "gold"` in JS, stop: add a class and write the rule
   in CSS instead.
2. **Every state class needs a CSS rule**, and every state class should be
   listed in this document. If you add one, add it to the table below.
3. **CSS never invents behaviour.** CSS can animate and transition, but it
   cannot decide *when* — that is always JS's job.

---

## 2. State classes

The complete list of classes that JavaScript adds or removes at runtime, and
the CSS that gives them meaning.

| Class | Added / removed by | CSS rule | File | What you see |
| --- | --- | --- | --- | --- |
| `.in` | Scroll reveal observer (`app.js` 100) | `.js [data-reveal].in` | 01 | Element rises 28px and fades in |
| `.lock` | `setMenu` (157), `openModal` (202), `closeModal` (210), `openLightbox` (235), `closeLb` (243) | `body.lock` | 01 | Page scroll freezes behind the overlay |
| `.active` | `setMenu` (152) | `#burger.active .burger-lines span` | 03 | The three burger bars fold into an X |
| `.open` | `setMenu` (154), `openModal` (199), `closeModal` (207), `openLightbox` (232), `closeLb` (241) | `#mobileMenu.open`, `.modal.open`, `.lightbox.open` | 03, 08, 12 | Overlay fades in; its `.modal-box` / `.lb-stage` scales up |
| `.no-img` | `bindFallback` (78) | `.no-img img`, `.no-img .mono` | 05 | Broken photo is replaced by the serif monogram |
| `.is-logo` | `openModal` (182), grid template (86) | `.modal-media.is-logo`, `.grid-gallery .g-item.is-logo` | 08, 12 | Flat cream card instead of a gradient; navy caption with a hairline |
| `.show` | `onScroll` (131) | `#toTop.show` | 13 | The back-to-top button fades and slides in |
| `.hide` | `onScroll` (129) | `#navbar.hide` | 03 | The nav pill slides off the top while scrolling down |
| `.scrolled` | `onScroll` (128) | — | — | **No CSS rule.** Leftover hook. |

Two more classes exist in CSS but are **not** written by JS — they come from
the HTML and simply *enable* a state:

| Class | Where it comes from | CSS rule | File |
| --- | --- | --- | --- |
| `.js` | inline `<script>` in `index.html` `<head>` (line 21) | `.js [data-reveal]` | 01 |
| `.is-product` | `<div class="grid-gallery is-product" id="productGrid">` | `.grid-gallery.is-product .g-cap` | 12 |

---

## 3. Custom properties written from JS

| Property | Written by | Value | Read by | Effect |
| --- | --- | --- | --- | --- |
| `--g1` | grid template (87), `openModal` (181) | hex colour | `.g-item` background, `.modal-media` background | Gradient start |
| `--g2` | grid template (87), `openModal` (181) | hex colour | same | Gradient end |
| `--mx` | hero parallax loop (295) | float `−0.5…0.5` | `.layer` transform | Horizontal parallax (currently dead — no `#heroVisual`) |
| `--my` | hero parallax loop (296) | float `−0.5…0.5` | `.layer` transform | Vertical parallax (currently dead) |
| `--depth` | CSS only | fixed number | `.layer` transform | How far each layer moves relative to the others |

Note that `--g1` / `--g2` are the *only* custom properties that carry data
into CSS. Everything else is a design token.

---

## 4. Inline styles written from JS

These bypass the cascade, so they are worth knowing about. Every one of them
is a measurement, a position, or a transition override — never a design
decision.

| Written by | Property | Why inline |
| --- | --- | --- |
| `onScroll` (127) | `#progressBar` `width` | A live percentage that changes every frame |
| Scroll reveal (102) | `transitionDelay` | Read from `data-delay`; per-element timing |
| `openModal` (181) / `closeModal` (208) | `.modal` `visibility` | Puts the overlay in/out of the focus order *instantly*, while CSS fades it over .35s |
| `openLightbox` (233) / `closeLb` (244) | `.lightbox` `visibility` | Same trick |
| `setMenu` (155) | `#mobileMenu` `visibility` | Same trick |
| `updateLb` (227) | `.lb-stage` `background` | The gradient is built per-photo from `g1`/`g2` and written as a whole `linear-gradient` |
| Tilt (273–274) | `transition`, `transform` | Per-frame 3D transform during pointer movement |
| Magnetic button (281) | `transform` | Per-frame position tracking |

The `visibility` trick deserves a note, because it looks redundant. CSS
already has `.modal.open { visibility:visible }`. But CSS transitions
`visibility` with a 0.35s delay, so without the inline override the modal's
buttons would stay in the tab order for a third of a second *after* the
overlay closed, and the first `.focus()` call would land on an element the
browser still considered hidden. JS sets it inline to make focus land on the
first paint.

---

## 5. Effect table — the direct answer

Every JS function, and the CSS it drives.

| JS function | Line | DOM it touches | Class / property written | CSS that reacts | File |
| --- | --- | --- | --- | --- | --- |
| `bindFallback` | 77 | any `img` | `.no-img` on the parent | `.no-img img`, `.no-img .mono` | 05 |
| *(grid render)* | 85 | `#productGrid` | inline `--g1`, `--g2` | `.g-item` background gradient | 12 |
| *(grid render)* | 86 | each tile | `data-reveal`, `data-delay` | `.js [data-reveal]` | 01 |
| *(grid render)* | 89 | each tile img | `class="contain"` | `.g-item img.contain` | 12 |
| *(grid render)* | 86 | Otap tile | `.is-logo` | `.g-item.is-logo` | 12 |
| *(grid render)* | 96 | `[data-fb]` | `href` | — (link target, not style) | — |
| *(scroll reveal)* | 100 | `[data-reveal]` | `.in` | `.js [data-reveal].in` | 01 |
| *(scroll reveal)* | 102 | `[data-reveal]` | `transitionDelay` | transition timing | 01 |
| *(counters)* | 114 | `[data-count]` | `textContent` | `.stat .num` typography | 06 |
| `onScroll` | 127 | `#progressBar` | inline `width` | `.progress span` | 01 |
| `onScroll` | 128 | `#navbar` | `.scrolled` | *(none)* | — |
| `onScroll` | 129 | `#navbar` | `.hide` | `#navbar.hide` | 03 |
| `onScroll` | 131 | `#toTop` | `.show` | `#toTop.show` | 13 |
| *(scroll spy)* | 142 | `.nav-link` | `.active` | *(none — no nav links exist)* | — |
| `setMenu` | 152 | `#burger` | `.active` | `#burger.active .burger-lines span` | 03 |
| `setMenu` | 153 | `#burger` | `aria-expanded` | — (accessibility) | — |
| `setMenu` | 154 | `#mobileMenu` | `.open` | `#mobileMenu.open`, `#mobileMenu.open .mm-links a` | 03 |
| `setMenu` | 155 | `#mobileMenu` | inline `visibility` | transition coordination | 03 |
| `setMenu` | 157 | `body` | `.lock` | `body.lock` | 01 |
| `openModal` | 181 | `.modal-media` | `--g1`, `--g2` | `.modal-media` background | 08 |
| `openModal` | 182 | `.modal-media` | `.is-logo` | `.modal-media.is-logo` | 08 |
| `openModal` | 186 | `.modal-info` | innerHTML | `.chip`, `.modal-desc`, `.spec`, `.modal-note` | 08, 02 |
| `openModal` | 198 | "View full image" btn | `data-gl` | `.btn.ghost` | 02 |
| `openModal` | 199 | `#productModal` | `.open` | `.modal.open`, `.modal.open .modal-box` | 08 |
| `openModal` | 200 | `#productModal` | inline `visibility` | transition coordination | 08 |
| `openModal` | 202 | `body` | `.lock` | `body.lock` | 01 |
| `closeModal` | 207 | `#productModal` | `.open` removed | `.modal` base state | 08 |
| `updateLb` | 224–227 | `.lb-img`, `.lb-cap`, `.lb-count`, `.lb-stage` | `src`, `alt`, `textContent`, inline `background` | `.lb-img`, `.lb-cap`, `.lb-count` | 12 |
| `openLightbox` | 232 | `#lightbox` | `.open` | `.lightbox.open`, `.lightbox.open .lb-stage` | 12 |
| `openLightbox` | 233 | `#lightbox` | inline `visibility` | transition coordination | 12 |
| `openLightbox` | 235 | `body` | `.lock` | `body.lock` | 01 |
| `closeLb` | 241 | `#lightbox` | `.open` removed | `.lightbox` base state | 12 |
| *(tilt)* | 273–274 | `.tilt` | inline `transform` | *(dead — no `.tilt` elements)* | — |
| *(magnetic)* | 281 | `.btn` | inline `transform` | `.btn` transition list includes `transform` | 02 |
| *(parallax)* | 295–296 | `#heroVisual` | `--mx`, `--my` | `.layer` transform | 05 |

---

## 6. Reverse index — CSS selector → what controls it

If you want to change how something behaves (not how it looks), start here.

| CSS selector | Controlled by | File |
| --- | --- | --- |
| `.js [data-reveal].in` | Scroll reveal observer | 01 |
| `body.lock` | `setMenu` / `openModal` / `openLightbox` | 01 |
| `#navbar.hide` | `onScroll` | 03 |
| `#burger.active …` | `setMenu` | 03 |
| `#mobileMenu.open …` | `setMenu` | 03 |
| `.no-img img`, `.no-img .mono` | `bindFallback` | 05 |
| `.modal.open`, `.modal.open .modal-box` | `openModal` / `closeModal` | 08 |
| `.modal-media.is-logo` | `openModal` | 08 |
| `.grid-gallery .g-item.is-logo` | grid render | 12 |
| `.lightbox.open`, `.lightbox.open .lb-stage` | `openLightbox` / `closeLb` | 12 |
| `#toTop.show` | `onScroll` | 13 |
| `.progress span` (width) | `onScroll` | 01 |
| `.stat .num` (text) | counter observer | 06 |
| `.lb-cap`, `.lb-count` (text) | `updateLb` | 12 |

---

## 7. Worked example — clicking a product tile

Everything that happens, in order, and where each step lives.

```
1. User clicks the tile
        │
2. Delegated listener on #productGrid            app.js:212
   e.target.closest(".g-item") → the tile
        │
3. openModal(tile.dataset.id)                    app.js:176
        │
4. Look up the record in PRODUCTS                app.js:177
        │
5. Save document.activeElement into lastFocus     app.js:179
   └→ so focus can be restored on close
        │
6. media.style.setProperty("--g1", p.g1)          app.js:181
   media.style.setProperty("--g2", p.g2)
        │
7. media.classList.toggle("is-logo", !!p.fit)     app.js:182
        │
8. media.innerHTML = mono + <img>                app.js:183
        │  └→ CSS: .modal-media img { object-fit:cover }   08-modal.css
        │  └→ CSS: .modal-media img.contain { … }          08-modal.css
        │
9. bindFallback($("img", media))                  app.js:184
   └→ if it fails: parent gets .no-img            05-marquee.css
        │
10. GALLERY.findIndex(g => g.src === p.img)       app.js:185
        │
11. modal-info.innerHTML = chip + title + desc
        + <dl class="spec"> + note + optional
        <button class="btn ghost" data-gl="…">    app.js:186-198
        │  └→ CSS: .chip                          02-components.css
        │  └→ CSS: .modal-desc, .spec, .modal-note 08-modal.css
        │  └→ CSS: .btn.ghost                     02-components.css
        │
12. modal.classList.add("open")                  app.js:199
        │  └→ CSS: .modal { visibility:hidden; opacity:0 }   08
        │  └→ CSS: .modal.open { visibility:visible; opacity:1 } 08
        │  └→ CSS: .modal.open .modal-box { transform:none }  08
        │
13. modal.style.visibility = "visible"           app.js:200
        └→ so focus can land immediately
        │
14. modal.setAttribute("aria-hidden","false")    app.js:201
        │
15. document.body.classList.add("lock")          app.js:202
        └→ CSS: body.lock { overflow:hidden }     01-base.css
        │
16. $(".modal-close", modal).focus()             app.js:203
        │
17. From here, the global keydown handler owns
    Escape (close) and Tab (trapped)              app.js:252-265
```

**Closing** runs `closeModal` (`app.js:205`): restore focus to `lastFocus`,
remove `.open`, clear the inline `visibility`, set `aria-hidden="true"`,
remove `.lock` from the body. The CSS then plays the reverse transition
(opacity back to 0 over .35s, then `visibility` hides it because of the
`visibility 0s linear .35s` delay in the transition list).

---

## 8. Worked example — scrolling

`onScroll` (`app.js:125`) is the only scroll handler, and it does four
independent things in one pass:

```
scroll event (passive)                            app.js:134
        │  rAF-throttled by the `ticking` flag
        ▼
onScroll()                                         app.js:125
   │
   ├─ #progressBar.style.width = "%"              app.js:127
   │     └→ CSS: .progress span { width:0; background:linear-gradient(gold→accent) }  01
   │
   ├─ #navbar.classList.toggle("scrolled", y>24)  app.js:128
   │     └→ no CSS rule — hook for future use
   │
   ├─ #navbar.classList.toggle("hide", y>220 && y>lastY)   app.js:129
   │     └→ CSS: #navbar.hide { transform:translateY(-140%) }  03
   │
   └─ #toTop.classList.toggle("show", y>600)      app.js:131
         └→ CSS: #toTop { opacity:0; translate:0 14px; pointer-events:none }  13
         └→ CSS: #toTop.show { opacity:1; translate:0 0; pointer-events:auto } 13
```

`y > lastY` means "the user is scrolling **down**" — so the nav hides on the
way down and reappears the moment you scroll up.

---

## 9. Gotchas

Things that will trip you up if you don't know the pattern.

### The `.mono` fallback lives in the wrong file

`.mono` and `.no-img` are declared in **`05-marquee.css`**, but they are used
by the hero (`04-hero.css`), the product tiles (`12-gallery.css`) and the
modal (`08-modal.css`). If you ever delete "the unused marquee rules", you
will delete the image-fallback system with them.

### `visibility` is set in two places

Both CSS (`.modal.open { visibility:visible }`) and JS
(`modal.style.visibility = "visible"`). The inline value wins. The CSS rule
still matters for the **hide** direction, where the delayed
`visibility 0s linear .35s` keeps the overlay in the layout until the fade
finishes.

### `bindFallback` targets the **parent**, not the image

```js
img.parentElement.classList.add("no-img")
```

So the CSS must be written as `.no-img img` and `.no-img .mono`, never
`.img.no-img`. This matters because the parent differs per context:
`.g-item` for a tile, `.modal-media` for the modal, `.hero-photo` for the
hero.

### `body.lock` is added by three different features

Menu, modal, and lightbox all lock the body — and each removes it when it
closes. They cannot open simultaneously (the modal's "View full image"
button closes the modal first), so there is no counter to maintain. If you
ever let two overlays overlap, you need a counter, not a boolean.

### The product grid has no markup

`#productGrid` is empty in `index.html`; JavaScript fills it. The `<noscript>`
note next to it is the only fallback. Any CSS you write for `.g-item` will
never appear without JavaScript.

### Custom properties inherit

`--g1` / `--g2` are set on the tile (`.g-item`) and on `.modal-media`. They
inherit into descendants, so `.g-item img` sees them too. If you set them on
a container, every child inherits the same gradient unless it overrides them.

### `data-delay` is a *time*, not a class

`data-delay="90"` becomes `style.transitionDelay = "90ms"`. It is not a
CSS selector; you cannot target it from the stylesheet.

### The `.js` class exists so nothing hides without JavaScript

`.js [data-reveal] { opacity:0 }` means that if `app.js` never loads, the
inline `<script>` in `<head>` still added `.js` — so content *would* stay
hidden. The guard is the opposite direction: the inline script adds `.js`
only when JS runs, so a no-JS browser never applies the hidden state. Do not
remove that inline script.

### Reduced motion is enforced twice

Once in CSS (`14-responsive.css` — kills all durations), once in JS
(`reduced` flag — skips the counter animation, the smooth scroll, and the
whole pointer-effects block). A new animation must respect both.

---

## 10. Checklist for adding a new visual state

1. Decide the state name: a class like `.is-open`, `.is-active`, `.is-done`.
2. Add the CSS rule in the stylesheet that owns the element
   (`styles/NN-section.css`), using tokens only.
3. Add the class from JS with `classList.add` / `classList.toggle`.
4. If the state needs a value (a colour, a number, a position), use a custom
   property: `el.style.setProperty("--x", value)` and read it with `var(--x)`.
5. Document it in §2 (state classes) and §5 (effect table) of this file, and
   in the selector index of [`CSS-GUIDE.md`](./CSS-GUIDE.md).
