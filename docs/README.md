# Docs — Zm's Manna Bakeshop

Navigation hub for this repo. Start here, then jump to the doc that matches
your task.

## The short version

This is a **static site with no build step, no framework, and no dependencies.**
Three things do all the work:

| Layer | Files | Role |
| --- | --- | --- |
| Structure | `index.html` | One long page. Every section, the modal, and the lightbox live here. |
| Presentation | `styles/*.css` | 16 numbered files loaded in order. Each file owns one slice of the page. |
| Behaviour | `app.js` | One IIFE. Product data, rendering, and every interaction. |

The single most important thing to understand: **CSS owns the look, JS owns the
state, and they talk through class names and CSS custom properties.** JS never
writes a colour or a size — it toggles a class (`.open`, `.in`, `.active`) or
sets a variable (`--g1`, `--g2`) and CSS reacts. That contract is documented in
full in [`JS-CSS-BRIDGE.md`](./JS-CSS-BRIDGE.md).

## Reading order

1. [`JS-CSS-BRIDGE.md`](./JS-CSS-BRIDGE.md) — **read this first.** How a JS
   function ends up changing something you can see.
2. [`CSS-GUIDE.md`](./CSS-GUIDE.md) — every token, every selector, every
   breakpoint, plus an audit of which rules are actually live.
3. [`JS-GUIDE.md`](./JS-GUIDE.md) — every function and data structure in
   `app.js`, with line numbers and DOM targets.
4. [`../DESIGN.md`](../DESIGN.md) — the visual system and the rules that keep
   it coherent (brand, layout, motion).
5. [`../README.md`](../README.md) — the editing cheat sheet.

## I want to…

| Task | Go to |
| --- | --- |
| Change a colour, font, shadow, radius, or spacing | `CSS-GUIDE.md` → *Design tokens* |
| Find the CSS for a specific element | `CSS-GUIDE.md` → *Selector index* |
| Know what happens at 1024 / 768 / 560 px | `CSS-GUIDE.md` → *Breakpoints* |
| Understand a JS function | `JS-GUIDE.md` → *Module map* |
| Know which CSS a JS function touches | `JS-CSS-BRIDGE.md` → *Effect table* |
| Add or edit a product | `JS-GUIDE.md` → *Editing product data* |
| Add a new section | `CSS-GUIDE.md` → *Adding a section* |
| Understand why an element is invisible | `JS-CSS-BRIDGE.md` → *Gotchas* |
| Understand the visual intent | `../DESIGN.md` |
| Understand the markup | `../index.html` |

## Conventions used in these docs

- **Line numbers** refer to the file as of the last commit; they are a
  navigation aid, not a contract.
- **Live** means a selector matches something in `index.html` or in HTML that
  `app.js` injects.
- **Orphaned** means the selector is defined in CSS but nothing matches it.
  Orphaned rules are harmless but they mislead readers — the audit lists them
  so you can delete them or wire them up.
- `→` means "is written by" / "reacts to".
