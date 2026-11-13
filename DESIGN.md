# Zm’s Manna Bakeshop — design system

Static site. No build step, no dependencies. Open `index.html` or serve the
folder.

The look: a neighbourhood bakehouse in Valencia City, Bukidnon, presented like
a shop counter — warm cream paper, a navy signboard, and gold that only ever
carries dark ink. The single loud element is the split banner card;
everything below it stays quiet and evenly paced so the products do the
talking.

## Files

| Path | Role |
| --- | --- |
| `index.html` | The page. Sections in order: header, banner, ticker, story, products, craft (with packaging), order, visit, footer, product popup, photo viewer. |
| `app.js` | Product data, the gallery render, the popup, the photo viewer, the menu, scroll reveal, counters, scroll progress. |
| `styles/theme.css` | The design tokens — every colour, font, radius and shadow. |
| `styles/base.css` | The reset, typography, layout primitives, the reveal system. |
| `styles/components.css` | The reusable parts: labels, buttons, the tag, fallback letters, header, menu, popup, photo viewer, footer. |
| `styles/sections.css` | The seven page sections: banner, ticker, story, products, craft (with packaging), order, visit. |
| `styles/responsive.css` | Breakpoints at 1024 / 768 / 560, and reduced motion. |
| `assets/` | Product photos, the banner crops, the marketing graphics, the logo, favicons. |
| `reference/hero.html` | The banner as a standalone fragment, for reuse. *Local only.* |
| `docs/` | [Beginner's guide](docs/BEGINNER-GUIDE.md), [CSS guide](docs/CSS-GUIDE.md), [JS guide](docs/JS-GUIDE.md), [JS↔CSS bridge](docs/JS-CSS-BRIDGE.md). |
| `archive/legacy-2026-11-12/` | The previous design. Not referenced. *Local only.* |

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| `--color-background` | `#F8F3E8` | Page cream, with a 1.375rem dot grid |
| `--color-surface` | `#FFFDF8` | Cards, footer, the outlined button |
| `--color-surface-alt` | `#F2EDE3` | The alternating band behind products and freshness |
| `--color-heading` | `#123B68` | Display type, the banner panel, buttons' ink |
| `--color-ink` | `#172033` | Body copy |
| `--color-muted` | `#4D5667` | Secondary copy |
| `--color-gold` | `#D2A62A` | Buttons, marks, accents — always paired with `--color-ink` |
| `--color-gold-soft` | `#F2DF9E` | Accents on navy |
| `--color-accent` | `#945F2F` | Section labels, the tag, the spec labels, links, focus ring |
| `--color-border` | `#DED5C6` | Every hairline border |

Gold never carries white text. Body copy on cream is 14.7:1; muted is 6.7:1;
`--color-accent` is 4.8:1 at its smallest use (the section labels).

## Type

- **Fraunces** (`--font-heading`) — display. Headings, the brand name, the
  banner wordmark, product names, stat numbers, the photo caption. Weights
  600/700, optical sizing on.
- **DM Sans** (`--font-body`) — everything else. Body, labels, buttons, meta
  rows.

Scale follows a fluid clamp; body sits at 1rem/1.65, headings from
`clamp(1.6rem,3.6vw,2.6rem)`. Measure stays under 80 characters (`56ch` on
story copy, `46ch` inside the banner panel).

## Layout

```
┌──────────────────────────────────────────────┐
│ (brand pill)                      (Menu)     │  floating over the banner
├──────────────────────────────────────────────┤
│ ┌───────────────┬──────────────────────────┐ │
│ │               │ logo                     │ │
│ │   product     │ BISCUITS · BREAD · …     │ │  the banner card
│ │   photo       │ Zm’s                     │ │  1.15fr / .85fr
│ │               │ Manna                    │ │  1.5rem radius
│ │               │ “Love at first bite.”    │ │
│ │  [caption]    │ copy · two CTAs          │ │
│ │               │ ─ products / bakehouse … │ │
│ └───────────────┴──────────────────────────┘ │
├──────────────────────────────────────────────┤
│  ✦ ticker of product names, 30s loop         │
├──────────────────────────────────────────────┤
│  story copy            │ 2×2 stat cards      │
│  6 products, 3 columns │ popup on click      │
│  the bake poster + 4 craft steps on a rail    │
│  4 packaging cards                            │
│  order: the wholesale graphic + a call button│
│  visit cards 2×2       │ embedded map        │
│  footer: brand · Explore · Visit             │
└──────────────────────────────────────────────┘
```

Content is left-aligned throughout; the banner panel is the only place with a
fixed two-column split and a dark field. Section rhythm is
`clamp(3.5rem, 7vw, 6rem)`, tightening to `clamp(2.5rem, 6vw, 3.5rem)` under
560px.

## Units

`rem` for anything that measures a size, `px` only for hairlines and for the
pill shape, `%` for anything relative to its parent. `1rem` is `16px` at the
browser default, so the whole design scales with the visitor's font size.

## Interaction

- Reveal on scroll: a 1.75rem rise + fade, gated behind `.js` so nothing hides
  without JavaScript. Disabled under `prefers-reduced-motion`.
- Counters run once at 60% visibility, 1.4s cubic ease-out; reduced motion
  jumps straight to the final number.
- The ticker pauses on hover and stops entirely under reduced motion.
- The header holds the brand pill and the menu button, and floats over the
  banner; it slides away while you scroll down and returns when you scroll
  up. The progress bar at the top fills as you go.
- Product card → popup (`aria-modal`, focus moves to the close button, Tab is
  trapped, Escape closes, focus returns to the card).
- Popup → photo viewer for products that have a photo entry; arrows step,
  Escape closes.
- Full-screen menu: focus moves to the first link, Tab is trapped, Escape
  returns focus to the menu button.
- Overlays set `visibility` inline on open so focus lands immediately; CSS
  still fades opacity and delays the hide by 0.35s.

## Rules that keep it coherent

1. **One gold, one ink.** Any gold surface uses `#172033` for its text.
2. **The banner is the only dark block.** Navy appears again only as text
   (`--color-heading`) or as a translucent scrim over media — never as a
   second dark field. The logo card caption uses navy text, not a navy field.
3. **Borders do the work.** Cards are separated by `--color-border`, not by
   shadow. Shadow is reserved for the banner card, the popup and floating
   controls.
4. **The logo card is a label, not a photo.** The Otap & Loaf line has no
   photograph, so its card renders as a cream card with the mark centred, a
   hairline, and navy caption text.
5. **Copy is the shop’s own.** Location, hours, phone, DTI note and product
   notes come from the label; keep new copy at that register.
6. **Names are plain words.** A class name says what the element is, in the
   words a person would use out loud. No `hero`, `marquee`, `tile`, `chip`,
   `ghost` or `monogram`.

## Editing notes

- Product data lives in `PRODUCTS` at the top of `app.js`; the `PHOTOS`
  array below it drives the photo viewer. Both use `assets/` paths.
- `SITE_CONFIG.facebook` is a placeholder search URL — replace it with the
  exact page URL.
- New sections: add a stylesheet in `styles/` and a matching `<link>` in
  `index.html`, linked before `responsive.css`; do not grow `base.css` past
  tokens, reset and shared primitives.
- The naming rules, the units glossary and the old→new name map are in
  [`docs/BEGINNER-GUIDE.md`](docs/BEGINNER-GUIDE.md).
