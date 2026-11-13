# Beginner's Guide — Zm's Manna Bakeshop

Everything you need to read, change and present this project. Written for
someone who has just met HTML, CSS and JavaScript.

---

## 1. What this project is

A website for a small bakery in Valencia City, Bukidnon. It is a **static
site**: there is no build step, no framework, no package manager, and nothing
to install. Three things do all the work.

| File | What it does | How big |
| --- | --- | --- |
| `index.html` | The whole page. Every section, the popup and the photo viewer. | one long file |
| `styles/` | Five stylesheets that decide how it looks. | 598 lines total |
| `app.js` | The behaviour: the product cards, the popup, the menu, the scroll effects. | 612 lines |

### Opening it

Double-click `index.html` and it opens in your browser. Or serve the folder,
which is closer to how it runs on a real server:

```bash
python3 -m http.server 8899
```

Then visit <http://localhost:8899>.

### The one idea that makes the project click

**CSS owns the look, JavaScript owns the state, and they talk through class
names and CSS custom properties.**

JavaScript never makes a design decision — it never picks a colour, a size or
a shadow. It changes *state* — it adds a class name to an element, or sets a
CSS variable — and the stylesheet reacts. (There are seven documented
exceptions where JavaScript writes a measured value inline, such as the
scrolling progress bar's width; they are listed in
[`JS-CSS-BRIDGE.md` §4](JS-CSS-BRIDGE.md#4-inline-styles-written-from-js).)

For example, to open the product popup, JavaScript adds one class:

```js
productModal.classList.add("is-open");
```

and the stylesheet does the rest:

```css
.modal.is-open{visibility:visible;opacity:1;transition:opacity .35s,visibility 0s}
```

That is the whole idea. If you understand it, you understand how the page
works. It is written up in full in [`JS-CSS-BRIDGE.md`](./JS-CSS-BRIDGE.md).

---

## 2. How to find the CSS for any element

You will want to change something. Here is the path, every time.

**Step 1 — find the element in `index.html`** and write down its classes.

```html
<button class="product-card" data-id="biscocho" data-reveal>
```

**Step 2 — grep for one of those classes.**

```bash
grep -n "product-card" styles/*.css
```

```
styles/sections.css:12:   Products   #products  .product-grid  .product-card  .product-caption
styles/sections.css:183:.product-card{position:relative;aspect-ratio:4/3;border-radius:var(--card-radius);...
styles/sections.css:186:.product-card:hover{transform:translateY(-0.375rem);box-shadow:var(--shadow)}
styles/sections.css:187:.product-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
...
```

**Step 3 — the file it appears in tells you the section.**

| File | Owns |
| --- | --- |
| `styles/theme.css` | The design tokens — every colour, font and shadow |
| `styles/base.css` | The reset, the typography, `.container`, `.section`, the reveal system |
| `styles/components.css` | The parts used more than once: buttons, the header, the popup, the footer |
| `styles/sections.css` | This particular page: banner, ticker, story, products, craft, freshness, visit |
| `styles/responsive.css` | Every breakpoint, plus reduced motion |

**Step 4 — if no rule turns up, look in `base.css` and `components.css` first.**
Those hold the rules that everything shares. And if the class is in the markup
but has no rule at all, it is either a bug or a class that was never needed.

---

## 3. CSS units — what each one means

The project uses one rule, and you can state it in one sentence:

> **`rem` for anything that measures a size. `px` only for hairlines and for
> the pill shape. `%` for anything relative to its parent.**

| Unit | What it is relative to | When to use it | Example here |
| --- | --- | --- | --- |
| `px` | Nothing — a fixed number of pixels on the screen | Hairlines (`border:1px`) and the pill radius (`999px`) | `border:1px solid var(--color-border)` |
| `rem` | The root `<html>` font size (16px by default) | Font sizes, spacing, widths, heights, shadows, ordinary radii | `padding:1.6rem 1.4rem` |
| `em` | The font size of the element itself | Letter spacing, and anything that should scale with the text | `letter-spacing:.22em` |
| `%` | The size of the parent element | Widths and heights that should fill their box | `width:92%` |
| `vw` | 1% of the viewport width | Fluid type and spacing | `font-size:clamp(1.6rem,3.6vw,2.6rem)` |
| `vh` | 1% of the viewport height | Full-height boxes | `max-height:90vh` on the popup |
| `svh` | The *smallest* viewport height (the safe area on a phone) | Full-height sections on phones | not used here |
| `ch` | The width of the "0" character | Capping the length of a line of text | `max-width:56ch` |
| `fr` | A share of the leftover space in a grid | Grid column widths | `grid-template-columns:1.15fr .85fr` |
| `deg` | A full turn is 360° | Rotation | `rotate(45deg)` |
| `ms` / `s` | Time | How long an animation takes | `transition:opacity .35s` |

### Why `rem` and not `px`

`1rem` is `16px` at the browser default, so switching from `px` to `rem`
changes **nothing** on screen for somebody who has not changed their font
size. But if a visitor has set their browser font size to 20px, every `rem`
value scales with it — the whole design gets bigger with them, and stays
readable. That is worth a sentence in a presentation.

The `px` exceptions are deliberate:

- **Hairlines.** A border should stay one pixel thin. If it scaled with the
  font size a 3px border would become a 4px border, and the design would
  drift.
- **The pill radius.** `border-radius:999px` is not a measurement — it means
  "round it completely", and it has to stay bigger than the button however
  big the button gets.

### Media queries keep `px`

```css
@media (max-width:1024px){ ... }
```

Breakpoints are device widths, not font sizes. They stay in `px`.

---

## 4. CSS properties this project uses

| Property | What it does | Where it appears here |
| --- | --- | --- |
| `clamp(min, preferred, max)` | Picks a value between two ends — smaller on small screens, larger on big ones | `font-size:clamp(1.6rem,3.6vw,2.6rem)` |
| `min()` | The smaller of two values | `width:min(73.75rem,92%)` |
| `max()` | The larger of two values | `max-width:100%` on the photo frame |
| `var(--name)` | Reads a custom property | `color:var(--color-ink)` |
| `color-mix()` | Mixes two colours | The frosted brand pill |
| `backdrop-filter: blur()` | Blurs what is behind an element | The brand pill, the popup scrim |
| `aspect-ratio` | Forces a shape without padding tricks | `aspect-ratio:4/3` on the cards |
| `inset` | Sets top, right, bottom and left at once | `inset:0` to stretch an image over its box |
| `gap` | Space between grid or flex children | `gap:1.4rem` |
| `translate` / `rotate` | Moving and turning, separate from `transform` | `translate:0 0.875rem`, `rotate:90deg` |
| `grid-template-columns` | How the columns of a grid are sized | `repeat(3,1fr)` |
| `:focus-visible` | Styles the focus ring only when the keyboard is being used | The accessibility focus ring |
| `prefers-reduced-motion` | Asks whether the visitor wants less animation | The reduced-motion block |
| `z-index` | The stacking order of overlapping elements | The scrims sit above the page |

---

## 5. JavaScript vocabulary

| Word | What it means | Where it appears here |
| --- | --- | --- |
| `querySelector` | Finds the first element matching a CSS selector | `findElement("#product-modal")` |
| `querySelectorAll` | Finds every element matching a selector | `findElements(".product-card")` |
| `classList` | Adds and removes class names | `modal.classList.add("is-open")` |
| `dataset` | Reads the `data-` attributes of an element | `card.dataset.id` |
| `addEventListener` | Runs a function when something happens | `card.addEventListener("click", …)` |
| `closest` | Walks up from an element to find a match | `event.target.closest("[data-gl]")` |
| `setAttribute` | Sets an HTML attribute | `modal.setAttribute("aria-hidden","true")` |
| `textContent` | The text inside an element | `caption.textContent = photo.cap` |
| `innerHTML` | Replacing the markup inside an element | Building the product cards |
| `focus()` | Moves the keyboard focus | `closeButton.focus()` |
| `preventDefault()` | Stops the browser's default action | Stopping Tab from leaving the popup |
| `matchMedia` | Asks the browser a question about the device | `matchMedia("(prefers-reduced-motion: reduce)")` |
| `IntersectionObserver` | Watches when an element scrolls into view | The reveal-on-scroll effect |
| `requestAnimationFrame` | Runs a function on the next screen frame | The scrolling progress bar, the counters |
| `setProperty` | Sets a CSS custom property from JavaScript | `media.style.setProperty("--gradient-from", …)` |
| `aria-*` | Attributes that tell a screen reader what something is | `aria-hidden`, `aria-label`, `aria-expanded` |
| `defer` | Loads a script after the page has been read | `<script src="app.js" defer>` |

---

## 6. The naming rules

Six rules. Every class and id in this project follows them.

**1. Plain words, no design jargon.** A reader should never have to look a
name up.

| Jargon you meet in a design tool | What we call it here |
| --- | --- |
| hero, intro | **banner** — the big block at the top of the page |
| marquee | **ticker** — a strip of text that scrolls sideways, like a news ticker |
| tile | **card** |
| solid button / ghost button | **primary button** / **secondary button** |
| chip, pill, badge | **tag** — a small label |
| monogram | **fallback text** — the letters shown when a photo is missing |
| lightbox | **photo viewer** — the overlay that shows a big photo |
| eyebrow, kicker | **section label** — the small line above a heading |
| grain | **noise overlay** |

**2. Kebab-case.** Lowercase words joined by hyphens.

```css
.product-card  .section-header  .visit-card  .btn-primary
```

**3. A state class always starts with `is-`.** These are the classes
JavaScript adds and removes.

```css
.is-visible   .is-open   .is-active   .is-hidden   .is-shown
.is-logo      .is-contained
```

`.is-logo` and `.is-contained` are not "states" in the on/off sense — they
say what the element *is* — but they follow the same rule, so there is only
one thing to remember.

**4. A class name says what the element IS, not what it looks like.**
`.product-card`, never `.shadow-box`.

**5. Ids are only used for elements JavaScript needs to find**, and are always
kebab-case: `#product-modal`, `#photo-viewer`, `#menu-button`, `#year`.

**6. Files are named for what they contain**, never numbered. The load order
lives in `index.html`, where it belongs:

```html
<link rel="stylesheet" href="styles/theme.css">
<link rel="stylesheet" href="styles/base.css">
<link rel="stylesheet" href="styles/components.css">
<link rel="stylesheet" href="styles/sections.css">
<link rel="stylesheet" href="styles/responsive.css">
```

> **A note on BEM.** You may meet a stricter version of rule 2 in industry,
> called BEM: `block__element--modifier`, like
> `.product-card__caption--wide`. It is the same idea taken further. It is not
> needed here, and the extra punctuation makes the code harder to read for a
> beginner.

---

## 7. The old names, in case you saw them before

This project was renamed so the names would be readable. If you are following
an older copy of the code, this is the map.

| What | Old | New |
| --- | --- | --- |
| `.class` | `eyebrow` | `section-label` |
| `.class` | `sec-head` | `section-header` |
| `.class` | `sec-sub` | `section-subtitle` |
| `.class` | `sr-only` | `screen-reader-only` |
| `.class` | `skip` | `skip-link` |
| `.class` | `grain` | `noise-overlay` |
| `.class` | `progress` | `scroll-progress` |
| `.class` | `arr` | `btn-arrow` |
| `.class` | `solid` | `btn-primary` |
| `.class` | `ghost` | `btn-secondary` |
| `.class` | `chip` | `tag` |
| `.class` | `mono` | `fallback-text` |
| `.class` | `no-img` | `image-missing` |
| `.class` | `brand-mark` | `brand-logo` |
| `.class` | `menu-word` | `menu-button-text` |
| `.class` | `burger-lines` | `menu-icon` |
| `.class` | `mm-links` | `menu-links` |
| `.class` | `mm-bottom` | `menu-footer` |
| `.class` | `mm-foot` | `menu-footer-text` |
| `.class` | `intro` | `banner` |
| `.class` | `intro-photo` | `banner-image` |
| `.class` | `hero-photo` | `banner-image` |
| `.class` | `intro-panel` | `banner-text` |
| `.class` | `intro-logo` | `banner-logo` |
| `.class` | `intro-copy` | `banner-copy` |
| `.class` | `intro-title` | `banner-title` |
| `.class` | `intro-tag` | `banner-tagline` |
| `.class` | `intro-desc` | `banner-description` |
| `.class` | `intro-cta` | `banner-buttons` |
| `.class` | `intro-meta` | `banner-details` |
| `.class` | `intro-caption` | `banner-caption` |
| `.class` | `marquee` | `ticker` |
| `.class` | `marquee-track` | `ticker-track` |
| `.class` | `m-item` | `ticker-item` |
| `.class` | `m-star` | `ticker-star` |
| `.class` | `num` | `stat-number` |
| `.class` | `lbl` | `stat-label` |
| `.class` | `modal-desc` | `modal-description` |
| `.class` | `grid-gallery` | `product-grid` |
| `.class` | `g-item` | `product-card` |
| `.class` | `g-cap` | `product-caption` |
| `.class` | `step-num` | `step-number` |
| `.class` | `tiles` | `feature-list` |
| `.class` | `tile` | `feature-card` |
| `.class` | `tile-icon` | `feature-icon` |
| `.class` | `v-cards` | `visit-cards` |
| `.class` | `v-card` | `visit-card` |
| `.class` | `v-label` | `visit-label` |
| `.class` | `v-value` | `visit-value` |
| `.class` | `v-sub` | `visit-detail` |
| `.class` | `map-wrap` | `map-wrapper` |
| `.class` | `lightbox` | `photo-viewer` |
| `.class` | `lb-stage` | `photo-frame` |
| `.class` | `lb-img` | `photo-image` |
| `.class` | `lb-bar` | `photo-bar` |
| `.class` | `lb-cap` | `photo-caption` |
| `.class` | `lb-count` | `photo-counter` |
| `.class` | `lb-close` | `photo-close` |
| `.class` | `lb-prev` | `photo-prev` |
| `.class` | `lb-next` | `photo-next` |
| `.class` | `f-grid` | `footer-grid` |
| `.class` | `f-brand` | `footer-brand` |
| `.class` | `f-col` | `footer-column` |
| `.class` | `f-bottom` | `footer-bottom` |
| `.class` | `f-mark` | `footer-star` |
| `.class` | `in` | `is-visible` |
| `.class` | `open` | `is-open` |
| `.class` | `active` | `is-active` |
| `.class` | `hide` | `is-hidden` |
| `.class` | `show` | `is-shown` |
| `.class` | `lock` | `scroll-locked` |
| `.class` | `contain` | `is-contained` |
| `.class` | `light` | *(removed)* |
| `.class` | `is-product` | *(removed)* |
| `#id` | `burger` | `menu-button` |
| `#id` | `toTop` | `back-to-top` |
| `#id` | `mobileMenu` | `mobile-menu` |
| `#id` | `productModal` | `product-modal` |
| `#id` | `productGrid` | `product-grid` |
| `#id` | `lightbox` | `photo-viewer` |
| `#id` | `progressBar` | `progress-bar` |
| `#id` | `modalTitle` | `modal-title` |
| `token` | `--bg` | `--color-background` |
| `token` | `--surface` | `--color-surface` |
| `token` | `--surface2` | `--color-surface-alt` |
| `token` | `--ink` | `--color-ink` |
| `token` | `--heading` | `--color-heading` |
| `token` | `--muted` | `--color-muted` |
| `token` | `--line` | `--color-border` |
| `token` | `--gold` | `--color-gold` |
| `token` | `--gold-dark` | `--color-gold-dark` |
| `token` | `--gold-soft` | `--color-gold-soft` |
| `token` | `--accent-text` | `--color-accent` |
| `token` | `--accent-soft` | `--color-accent-soft` |
| `token` | `--shadow-sm` | `--shadow-small` |
| `token` | `--r` | `--card-radius` |
| `token` | `--nav-h` | `--header-height` |
| `token` | `--serif` | `--font-heading` |
| `token` | `--sans` | `--font-body` |
| `token` | `--g1` | `--gradient-from` |
| `token` | `--g2` | `--gradient-to` |

One data field changed too, in `app.js`: the product record’s `mono` is now
`letters`, because “monogram” is not a word most people use.

---

## 8. Walkthrough — clicking a product card opens the popup

One feature, start to finish. This is the pattern every other feature
follows.

**1. The markup.** `index.html` has an empty box where the cards go:

```html
<div class="product-grid" id="product-grid"></div>
```

There is no markup for the six products, because the products live in the
data — and the data can change without touching the markup.

**2. The data.** `app.js` holds one record per product:

```js
{ id:"biscocho", name:"Biscocho", img:"assets/Biscocho.webp",
  gradientFrom:"#D9A05B", gradientTo:"#8C4A1F", letters:"B", … }
```

**3. Building the cards.** `buildProductTiles()` turns each record into a
button and puts them in the box:

```js
<button class="product-card" data-id="biscocho" data-reveal
        style="--gradient-from:#D9A05B;--gradient-to:#8C4A1F">
  <span class="fallback-text">B</span>
  <img src="assets/Biscocho.webp" alt="Biscocho">
  <span class="product-caption">Biscocho</span>
</button>
```

Notice the two custom properties in the `style` attribute. The card's
background gradient comes straight from the data, and the stylesheet stays
generic:

```css
.product-card{…background:linear-gradient(140deg,var(--gradient-from,#D9A05B),
                                             var(--gradient-to,#8C4A1F))}
```

**4. The click.** Each card gets its own listener as it is created:

```js
card.addEventListener("click", function () {
  openProductPopup(card.dataset.id);
});
```

**5. Opening the popup.** `openProductPopup()` finds the product, fills in
the popup, and adds one class:

```js
productModal.classList.add("is-open");
```

**6. The CSS reacts.** Three rules in `styles/components.css`:

```css
.modal{…visibility:hidden;opacity:0;transition:opacity .35s,visibility 0s linear .35s}
.modal.is-open{visibility:visible;opacity:1;transition:opacity .35s,visibility 0s}
.modal.is-open .modal-box{transform:none}
```

The `.modal-box` rule slides the box up into place as it fades in.

**7. Closing it.** `closeProductPopup()` removes the class and puts the
keyboard focus back where it came from:

```js
if (productPopupPreviouslyFocused) productPopupPreviouslyFocused.focus();
productModal.classList.remove("is-open");
```

**8. The keyboard.** `setupKeyboardControls()` listens for Escape and closes
whatever is open, in priority order: the photo viewer, then the popup, then
the menu.

That is the whole pattern. **Change a class, and the stylesheet reacts.**

---

## 9. Talking points for presenting this to reviewers

Each one is a claim you can back up by opening the file.

**There is no build step and no dependencies.** Open `index.html` and it runs.
Nothing to install, nothing to compile, nothing to break.

**The design system is one file.** Every colour, font, radius and shadow is a
custom property in `styles/theme.css`. Re-theming the site means editing that
file and nothing else.

**The layout is fluid.** `clamp()` and `min()` do the work, so there are only
three width breakpoints and none of them above 1024px, plus one height
breakpoint for the popup on short windows. No phone-specific patches.

**Sizes use `rem`, so the design scales with the visitor's font size.**
One rule, stated in a sentence, applied everywhere.

**The accessibility basics are in place.** A skip link, a focus trap in the
popup, focus returned to where it came from, `aria-*` attributes on the
dialogs, a visible focus ring, and a full `prefers-reduced-motion` path.
(A formal audit has not been carried out.)

**It is progressively enhanced.** Every section is readable with JavaScript
switched off. Only the product grid needs JavaScript, and it says so in a
`<noscript>` note.

**It is fast.** The scroll handler is passive and throttled to one frame,
reveals and counters use `IntersectionObserver` instead of scroll events,
and images below the fold are lazy-loaded.

**The code is documented as you read it.** Each stylesheet opens with an
index of what it contains, and every function says what it looks for and
what it changes on screen.

---

## 10. Common tasks

| I want to… | Do this |
| --- | --- |
| Change a colour | `styles/theme.css` — change the `--color-*` value |
| Change a font | `styles/theme.css` for the family, `index.html` for the Google Fonts link |
| Change the spacing between sections | `styles/base.css` — `.section` |
| Add a button style | `styles/components.css` — next to `.btn-primary` |
| Edit a product | `app.js` — the `PRODUCTS` array |
| Edit the photo viewer photos | `app.js` — the `PHOTOS` array |
| Change the Facebook link | `app.js` — `SITE_CONFIG.facebook` |
| Change the hours or address | `index.html` — the visit section **and** the footer; keep them in sync |
| Add a section | New file in `styles/`, a `<link>` in `index.html`, and the markup in `index.html` |
| Change where the page breaks | `styles/responsive.css` |
