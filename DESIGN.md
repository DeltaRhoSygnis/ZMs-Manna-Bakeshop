---
name: Warm Artisanal Commerce
colors:
  surface: '#FFFDF8'
  surface-dim: '#dedacf'
  surface-bright: '#fef9ee'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3e8'
  surface-container: '#f2ede3'
  surface-container-high: '#ede8dd'
  surface-container-highest: '#e7e2d7'
  on-surface: '#1d1c15'
  on-surface-variant: '#43474f'
  inverse-surface: '#323029'
  inverse-on-surface: '#f5f0e5'
  outline: '#737780'
  outline-variant: '#c3c6d0'
  surface-tint: '#3d608f'
  primary: '#00254a'
  on-primary: '#ffffff'
  primary-container: '#123b68'
  on-primary-container: '#84a6d9'
  inverse-primary: '#a6c8fe'
  secondary: '#765a00'
  on-secondary: '#ffffff'
  secondary-container: '#fece50'
  on-secondary-container: '#735800'
  tertiary: '#3a1e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#583100'
  on-tertiary-container: '#d79756'
  error: '#B42318'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a6c8fe'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#224875'
  secondary-fixed: '#ffdf96'
  secondary-fixed-dim: '#efc044'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4400'
  tertiary-fixed: '#ffdcbe'
  tertiary-fixed-dim: '#fdb874'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6a3c00'
  background: '#fef9ee'
  on-background: '#1d1c15'
  surface-variant: '#e7e2d7'
  canvas: '#F8F3E8'
  surface-blue: '#EAF1F8'
  ink: '#172033'
  ink-soft: '#4D5667'
  brand-navy-dark: '#0B2746'
  brand-blue: '#2C76A8'
  brand-gold-soft: '#F2DF9E'
  line: '#DED5C6'
  success: '#1D7042'
  on-navy: '#FFFFFF'
  on-gold: '#172033'
typography:
  display:
    fontFamily: Noto Serif
    fontSize: 4rem
    fontWeight: '700'
    lineHeight: '1'
  display-mobile:
    fontFamily: Noto Serif
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: '1.05'
  headline-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: '1.15'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: '1.15'
  headline-sm:
    fontFamily: DM Sans
    fontSize: 1.25rem
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: DM Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: DM Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: DM Sans
    fontSize: 0.875rem
    fontWeight: '700'
    lineHeight: '1.2'
  label-sm:
    fontFamily: DM Sans
    fontSize: 0.75rem
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 3.5rem
  margin-sm: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system expresses a warm, dependable, and product-focused presence for an established regional bakeshop. Operating at the intersection of local community trust and business-to-business distribution, the identity balances artisan bakery hospitality with crisp wholesale structure.

The design movement combines **warm editorial minimalism** with **tactile product packaging aesthetics**. The UI acts as a calm, well-lit digital display shelf. Deep foundational navy conveys regional supply reliability, while warm canvas surfaces, soft gold accents, and toasted biscuit tones evoke oven-fresh heritage. Spatial compositions prioritize clarity, generous negative space, unhurried typography, and authentic product presentation over gimmicky marketing embellishments.

## Colors

The color palette centers on functional hierarchy and high contrast:

- **Canvas & Surface**: Warm parchment tone (`#F8F3E8`) grounds the overall page canvas, paired with pure cream (`#FFFDF8`) on card surfaces to maintain natural separation without artificial harshness.
- **Brand Navy (`#123B68`)**: The dominant structural color used for primary navigation, core CTAs, display typography anchors, and full-bleed inquiry containers. Provides institutional stability.
- **Brand Gold (`#D2A62A`)**: Used selectively for primary commerce intents, category pills, price tags, and secondary action triggers. Must strictly take dark ink (`#172033`) typography for WCAG AA compliance. Never use gold as body text.
- **Biscuit (`#C98B4B`)**: Serves as a tertiary culinary accent for packaging borders, bakery badges, and subtle dividers.
- **Ink Tiers**: `#172033` provides deep contrast for copy, while `#4D5667` delivers secondary metadata hierarchy without falling below accessible contrast ratios.

## Typography

The typographic system pairs an authoritative, literary serif for major story landmarks with an engineered, low-contrast geometric sans-serif for product metadata, cards, and data clarity:

- **Display & Headings**: Rendered in **Noto Serif** (substituting editorial classic serifs like Fraunces or Georgia) to ground the product line in tangible craftsmanship and time-tested presence. Display headlines use tighter line-height and restrained letter tracking.
- **Interface & Catalog**: Built entirely on **DM Sans** across regular, medium, and bold weights. This ensures high legibility on package labels, specification matrices, pricing badges, and contact forms.
- **Labels & Micro-copy**: Set in uppercase **DM Sans** with tracking at `+0.08em` for categorization markers like `BISCUITS`, `PASALUBONG`, and `WHOLESALE`.

## Layout & Spacing

The layout is built upon a balanced 12-column responsive fluid grid bounded at a maximum container width of `1240px`:

- **Desktop (>= 1024px)**: Outer margins are `3.5rem` (56px) to `4.5rem` (72px) with `1.5rem` (24px) gutters. Section dividers feature breathing space between `5rem` and `7.5rem` (80px–120px) to establish catalog focus.
- **Tablet (768px – 1023px)**: 8-column layout with `2rem` (32px) margins and `1.25rem` (20px) gutters.
- **Mobile (< 768px)**: 4-column layout with `1.25rem` (20px) margins and `1rem` (16px) gutters. Tap targets extend across full row widths where appropriate.

Layouts avoid cluttered multi-tier dashboards in favor of horizontal product pacing and calm narrative blocks.

## Elevation & Depth

Visual hierarchy relies on structural surfaces and subtle ambient shadows rather than stark layered drop shadows:

- **Surface Tiers**: Base backdrop sits on warm canvas (`#F8F3E8`). Content containers rise to clean cream (`#FFFDF8`). Segmented commercial blocks (such as B2B buyer pathways) use muted blue tint (`#EAF1F8`), and high-emphasis inquiry sections occupy deep `#123B68`.
- **Borders & Dividers**: Flat separation relies primarily on crisp structural line borders (`#DED5C6` at 1px thickness) instead of heavy shadows.
- **Ambient Shadows**: For elevated floating cards and hover feedback, depth is conveyed using an ultra-soft brand-tinted shadow: `0 12px 32px rgba(18, 59, 104, 0.08)`. This creates a tactile elevation without creating harsh digital artifacts.

## Shapes

The shape system employs roundedness level **2** (`0.5rem` / 8px base radius, `1rem` / 16px medium radius, and `1.5rem` / 24px large radius) complemented by full pill shapes for interactive elements:

- **Cards & Image Containers**: Set to `1rem` (16px) corner radius to give packaging containers an organic, shelf-like quality.
- **Inquiry & Hero Panels**: Set to `1.5rem` (24px) corner radius for visual containment.
- **Interactive Controls**: Buttons, badges, and status pills strictly utilize complete pill shaping (`999px`) to invite immediate touch interaction and distinguish clickable elements from rectangular content containers.
- **Form Inputs**: Employ `0.5rem` (8px) corner radius to balance clean alignment with soft readability.

## Components

### Buttons
- **Primary Action**: Deep navy (`#123B68`) background, white text (`#FFFFFF`), full pill radius (`999px`), height `48px`, horizontal padding `1.5rem`. Used for top actions like `View Products` and `Submit Inquiry`.
- **Secondary Action**: Warm gold (`#D2A62A`) background, ink text (`#172033`), full pill radius, height `48px`, horizontal padding `1.5rem`. Used for `Request Price List`.
- **Outline Action**: Transparent background with 1.5px solid navy border (`#123B68`), navy text, pill radius.

### Cards
- **Product Card**: Background `#FFFDF8`, 1px border `#DED5C6`, border radius `1rem`, internal padding `1rem`. Houses a centered packaging photo with `#F2DF9E` accent backdrop, followed by title in bold sans-serif, description in `#4D5667`, pack size badge, and a gold ghost action button.
- **Buyer Pathway Card**: Background `#EAF1F8`, radius `1rem`, padding `1.5rem`. Crisp heading, single descriptive paragraph, and an arrow link in navy.

### Chips & Badges
- **Category Badge**: Full pill container, subtle biscuit or gold-soft fill (`#F2DF9E`), ink text (`#172033`), uppercase font size `0.75rem`, letter spacing `0.08em`.

### Form Controls
- **Input Fields**: Background `#FFFFFF`, border 1.5px `#DED5C6`, radius `0.5rem`, height `48px`, padding `0 1rem`. Focus state features a solid 2px outline in `#123B68`. Labels are always visible above inputs in bold sans-serif `#172033`.
- **Checkboxes & Radios**: Brand navy accent with 2px stroke, maintaining clear visual indicators for multi-item wholesale inquiries.

### Inquiry Panel
- Full-bleed or inset card with `#123B68` background, `#FFFFFF` typography, `1.5rem` radius, and structured spacing of `3rem` internal padding. Contrast is strictly preserved with cream form fields inset within.