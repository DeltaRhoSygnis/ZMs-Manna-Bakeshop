# Beginner-Friendly Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Zm's Manna Bakeshop site into code a first-year IT student can read and present — plain class names, five named stylesheets, one unit policy, a plain JavaScript file, and a teaching guide.

**Architecture:** No build step, no dependencies, no framework — the site stays exactly as it is today (one `index.html`, one `app.js`, a `styles/` folder). The refactor is *only* names, file organisation, units, comments and JavaScript structure. A throwaway Node script in `/tmp` proves the rendered CSS rule set is unchanged before and after.

**Tech Stack:** Vanilla HTML, CSS, JavaScript. Node.js (already present) for the verification scripts only — nothing is added to the repo.

**Spec:** [`docs/superpowers/specs/2026-11-13-beginner-friendly-refactor-design.md`](../specs/2026-11-13-beginner-friendly-refactor-design.md)

The spec carries the full rename map. **This plan does not repeat it** — it pins the parts the spec leaves open: the verification harness, the file contents, the commands, and the order of work.

---

## Global Constraints

- **The rendered site must not change.** Only names, file organisation, units, comments and JS structure change. Spec §Constraints.
- **No new dependencies, no build step, no test framework.** The repo stays a folder you can open with a double-click.
- **`px` → `rem` only where the unit policy allows it.** `rem` for sizes; `px` only for border widths, outline widths, `outline-offset`, and the pill radius `999px`. Spec §0.6.
- **`1rem` is `16px` at browser default**, so the unit conversion is numerically identical for default users.
- **Every class name is a plain word.** No `hero`, `marquee`, `tile`, `chip`, `ghost`, `monogram`, `grain`, `eyebrow`, or `v-`/`g-`/`lb-`/`mm-` abbreviations. Spec §0.3.
- **State classes always start with `is-`.** Spec §0.5.
- **Files are named for what they contain, never numbered.** Load order lives in `index.html`. Spec §0.7.
- **`archive/legacy-2026-11-12/` is frozen.** It keeps the old names and old units on purpose and is excluded from every check.
- **`reference/hero.html` is updated** to the new names, minus its `.scroll-cue` element, whose class is being deleted.
- **Commit after every task.** The repo has a dirty working tree from before this work; commit only the paths this plan names.

---

## Review Focus

Five failure modes the spec implies but no task's checks exercise directly. Each one gets a check in the task that owns the code.

| # | Failure mode | What a reasonable person expects | Pinned by |
| --- | --- | --- | --- |
| 1 | The **products band loses its fill** — the `#products` background rule lived in the file being deleted | The products section keeps its cream band and hairline borders | Task 2, Step 8 |
| 2 | The **banner image becomes a rounded arch** — the legacy `.hero-photo` rule wins once the compound class collapses | The banner image stays square-cornered, full-bleed, no shadow | Task 2, Step 8 |
| 3 | The **product grid never appears** — `buildProductTiles()` runs after `setupScrollReveal()`, so the tiles are never observed | Six product cards render and reveal on scroll | Task 4, Step 6 |
| 4 | **Focus is lost after closing the popup** — the two focus variables merged into one, or the restore line dropped | Closing the popup returns focus to the product tile you clicked | Task 4, Step 7 |
| 5 | **`prefers-reduced-motion` is ignored** — the flag was renamed but the branches were not | With the OS setting on, reveals are visible, the ticker is stopped, counters jump | Task 4, Step 8 |

---

## File Structure

| Path | Action | Responsibility after this plan |
| --- | --- | --- |
| `index.html` | rewrite | The page. Every class and id renamed; comments per section. |
| `app.js` | rewrite | The interaction layer. Plain functions, no IIFE, heavily commented. |
| `styles/theme.css` | create | Every design token, and nothing else. |
| `styles/base.css` | create | Reset, typography, layout primitives, page overlays, reveal system. |
| `styles/components.css` | create | Reusable parts: labels, buttons, tag, fallback text, header, menu, modal, photo viewer, footer. |
| `styles/sections.css` | create | The seven page sections: banner, ticker, story, products, craft, freshness, visit. |
| `styles/responsive.css` | create | Every breakpoint, plus reduced motion. |
| `styles/00-tokens.css` … `styles/15-catalog.css` | delete | All 16 old stylesheets. |
| `reference/hero.html` | rewrite | The banner as a standalone fragment, using the new names. |
| `docs/BEGINNER-GUIDE.md` | create | The teaching document. |
| `docs/CSS-GUIDE.md` | rewrite | CSS reference, new names and file layout. |
| `docs/JS-GUIDE.md` | rewrite | JavaScript reference, new names. |
| `docs/JS-CSS-BRIDGE.md` | rewrite | How a JS function changes what you see. |
| `docs/README.md` | rewrite | Navigation hub. |
| `README.md` | rewrite | Entry point and editing cheat sheet. |
| `DESIGN.md` | rewrite | The visual system and the rules that keep it coherent. |
| `CLAUDE.md` | create | Project instructions for future agents. |
| `/tmp/zms-verify/` | create (outside the repo) | The verification harness. Never committed. |

---

### Task 1: Build the verification harness

The whole plan is judged by a script that compares the CSS rule set before and after. Build it first and prove it works before trusting it.

**Files:**
- Create: `/tmp/zms-verify/rename-map.mjs`
- Create: `/tmp/zms-verify/css-rules.mjs`
- Create: `/tmp/zms-verify/check-css.mjs`
- Create: `/tmp/zms-verify/check-html.mjs`
- Create: `/tmp/zms-verify/check-js-selectors.mjs`
- Create: `/tmp/zms-verify/check-units.mjs`
- Create: `/tmp/zms-verify/before/` (a copy of the current `styles/`, `index.html`, `app.js`)

**Interfaces:**
- Consumes: the rename map in spec §1.1–§1.14.
- Produces: `node /tmp/zms-verify/check-css.mjs`, `check-html.mjs`, `check-js-selectors.mjs`, `check-units.mjs` — each exits `0` on pass, `1` on fail, and prints a diff.

- [ ] **Step 1: Snapshot the current state**

```bash
mkdir -p /tmp/zms-verify/before
cp -r "/home/anonymous/Downloads/zm/ZM's Manna Bakeshop/styles" /tmp/zms-verify/before/styles
cp "/home/anonymous/Downloads/zm/ZM's Manna Bakeshop/index.html"   /tmp/zms-verify/before/index.html
cp "/home/anonymous/Downloads/zm/ZM's Manna Bakeshop/app.js"       /tmp/zms-verify/before/app.js
ls /tmp/zms-verify/before/styles | wc -l   # expect 16
```

- [ ] **Step 2: Write `rename-map.mjs`**

It exports four things:

```js
export const CLASS_RENAMES = { /* old class token → new class token */ };
export const ID_RENAMES    = { /* old id token → new id token */ };
export const VAR_RENAMES   = { /* old custom property → new custom property */ };
export const REMOVE_CLASSES = new Set(["light", "is-product"]);
export const DELETE_BY_FILE = { /* old file name → array of selector prefixes to drop */ };
export const DELETE_DECLARATIONS = ["--surface-blue"];
```

Every entry comes straight from spec §1.1–§1.14. Two mechanics that the spec assumes:

- **Token-wise.** A rename applies to a whole class/id/custom-property token, never to a substring. `.g-item` → `.product-card` must not touch `.grid-gallery`.
- **Both `.intro-photo` and `.hero-photo` map to `.banner-image`.** The old markup has both on the same element (`class="intro-photo hero-photo"`), so after renaming the compound is `.banner-image.banner-image` — the harness collapses repeated class tokens in one compound selector down to one.
- `DELETE_BY_FILE` uses *original* selector prefixes and is applied **before** renaming. `DELETE_BY_FILE["07-products.css"]` is everything except the `#products` rule, which is rescued into `sections.css` — so the harness must **keep** `#products` there. `DELETE_BY_FILE["15-catalog.css"]` is not needed: that file is never linked, so the harness reads only the 14 linked stylesheets for the before-set.
- `DELETE_BY_FILE["09-craft.css"] = ["#freshness"]` — a duplicate of the rule in `10-freshness.css`.
- `DELETE_BY_FILE["14-responsive.css"]` = `["grid-products", "hero-inner", "hero-visual", "nav-links", "scroll-cue", "float-chip"]`.
- `DELETE_BY_FILE["12-gallery.css"] = ["#gallery"]`.

- [ ] **Step 3: Write `css-rules.mjs` — the CSS parser**

A parser is needed because a regex cannot reliably find rule boundaries. It must handle: `@media` blocks (the rules inside them are reported with the media condition as part of the selector key), `@keyframes` blocks (reported as one entry keyed by the keyframes name), and ordinary rules.

It returns a flat list of entries:

```js
{ file, media, selector, declarations: [[property, value], ...] }
```

Two normalisations happen here:

- **Collapse whitespace** in the selector and in each value.
- **Canonicalise units.** Every `<number><unit>` token in a value is rewritten to a canonical absolute form: `rem` → `<number × 16>px`, `px` → `<number>px`, and every other unit is left alone. A bare `0` stays `0`. So `1.375rem` and `22px` both become `22px` and compare equal, and `0.0625rem` and `1px` both become `1px`. This is what lets the same check compare the before-set (px) with the after-set (rem).

- [ ] **Step 4: Write `check-css.mjs`**

Logic, in order:

1. Build the **before-set**: parse the 14 linked stylesheets from `/tmp/zms-verify/before/styles/`, drop the rules named in `DELETE_BY_FILE`, drop the declarations named in `DELETE_DECLARATIONS`, apply the renames to selectors and to `var()` names inside values, then canonicalise.
2. Build the **after-set**: parse the 5 new files from the repo's `styles/`, canonicalise, do **not** rename.
3. Compare the two as sets keyed by `media + "|" + selector`. For each key present in both, compare the sorted declaration lists. Report:
   - keys only in before → `REMOVED`
   - keys only in after → `ADDED`
   - same key, different declarations → `CHANGED`
4. Print a summary and exit `1` if any difference exists, `0` if none.

Expect `REMOVED` and `ADDED` to be empty. `CHANGED` entries must each be explained in the run output.

- [ ] **Step 5: Prove the harness is sound before trusting it**

Run the before-set against itself, with renaming disabled:

```bash
cd /tmp/zms-verify && node -e "
import('./css-rules.mjs').then(async m => {
  const { RULES } = await import('./rename-map.mjs');
  console.log('before rules parsed:', m.parseDir('./before/styles').length);
});
"
```

Expected: the parser reports a rule count greater than 100 and the before-set compared with itself produces **zero** differences. If the harness cannot agree with itself, every later result is meaningless.

- [ ] **Step 6: Write `check-html.mjs`**

Parses `index.html` into a list of `{ tag, id, classList, dataAttrs }` for every element, in document order. Then:

1. Parses the before-copy and the current `index.html`.
2. Applies the rename map to the before-copy's `id` and `class` attributes.
3. Compares the two lists element by element.

Expected: identical, except for the two deliberate HTML changes in Task 3 — the `data-fb` href and the `data-gl` attribute are untouched by renames, so the lists should match exactly. If the plan adds or removes an element, this check must be updated in the same commit.

- [ ] **Step 7: Write `check-js-selectors.mjs`**

Extracts every selector string used by `app.js` — from `querySelector`, `querySelectorAll`, `closest` and `getElementById` calls — and checks each one against:

- the elements in `index.html`, and
- the elements in the HTML that `app.js` itself generates (the product-tile template string).

Expected: every selector matches at least one element. A selector that matches nothing is reported by name, because it is the exact failure mode of a rename that missed an id.

- [ ] **Step 8: Write `check-units.mjs`**

Scans the final `styles/*.css` for `px`. Every hit must be one of:

- a border width (`border`, `border-top`, `border-bottom`, `border-block`, `border-radius: 999px`)
- an outline (`outline`, `outline-offset`)

Anything else is reported as a violation with its file and line.

- [ ] **Step 9: Run the harness against the untouched repo — every check must FAIL, for the right reason**

```bash
cd /tmp/zms-verify
node check-css.mjs          # FAIL — the repo is not refactored yet
node check-html.mjs         # FAIL — the repo is not refactored yet
node check-js-selectors.mjs # FAIL — .nav-link, .tilt and #heroVisual match nothing
node check-units.mjs        # FAIL — the five new stylesheets do not exist
```

These are the RED states the refactor turns green. If any of them passed now, the check would not be testing anything.

The three unresolved selectors are the dead code paths Task 4 removes. If the check reports any *other* selector as unresolved, the harness is wrong — fix it before starting Task 2.

- [ ] **Step 10: Commit the harness plan note**

Nothing in `/tmp` is committed. Commit nothing in this task — but write down the harness path in the plan so later tasks can find it.

---

### Task 2: Write the five stylesheets with the new names

**Files:**
- Create: `styles/theme.css`, `styles/base.css`, `styles/components.css`, `styles/sections.css`, `styles/responsive.css`
- Read only: the 16 files in `styles/`

**Interfaces:**
- Consumes: spec §1.1–§1.13 (the full rename map), spec §0.3–§0.7 (naming, units, file split).
- Produces: five stylesheets whose union of CSS rules equals the union of the 14 linked old stylesheets, minus the deliberate deletions in spec §1.8, §1.11 and §1.14.

- [ ] **Step 1: Write `styles/theme.css`**

Contains only `:root` and the custom properties, with the new names from spec §1.1. Delete `--surface-blue`. Keep the file's header comment, extended to list what a custom property is.

Values are **unchanged in this task** — the `px` → `rem` conversion is Task 5.

```css
/* =========================================================
   THEME — the design tokens
   A custom property is a variable: you set it here and use
   it anywhere with var(--name).
   ========================================================= */
:root{
  --color-background:#F8F3E8; ...
}
```

- [ ] **Step 2: Write `styles/base.css`**

From `01-base.css`. Renames per spec §1.2. **Three rules move out to `components.css`:** the `.eyebrow`/`.section-label` rules, the `.sec-head`/`.section-header` rules, and the `.sec-sub`/`.section-subtitle` rules — they are used by every section, so they are components, not base.

The file contains, in order: reset, document, element defaults, layout primitives, screen-reader and skip-link, page overlays (`.noise-overlay`, `.scroll-progress`), and the reveal system.

- [ ] **Step 3: Write `styles/components.css`**

From, in this order: `02-components.css`, then the three rules moved out of `01-base.css`, then `03-header.css`, then `08-modal.css`, then the photo-viewer half of `12-gallery.css`, then `13-footer.css`.

Renames per spec §1.3, §1.4, §1.9, §1.10.

The photo viewer is the half of `12-gallery.css` that starts at the `/* lightbox */` comment. The product-card half goes to `sections.css` in Step 4.

- [ ] **Step 4: Write `styles/sections.css`**

From, in page order: `04-hero.css`, the live half of `05-marquee.css`, `06-story.css`, `09-craft.css`, `10-freshness.css`, `11-visit.css`, the product-card half of `12-gallery.css`, and **the `#products` band rule rescued from `07-products.css`**.

Renames per spec §1.5, §1.6, §1.7, §1.10.

The legacy block in `05-marquee.css` — every `.hero*`, `.blob*`, `.hero-visual`, `.layer`, `.hero-frame`, `.hero-ring`, `.float-chip*`, `.scroll-cue*` rule, and the `floaty` / `spin` / `cue` keyframes — is **not** copied. Only the `.marquee` rules, the `.mono`/`.fallback-text` rules, and the `marquee` keyframe come across.

**`#products` band rule:** copy it from `07-products.css` line 4 into the products part of `sections.css`, renamed to the new token names. This is Review Focus item 1.

- [ ] **Step 5: Write `styles/responsive.css`**

From `14-responsive.css`, with the renames in spec §1.14 and the dead selectors deleted rather than renamed.

- [ ] **Step 6: Run the CSS equivalence check**

```bash
cd /tmp/zms-verify && node check-css.mjs
```

Expected: `REMOVED: 0`, `ADDED: 0`, `CHANGED: 0`.

If `CHANGED` is non-empty, each entry prints the property and the two values. The fix is always in the new file — the before-set is the truth.

- [ ] **Step 7: Fix any diff the check reports, then re-run until clean**

Do not proceed with a failing check. A non-empty diff here is the harness doing its job.

- [ ] **Step 8: Confirm the two risky deletions actually happened**

```bash
cd "/home/anonymous/Downloads/zm/ZM's Manna Bakeshop"
grep -c "hero" styles/sections.css          # expect 0 — no legacy hero rules survived
grep -c "banner-image" styles/sections.css  # expect >0
grep -c "#products" styles/sections.css     # expect 1 — the rescued band rule
```

The first grep is Review Focus item 2: if any `hero` rule survived into `sections.css`, the banner image will render as a rounded arch.

- [ ] **Step 9: Commit**

```bash
git add styles/theme.css styles/base.css styles/components.css styles/sections.css styles/responsive.css
git commit -m "refactor: split styles into five named files with plain class names"
```

---

### Task 3: Update the markup and retire the old stylesheets

**Files:**
- Modify: `index.html`
- Modify: `reference/hero.html`
- Delete: `styles/00-tokens.css` … `styles/15-catalog.css` (all 16)

**Interfaces:**
- Consumes: the five new stylesheets from Task 2; spec §1.14 (id renames), spec §3.3 (`reference/hero.html`).
- Produces: `index.html` whose every class and id matches the new stylesheets, and whose `<link>` tags load the five files in cascade order.

- [ ] **Step 1: Rename the classes and ids in `index.html`**

Token-wise, using the same map as the harness. The elements affected:

| Element | Old | New |
| --- | --- | --- |
| `<section id="home">` | `class="intro"` | `class="banner"` |
| banner photo | `class="intro-photo hero-photo"` | `class="banner-image"` |
| banner panel | `class="intro-panel"` | `class="banner-text"` |
| banner logo | `class="intro-logo"` | `class="banner-logo"` |
| banner copy | `class="intro-copy"` | `class="banner-copy"` |
| banner title | `class="intro-title"` | `class="banner-title"` |
| banner tagline | `class="intro-tag"` | `class="banner-tagline"` |
| banner description | `class="intro-desc"` | `class="banner-description"` |
| banner buttons | `class="intro-cta"` | `class="banner-buttons"` |
| banner details | `class="intro-meta"` | `class="banner-details"` |
| banner caption | `class="intro-caption"` | `class="banner-caption"` |
| banner label | `class="eyebrow light"` | `class="section-label"` |
| banner buttons | `class="btn solid"` / `class="btn ghost light"` | `class="btn btn-primary"` / `class="btn btn-secondary"` |
| ticker | `class="marquee"` / `marquee-track` / `m-item` / `m-star` | `class="ticker"` / `ticker-track` / `ticker-item` / `ticker-star` |
| stats | `class="num"` / `class="lbl"` | `class="stat-number"` / `class="stat-label"` |
| products grid | `class="grid-gallery is-product"` | `class="product-grid"` |
| craft step | `class="step-num"` | `class="step-number"` |
| freshness | `class="tiles"` / `tile` / `tile-icon` | `class="feature-list"` / `feature-card` / `feature-icon` |
| visit | `class="v-cards"` / `v-card` / `v-label` / `v-value` / `v-sub` | `class="visit-cards"` / `visit-card` / `visit-label` / `visit-value` / `visit-detail` |
| map | `class="map-wrap"` | `class="map-wrapper"` |
| footer | `f-grid` / `f-brand` / `f-col` / `f-bottom` / `f-mark` | `footer-grid` / `footer-brand` / `footer-column` / `footer-bottom` / `footer-star` |
| menu | `#burger` / `menu-word` / `burger-lines` / `mm-links` / `mm-bottom` / `mm-foot` | `#menu-button` / `menu-button-text` / `menu-icon` / `menu-links` / `menu-footer` / `menu-footer-text` |
| overlays | `#productModal` / `#lightbox` / `#progressBar` | `#product-modal` / `#photo-viewer` / *(dropped — see Step 2)* |
| grids | `#productGrid` | `#product-grid` |
| back to top | `id="toTop"` | `id="back-to-top"` |

Also: `.mono` → `.fallback-text` on every fallback-letter span; `.chip` → `.tag`; `.lb-*` → `.photo-*`; `.arr` → `.btn-arrow`; `.skip` → `.skip-link`; `.sr-only` → `.screen-reader-only`; `.grain` → `.noise-overlay`.

- [ ] **Step 2: Replace the progress bar markup**

```html
<div class="scroll-progress" aria-hidden="true"><span id="progress-bar"></span></div>
```

The CSS in `base.css` targets `.scroll-progress span` — the same shape as the old `.progress span`, so the rule needs no structural change, only the class rename. The id is what JavaScript uses to find the bar.

- [ ] **Step 3: Replace the `<link>` tags in `index.html` `<head>`**

Replace all 16 with exactly five, in this order:

```html
<link rel="stylesheet" href="styles/theme.css">
<link rel="stylesheet" href="styles/base.css">
<link rel="stylesheet" href="styles/components.css">
<link rel="stylesheet" href="styles/sections.css">
<link rel="stylesheet" href="styles/responsive.css">
```

- [ ] **Step 4: Update `reference/hero.html`**

Apply the same renames. Remove the `<div class="scroll-cue">` element — that class is deleted from the CSS, and the live page does not have it.

- [ ] **Step 5: Delete the 16 old stylesheets**

```bash
cd "/home/anonymous/Downloads/zm/ZM's Manna Bakeshop/styles"
rm 00-tokens.css 01-base.css 02-components.css 03-header.css 04-hero.css \
   05-marquee.css 06-story.css 07-products.css 08-modal.css 09-craft.css \
   10-freshness.css 11-visit.css 12-gallery.css 13-footer.css \
   14-responsive.css 15-catalog.css
ls
```

Expected: `base.css  components.css  responsive.css  sections.css  theme.css`.

- [ ] **Step 6: Run the HTML and selector checks**

```bash
cd /tmp/zms-verify && node check-html.mjs && node check-js-selectors.mjs
```

`check-html.mjs` compares the before-copy with the new `index.html`. It will report the renamed attributes as differences **unless** the renames are applied to the before-copy first — which is what Step 1 of the harness does. Expected: **PASS**.

`check-js-selectors.mjs` reads the *current* `app.js`, which still uses the old ids at this point. Expected: it reports the selectors that no longer resolve (`#productModal`, `#productGrid`, `#lightbox`, `#burger`, `#toTop`, `#progressBar`, `.g-item`). This is expected at this stage — Task 4 fixes it. Confirm the report lists **only** those.

- [ ] **Step 7: Grep for any old name that survived**

```bash
cd "/home/anonymous/Downloads/zm/ZM's Manna Bakeshop"
grep -rnoE 'class="[^"]*"' index.html | grep -E 'intro|hero|marquee|m-item|m-star|g-item|g-cap|chip|mono|no-img|eyebrow|sec-head|sec-sub|v-|lb-|mm-|tile|f-|\.card' || echo "clean"
```

Expected: `clean`. Note `.card` — `.product-card` and `.feature-card` are legitimate; the pattern above will need `.card` removed from the list. Use a precise list instead:

```bash
grep -rnoE '\b(intro|hero|marquee|eyebrow|sec-head|sec-sub|mono|no-img|chip|g-item|g-cap|lb-|mm-|v-card|v-cards|v-label|v-value|v-sub|step-num|tile-icon|map-wrap|f-grid|f-brand|f-col|f-bottom|f-mark|arr|sr-only)\b' index.html reference/hero.html || echo "clean"
```

Expected: `clean`.

- [ ] **Step 8: Serve the page and confirm it renders**

```bash
cd "/home/anonymous/Downloads/zm/ZM's Manna Bakeshop" && python3 -m http.server 8899
```

Open `http://localhost:8899/`. Expected: the banner, ticker, story, product grid, craft, freshness, visit and footer all render with their backgrounds, borders and spacing intact. The product grid will be **empty** — `app.js` still uses the old ids, which Task 4 fixes. Everything else must look unchanged.

- [ ] **Step 9: Commit**

```bash
git add index.html reference/hero.html styles/
git commit -m "refactor: rename classes and ids, load the five new stylesheets"
```

---

### Task 4: Rewrite `app.js` in plain functions

**Files:**
- Modify: `app.js` (full rewrite)

**Interfaces:**
- Consumes: the new `index.html` from Task 3 (its ids and classes), spec §2.1–§2.5.
- Produces: `app.js` with the 13 numbered sections and the function names in spec §2.3.

- [ ] **Step 1: Write the file header and the two helper functions**

```js
/* =========================================================
   ZM'S MANNA — the interaction layer

   This file adds behaviour to the page in index.html.
   It is plain JavaScript: no frameworks, no libraries.

   HOW IT FITS TOGETHER
   JavaScript does not style anything. It changes state —
   it adds a class name to an element, or sets a CSS custom
   property — and the stylesheet reacts to that state.
   The full contract is in docs/JS-CSS-BRIDGE.md.
   ========================================================= */
```

Then `findElement(selector, parent)` and `findElements(selector, parent)`, and the two environment flags `userPrefersLessMotion` and `userHasMouse`.

`findElement` and `findElements` must accept an optional second argument that defaults to `document`, exactly like the `$` / `$$` they replace.

- [ ] **Step 2: Write the data section**

`SITE_CONFIG` (with `facebook` and `bannerImg`), `PRODUCTS` and `PHOTOS`.

Every product record gains the renamed data keys from spec §1.13: `gradientFrom` and `gradientTo` replace `g1` and `g2`; `fit: "contained"` replaces `fit: "contain"`.

The `mono` field on each record keeps its name — it is the fallback letters, and `mono` is not a class name.

- [ ] **Step 3: Write the product-tile builder**

`buildProductTiles()` builds the grid from `PRODUCTS` and **attaches a click listener to each tile as it creates it**, rather than delegating from the container.

Each tile is:

```html
<button class="product-card" data-id="…" data-reveal data-delay="…"
        style="--gradient-from:…;--gradient-to:…" aria-haspopup="dialog"
        aria-label="View details: …">
  <span class="fallback-text" aria-hidden="true">…</span>
  <img src="…" alt="…" loading="lazy" decoding="async">
  <span class="product-caption">…</span>
</button>
```

The logo-only product additionally gets `class="product-card is-logo"` and its image gets `class="is-contained"`.

The gradient goes out as the inline custom properties `--gradient-from` and `--gradient-to`, matching spec §1.12.

- [ ] **Step 4: Write the remaining functions**

`handleBrokenImage`, `applySiteSettings`, `setupScrollReveal`, `setupAnimatedCounters`, `setupScrollChrome`, `setupMobileMenu`, `openProductPopup`, `closeProductPopup`, `openPhotoViewer`, `closePhotoViewer`, `showNextPhoto`, `setupKeyboardControls`, `setupMouseEffects` — in the order and with the names in spec §2.1 and §2.3.

Rules that must hold, from spec §2.3 and §2.4:

- The two focus variables stay separate: `productPopupPreviouslyFocused` and `photoViewerPreviouslyFocused`. Spec §2.3.
- The magnetic-button effect is kept, in `setupMouseEffects()`, gated on `userHasMouse && !userPrefersLessMotion`.
- The `.tilt` handler, the `#heroVisual` parallax loop, the scroll spy and the `.scrolled` class are **not** written. Spec §2.5.
- Every state class written matches spec §0.5: `.is-visible`, `.is-open`, `.is-active`, `.is-hidden`, `.is-shown`. The body gets `.scroll-locked`.
- Every id and selector used matches the new `index.html` from Task 3.

- [ ] **Step 5: Write the run order block at the bottom**

```js
/* =========================================================
   RUN EVERYTHING
   The order matters for one reason: the product tiles are
   built first, because setupScrollReveal() can only reveal
   tiles that already exist in the page.
   ========================================================= */
buildProductTiles();
applySiteSettings();
setupScrollReveal();
setupAnimatedCounters();
setupScrollChrome();
setupMobileMenu();
setupKeyboardControls();
setupMouseEffects();
```

`app.js` is loaded with `defer`, so the HTML is already parsed here. A comment at the top of the file must say so.

- [ ] **Step 6: Syntax check and the selector check**

```bash
node --check "/home/anonymous/Downloads/zm/ZM's Manna Bakeshop/app.js"
cd /tmp/zms-verify && node check-js-selectors.mjs
```

Expected: `node --check` passes silently; the selector check reports **every selector resolves**.

- [ ] **Step 7: Verify the focus round-trip in the browser**

Serve the folder, open the page, and use the keyboard only:

1. Tab to a product card, press Enter → the popup opens and focus moves to the close button.
2. Press Escape → the popup closes and focus is **back on the product card you came from**, not the top of the document.
3. Press Enter on "View full image" → the photo viewer opens, focus moves to its close button.
4. Press Escape → the photo viewer closes and focus returns to the "View full image" button.
5. Press Escape again → the popup closes and focus returns to the product card.

This is Review Focus item 4.

- [ ] **Step 8: Verify reduced motion in the browser**

In DevTools, emulate `prefers-reduced-motion: reduce`, then reload. Expected: the sections are visible without scrolling, the ticker is not moving, the counters show their final numbers immediately, and no button follows the cursor.

This is Review Focus item 5.

- [ ] **Step 9: Verify the product grid reveals**

Reload the page and scroll slowly. Expected: the six product cards fade and rise into view in a left-to-right stagger. If they stay invisible, `buildProductTiles()` is running after `setupScrollReveal()`.

This is Review Focus item 3.

- [ ] **Step 10: Commit**

```bash
git add app.js
git commit -m "refactor: rewrite app.js as plain commented functions"
```

---

### Task 5: Convert the units to rem

**Files:**
- Modify: `styles/theme.css`, `styles/base.css`, `styles/components.css`, `styles/sections.css`, `styles/responsive.css`

**Interfaces:**
- Consumes: the five stylesheets from Task 2, the unit policy in spec §0.6.
- Produces: the same CSS with `px` only where the policy allows it.

- [ ] **Step 1: Convert the custom properties in `theme.css`**

| Old | New |
| --- | --- |
| `--header-height:64px` | `--header-height:4rem` |
| `--card-radius:22px` | `--card-radius:1.375rem` |
| `--shadow:0 18px 44px -18px rgba(18,59,104,.25)` | `--shadow:0 1.125rem 2.75rem -1.125rem rgba(18,59,104,.25)` |
| `--shadow-small:0 8px 24px -12px rgba(18,59,104,.18)` | `--shadow-small:0 0.5rem 1.5rem -0.75rem rgba(18,59,104,.18)` |

- [ ] **Step 2: Convert every other `px` value**

Divide by 16 and write as `rem`. Work through the five files in order. The values that occur, and their conversions:

| Value | Becomes | Where |
| --- | --- | --- |
| `16px` | `1rem` | body font size, `scroll-padding-top` calc |
| `22px` | `1.375rem` | brand border radius? no — card radius, `.btn-arrow` sizes |
| `1.2px` | `0.075rem` | the dot grid in `radial-gradient` |
| `3px` | `0.1875rem` | progress bar height |
| `2px` | `0.125rem` | burger bar height, eyebrow rule |
| `4px` | `0.25rem` | burger bar gap, arrow nudge |
| `6px` | `0.375rem` | burger bar fold offset |
| `8px` | `0.5rem` | dashed rail dash |
| `10px` | `0.625rem` | `.modal-close` offset |
| `12px` | `0.75rem` | modal info top padding, `.photo-close` offset |
| `14px` | `0.875rem` | `.modal-close` offset, `.footer-star` |
| `16px` | `1rem` | — |
| `18px` | `1.125rem` | `.burger-lines span` width, `.photo-close` offset, `.brand small` letter-spacing context |
| `20px` | `1.25rem` | `.photo-close` top |
| `22px` | `1.375rem` | `.photo-close` right, `.map-wrap` border radius context |
| `26px` | `1.625rem` | `.modal-box` radius, `.modal-box` translate |
| `28px` | `1.75rem` | reveal rise distance |
| `34px` | `2.125rem` | `.brand-mark` |
| `40px` | `2.5rem` | `.modal-close` |
| `46px` | `2.875rem` | `.photo-close` |
| `48px` | `3rem` | `#menu-button` height, `.feature-icon`, `#back-to-top` |
| `50px` | `3.125rem` | `.photo-prev`, `.photo-next` |
| `52px` | `3.25rem` | `.banner-logo img` |
| `54px` | `3.375rem` | `.step-number` |
| `60px` | `3.75rem` | `.skip-link` off-screen position |
| `96px` | `6rem` | `.banner-details > div` label column |
| `130px` | `8.125rem` | `.spec div` label column |
| `380px` | `23.75rem` | `.map-wrapper` min-height |
| `460px` | `28.75rem` | `.modal-media` min-height |
| `640px` | `40rem` | `.section-header` max-width |
| `880px` | `55rem` | `.photo-frame`, `.photo-bar` |
| `960px` | `60rem` | `.modal-box` |
| `1180px` | `73.75rem` | `.container`, `.banner` |
| `0.5px`-scale values | divide by 16 | see the table above |

**Left as `px` on purpose:**

- every border width — `1px`, `1.5px`, `2px`
- `outline:2px`, `outline-offset:3px`
- `border-radius:999px` on pills (`.btn`, `.tag`, `.brand`, `#menu-button`) — a pill radius must stay larger than the element however big it gets
- media query breakpoints — `1024px`, `768px`, `560px`

- [ ] **Step 3: Run the unit check**

```bash
cd /tmp/zms-verify && node check-units.mjs
```

Expected: **PASS** — no `px` outside the allowlist.

- [ ] **Step 4: Re-run the CSS equivalence check**

```bash
cd /tmp/zms-verify && node check-css.mjs
```

Expected: `REMOVED: 0`, `ADDED: 0`, `CHANGED: 0`. The unit canonicalisation is what makes this work — `1.375rem` and `22px` compare equal.

- [ ] **Step 5: Confirm the breakpoints survived as px**

```bash
grep -n "max-width:" "/home/anonymous/Downloads/zm/ZM's Manna Bakeshop/styles/responsive.css"
```

Expected: `1024px`, `768px`, `560px`.

- [ ] **Step 6: Commit**

```bash
git add styles/
git commit -m "style: use rem for sizes, keep px for hairlines and breakpoints"
```

---

### Task 6: Add the teaching comments

**Files:**
- Modify: `styles/theme.css`, `styles/base.css`, `styles/components.css`, `styles/sections.css`, `styles/responsive.css`
- Modify: `index.html`
- Modify: `app.js`

**Interfaces:**
- Consumes: everything from Tasks 2–5.
- Produces: the same behaviour and the same rules, with comments that explain what each part is for.

- [ ] **Step 1: Add a `CONTENTS` index to the top of each stylesheet**

```css
/* =========================================================
   COMPONENTS — the parts we reuse
   ------------------------------------------------------------
   Labels       .section-label, .section-header, .section-subtitle
   Buttons      .btn, .btn-primary, .btn-secondary, .btn-arrow
   Fallback     .fallback-text, .image-missing
   Header       #navbar, .brand, #menu-button, #mobile-menu
   Popup        .modal, .modal-box, .modal-media, .modal-info
   Photo viewer .photo-viewer, .photo-frame, .photo-close …
   Footer       .footer, .footer-grid, #back-to-top
   ========================================================= */
```

- [ ] **Step 2: Add a plain comment above each rule group**

One line, saying what the rule is for — not what the code does. Example:

```css
/* the small uppercase label above a heading */
.section-label{ … }
```

- [ ] **Step 3: Comment the HTML sections**

Each `<section>` gets a two-line comment: what it is, and which stylesheet owns it.

```html
<!-- ============ THE BANNER — the big block at the top of the page
     Styled by styles/sections.css → .banner ============= -->
```

- [ ] **Step 4: Comment the JavaScript**

Each function gets a comment above it with three parts: what it does, what it looks for, and what changes on screen.

```js
/* Opens the product popup.
   Looks for: the product card that was clicked.
   Changes on screen: the popup appears, the page behind it stops
   scrolling, and focus moves to the close button. */
```

- [ ] **Step 5: Re-run every check**

```bash
cd /tmp/zms-verify
node check-css.mjs && node check-html.mjs && node check-js-selectors.mjs && node check-units.mjs
```

Expected: all four pass. Comments must not change a single rule.

- [ ] **Step 6: Commit**

```bash
git add styles/ index.html app.js
git commit -m "docs: explain each section, rule group and function in plain words"
```

---

### Task 7: Write the beginner guide

**Files:**
- Create: `docs/BEGINNER-GUIDE.md`

**Interfaces:**
- Consumes: the finished code.
- Produces: the teaching document every other doc links to.

- [ ] **Step 1: Write the opening — what this project is and how to open it**

Three paragraphs: it is a static site with no build step; double-click `index.html` or serve the folder; the three files and what each does.

- [ ] **Step 2: Write "How to find the CSS for any element"**

The search path a student actually needs:

1. Find the element in `index.html` and write down its classes.
2. Grep for that class: `grep -n "product-card" styles/*.css`.
3. The file it appears in tells you the section.
4. If a rule is not there, look for the rule in `base.css` and `components.css` first — those hold the rules everything shares.

- [ ] **Step 3: Write the CSS units glossary**

A table with one row per unit: `px`, `rem`, `em`, `%`, `vw`, `vh`, `svh`, `ch`, `fr`, `deg`, `ms`/`s`. Columns: **the unit**, **what it is relative to**, **when to use it**, **an example from this project**.

Must include the project's own rule: `rem` for sizes, `px` for hairlines and breakpoints.

- [ ] **Step 4: Write the CSS properties glossary**

`clamp()`, `min()`, `max()`, `color-mix()`, `backdrop-filter`, `aspect-ratio`, `inset`, `gap`, `translate`, `rotate`, `grid-template-columns`, `:focus-visible`, `prefers-reduced-motion`, `z-index`.

Each with a one-line plain explanation and the example from this project.

- [ ] **Step 5: Write the JavaScript glossary**

`querySelector`, `classList`, `dataset`, `addEventListener`, `matchMedia`, `IntersectionObserver`, `requestAnimationFrame`, `setProperty`, `textContent`, `innerHTML`, `focus()`, `preventDefault`, `aria-*`, `defer`.

- [ ] **Step 6: Write the naming conventions section**

The six rules from spec §3.1, each with a before/after example from this refactor, plus the jargon table from spec §0.3. Mention BEM as the stricter industry version they may meet later.

- [ ] **Step 7: Write the old-to-new name map**

A two-column table of every renamed class, id, token and custom property, so anyone who saw the old code can find the new name. Build it from `rename-map.mjs`.

- [ ] **Step 8: Write the walkthrough**

One feature, end to end: **clicking a product card opens the popup**. Start at the click in `index.html`, follow it into `app.js`, and end at the CSS that makes the popup appear. Use the same numbered path as spec §7 of `docs/JS-CSS-BRIDGE.md`.

- [ ] **Step 9: Write "Talking points for presenting this to reviewers"**

One line each, with the evidence:

- No build step, no dependencies — open `index.html` and it runs.
- Design tokens as CSS custom properties — one file to re-theme the whole site.
- Fluid layout — `clamp()` and `min()` mean no breakpoints above 1020px.
- `rem` throughout, so it scales with the user's font size.
- Progressive enhancement — the page is readable with JavaScript off; only the product grid needs it.
- Accessibility — skip link, focus trap, focus restore, ARIA, `prefers-reduced-motion`.
- Performance — passive scroll listener, rAF throttle, `IntersectionObserver`, lazy images.
- Progressive disclosure — five stylesheets, each with one job.

- [ ] **Step 10: Commit**

```bash
git add docs/BEGINNER-GUIDE.md
git commit -m "docs: add the beginner guide"
```

---

### Task 8: Rewrite the reference docs

**Files:**
- Rewrite: `docs/README.md`, `docs/CSS-GUIDE.md`, `docs/JS-GUIDE.md`, `docs/JS-CSS-BRIDGE.md`
- Rewrite: `README.md`, `DESIGN.md`
- Create: `CLAUDE.md`

**Interfaces:**
- Consumes: the finished code, the beginner guide from Task 7.
- Produces: four reference docs and three project files that all use the new names.

- [ ] **Step 1: Rewrite `docs/CSS-GUIDE.md`**

Keep the existing structure — layering model, tokens, selector index, breakpoints, motion inventory, stacking order, layout primitives, rules, recipes, orphan audit — but for the new five-file layout and the new names. Replace the "orphaned rules" audit with a short section naming the three deletions the refactor made (`07-products.css`, `15-catalog.css`, the legacy hero block) so a reader knows why they are gone.

Add a units subsection stating the project rule.

- [ ] **Step 2: Rewrite `docs/JS-GUIDE.md`**

Same structure — shape of the file, module map, data reference, behaviour modules, accessibility summary, performance notes, editing product data, adding behaviour, known gaps — with the new names from spec §2.3 and the new section numbers from spec §2.1.

- [ ] **Step 3: Rewrite `docs/JS-CSS-BRIDGE.md`**

The four channels, the state-class table (spec §0.5), the custom-property table, the inline-style table, the effect table, the reverse index, the two worked examples, the gotchas, and the checklist for adding a new visual state.

Update the gotchas: `.fallback-text` and `.image-missing` now live in `components.css`; the button system is `.btn` + `.btn-primary` / `.btn-secondary`.

- [ ] **Step 4: Rewrite `docs/README.md`**

The navigation hub. Add `docs/BEGINNER-GUIDE.md` at the top of the reading order — it is the entry point for a student.

- [ ] **Step 5: Rewrite `README.md`**

Keep the existing sections — what it is, file map, stylesheet table, editing cheat sheet, conventions, running checks — with the new file layout. Add a link to the beginner guide at the top.

- [ ] **Step 6: Update `DESIGN.md`**

Keep the visual system: brand, colour, type, layout diagram, interaction, the five coherence rules, editing notes. Update the file table to the five stylesheets. Fix the stale section-rhythm value — the code says `clamp(3.5rem, 7vw, 6rem)`, the document says `clamp(4.5rem, 9vw, 7.5rem)`.

- [ ] **Step 7: Create `CLAUDE.md`**

Under 100 lines. The tech stack, the code style rules, the testing commands, the build and run commands, the project structure, the conventions. Point at `docs/BEGINNER-GUIDE.md` and `docs/JS-CSS-BRIDGE.md` rather than repeating them.

- [ ] **Step 8: Grep every doc for a stale name**

```bash
cd "/home/anonymous/Downloads/zm/ZM's Manna Bakeshop"
grep -rnE '\b(intro|hero|marquee|eyebrow|sec-head|sec-sub|mono|no-img|chip|g-item|g-cap|lb-|mm-|v-card|v-cards|v-label|v-value|v-sub|step-num|tile-icon|map-wrap|f-grid|f-brand|f-col|f-bottom|f-mark|arr|sr-only)\b' README.md DESIGN.md docs/*.md
```

Expected: no hits **except** inside the old-to-new name map in `docs/BEGINNER-GUIDE.md` and the audit sections that name what was deleted. Check each remaining hit by hand.

- [ ] **Step 9: Commit**

```bash
git add README.md DESIGN.md CLAUDE.md docs/
git commit -m "docs: rewrite the reference docs for the new structure"
```

---

### Task 9: Final verification

**Files:**
- Read only, except any fix the checks turn up.

**Interfaces:**
- Consumes: everything.
- Produces: a clean tree and a verified site.

- [ ] **Step 1: Run the whole harness**

```bash
cd /tmp/zms-verify
node check-css.mjs && node check-html.mjs && node check-js-selectors.mjs && node check-units.mjs
```

Expected: all four pass.

- [ ] **Step 2: Grep the whole repo for stale names, excluding the archive**

```bash
cd "/home/anonymous/Downloads/zm/ZM's Manna Bakeshop"
grep -rnE '\b(intro|hero|marquee|eyebrow|sec-head|sec-sub|mono|no-img|chip|g-item|g-cap|lb-|mm-|v-card|v-cards|v-label|v-value|v-sub|step-num|tile-icon|map-wrap|f-grid|f-brand|f-col|f-bottom|f-mark|sr-only)\b' \
  --exclude-dir=archive --exclude-dir=.git . || echo "clean"
```

Expected: `clean`, apart from deliberate mentions in the beginner guide's old-to-new map.

- [ ] **Step 3: Confirm the old stylesheets are gone and the archive is untouched**

```bash
ls styles/
git diff --stat master -- archive/     # expect no changes
```

Expected: five files in `styles/`; no change to `archive/`.

- [ ] **Step 4: The full manual pass, in the browser**

Serve the folder and check, in this order:

1. Banner: image fills the left cell square-cornered with no shadow; navy panel on the right; gold primary button, outlined secondary button.
2. Ticker: product names scroll, pause on hover.
3. Story: four stat cards, the numbers count up as they appear.
4. Products: six cards, captions always visible, Otap renders as a cream label card with fallback letters.
5. Click a card → popup with the right product, five spec rows, "View full image" → photo viewer opens and steps.
6. Craft: four steps on a dashed rail.
7. Freshness: four feature cards on a cream band.
8. Visit: four contact cards and the map.
9. Footer: three columns and the back-to-top button.
10. Scroll: progress bar fills, nav hides going down and returns going up, back-to-top appears.
11. Resize to 360 / 768 / 1024 / 1440 — check every breakpoint.

- [ ] **Step 5: Check the console**

Expected: no errors, no warnings about missing stylesheets, no 404s.

- [ ] **Step 6: Clean up**

The harness lives in `/tmp` and is never committed. Confirm nothing from it leaked into the repo:

```bash
git status --short
```

Expected: no untracked files other than what the plan created.

- [ ] **Step 7: Final commit, if anything is outstanding**

```bash
git add -A
git commit -m "chore: final verification pass"
```

Only if there is something to commit.

---

## Self-Review

**Spec coverage.** Spec §0.1 token-wise renames → Tasks 2–3. §0.2 specificity → Task 2 Step 6. §0.3 plain naming and buttons → Tasks 2–3, documented in Task 7 Step 6. §0.4 state vocabulary → Task 4 Step 4. §0.5 units → Task 5. §0.6 five stylesheets → Task 2. §0.7 id convention → Task 3 Step 1. §0.8–§1.14 the rename map → Tasks 2–3. §2.1–§2.5 the JS rewrite → Task 4. §3.1–§3.4 the documentation → Tasks 7–8. The verification plan V1–V6 → Tasks 1, 2, 3, 4, 5, 9.

**Step scan.** Every step names a file, a value, or a command. No step says "write the tests" or "handle edge cases" — the harness is specified in full in Task 1 and referenced by name afterwards.

**Type consistency.** The harness exports `CLASS_RENAMES`, `ID_RENAMES`, `VAR_RENAMES`, `REMOVE_CLASSES`, `DELETE_BY_FILE`, `DELETE_DECLARATIONS`; Task 1 Step 4 is the only consumer. The five CSS filenames are fixed in Task 1 Step 2's file list and Task 3 Step 3's `<link>` block, and match. The thirteen JavaScript function names are fixed in spec §2.1, referenced in Task 4 Steps 4–5, and used in Task 4's browser checks.

**Review Focus.** Item 1 → Task 2 Step 4 and the Task 2 Step 8 grep for `#products`. Item 2 → Task 2 Step 4 (legacy block not copied) and the Task 2 Step 8 grep for `hero`. Item 3 → Task 4 Step 9. Item 4 → Task 4 Step 7. Item 5 → Task 4 Step 8.

**Proportion.** The plan is longer than the diff for the five stylesheets alone, but the whole change touches nineteen files across four languages of change (HTML, CSS, JS, Markdown) with a verification method that has to be specified exactly once. The rename map itself is not repeated here — it lives in the spec, which travels with this plan.
