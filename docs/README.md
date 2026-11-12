# Docs — Zm's Manna Bakeshop

Navigation hub for this repo. Start here, then jump to the doc that matches
your task.

## The short version

This is a **static site with no build step, no framework, and no
dependencies.** Three things do all the work:

| Layer | Files | Role |
| --- | --- | --- |
| Structure | `index.html` | One long page. Every section, the popup and the photo viewer live here. |
| Presentation | `styles/*.css` | Five named stylesheets loaded in order. Each file owns one job. |
| Behaviour | `app.js` | One file of plain functions: product data, rendering, and every interaction. |

The single most important thing to understand: **CSS owns the look,
JavaScript owns the state, and they talk through class names and CSS custom
properties.** JavaScript never writes a colour or a size — it toggles
`.is-open` / `.is-visible` / `.is-shown` or sets `--gradient-from`, and the
stylesheet reacts.

## Reading order

1. [`BEGINNER-GUIDE.md`](./BEGINNER-GUIDE.md) — **read this first.** What the
   project is, how to find the CSS for any element, the CSS units and
   properties glossaries, the JavaScript glossary, the naming rules, the
   old→new name map, a full walkthrough of one feature, and talking points
   for presenting the code.
2. [`JS-CSS-BRIDGE.md`](./JS-CSS-BRIDGE.md) — how a JS function ends up
   changing something you can see. The state-class contract, the custom
   properties, the effect tables, worked examples, and the gotchas.
3. [`CSS-GUIDE.md`](./CSS-GUIDE.md) — every token, every selector, every
   breakpoint, the motion inventory, the stacking order, the unit policy,
   and what the refactor removed.
4. [`JS-GUIDE.md`](./JS-GUIDE.md) — every function and data structure in
   `app.js`, with DOM targets and accessibility behaviour.
5. [`../DESIGN.md`](../DESIGN.md) — the visual system and the rules that keep
   it coherent.
6. [`../README.md`](../README.md) — the editing cheat sheet.

## I want to…

| Task | Go to |
| --- | --- |
| Understand the project as a whole | `BEGINNER-GUIDE.md` §1 |
| Find the CSS for a specific element | `BEGINNER-GUIDE.md` §2 |
| Know what `rem` means, or what `clamp()` does | `BEGINNER-GUIDE.md` §3–§4 |
| Know what `querySelector` or `classList` means | `BEGINNER-GUIDE.md` §5 |
| Know why a class is called what it is called | `BEGINNER-GUIDE.md` §6 |
| Find the new name of something old | `BEGINNER-GUIDE.md` §7 |
| Follow one feature from click to pixels | `BEGINNER-GUIDE.md` §8 |
| Prepare for a code review or presentation | `BEGINNER-GUIDE.md` §9 |
| Change a colour, font, shadow, radius, or spacing | `CSS-GUIDE.md` §2 |
| Know what happens at 1024 / 768 / 560 px | `CSS-GUIDE.md` §5 |
| Understand a JS function | `JS-GUIDE.md` §3 |
| Know which CSS a JS function touches | `JS-CSS-BRIDGE.md` §5 |
| Add or edit a product | `JS-GUIDE.md` §6 |
| Add a new section | `CSS-GUIDE.md` §10 |
| Understand why an element is invisible | `JS-CSS-BRIDGE.md` §9 |
| Understand the visual intent | `../DESIGN.md` |
| Understand the markup | `../index.html` |

## Conventions used in these docs

- **Live** means a selector matches something in `index.html`, or in the
  markup `app.js` generates.
- **Orphaned** means a selector is defined in CSS but nothing matches it.
- `→` means "is written by" / "reacts to".
- Line numbers are a navigation aid, not a contract.
