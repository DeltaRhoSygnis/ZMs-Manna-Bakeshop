# Web Development Laboratory - Presentation & Defense Guide
**Project:** ZM's Manna Bakeshop Website  
**Topic:** HTML5 Semantic Structure & Modular CSS Architecture  

---

## 1. Project Overview & Architecture

For our laboratory, we structured the website into a clean, multi-page layout and separated our CSS into dedicated stylesheets instead of putting everything into one massive file. 

### Folder Layout:
```text
lab-starter/
├── assets/                  -> Logo, banners, and product photos
├── css/
│   ├── global.css           -> Universal resets, grid system, and reusable UI components
│   ├── header-footer.css    -> Navigation bar, logo lockup, and footer
│   ├── home.css             -> Welcome banner, product cards, packaging, and gallery
│   └── wholesale.css        -> Wholesale desk, form controls, and distribution table
├── index.html               -> Main catalog and showcase page
└── wholesale.html           -> Wholesale ordering desk and logistics table
```

### Why we separated our CSS:
1. **Maintainability:** If we need to modify the navigation bar or footer, we only edit `header-footer.css` without risking any styling bugs on the rest of the page.
2. **Readability:** Each file focuses on a single responsibility, keeping line counts short and easy to audit.
3. **Reusability:** Common building blocks (like `.container`, `.btn`, and `.row`) in `global.css` are shared across both `index.html` and `wholesale.html`.

---

## 2. CSS Breakdown & Key Concepts

### A. `global.css` (Base Foundation & Layout System)

This stylesheet establishes the groundwork for the entire site.

#### 1. Universal Box-Sizing Reset
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```
* **Explanation for Defense:** By default, browsers add padding and borders outside an element's specified width, which breaks grid alignments. Using `box-sizing: border-box` forces padding and border widths to stay inside the calculated element box, making layout math predictable.

#### 2. The Centering Container
```css
.container {
  width: 90%;
  max-width: 1100px;
  margin: 0 auto;
}
```
* **Explanation:** Prevents wide screens from stretching content excessively. `margin: 0 auto` automatically centers the container block horizontally.

#### 3. Flexible Column Grid System (`.row`, `.col-*`)
```css
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.col-2 { flex: 1 1 45%; }
.col-3 { flex: 1 1 30%; }
.col-4 { flex: 1 1 22%; }
```
* **Explanation:** Instead of relying on rigid float layouts or complex table layouts, we used modern CSS Flexbox.
  * `display: flex` places child columns side by side.
  * `flex-wrap: wrap` permits items to drop onto a new line if screen space is insufficient.
  * `gap: 20px` gives clean, consistent gutters between cards without requiring manual margin overrides.
  * `.col-3` calculates to three equal columns per row for our product listings.

#### 4. Reusable UI Components (`.box`, `.btn`)
* `.box`: Provides a standard white card backdrop (`#ffffff`), a subtle border (`#cccccc`), rounded corners (`border-radius: 6px`), and padding (`20px`).
* `.btn-blue` & `.btn-white`: Consistent call-to-action buttons using the bakery's signature navy palette (`#0b2746`) with hover states.

---

### B. `header-footer.css` (Navigation & Site Anchors)

This file styles the top navigation bar and bottom site summary.

#### 1. Sticky Navigation Header
```css
header {
  background-color: #ffffff;
  border-bottom: 1px solid #cccccc;
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 10;
}
```
* **Explanation:** `position: sticky` and `top: 0` keep the navigation anchored at the top of the viewport when the user scrolls down through products, while `z-index: 10` ensures it layers above other elements.

#### 2. Semantic List-Based Menu
```css
nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
}
```
* **Explanation:** Navigation links are enclosed in standard unordered lists (`<ul>`, `<li>`), which is an industry accessibility best practice. We strip bullet points using `list-style: none` and align them horizontally using `display: flex`.

---

### C. `home.css` (Showcase & Product Components)

Contains styles specifically targeted at the main landing page.

#### 1. Main Welcome Banner (`.banner`)
```css
.banner {
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 6px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 30px;
}

.banner-text { flex: 1.2; }
.banner-image { flex: 1; }
```
* **Explanation:** Uses a two-column Flexbox split. The text column takes slightly more proportional space (`flex: 1.2`) than the product image (`flex: 1`), keeping the typography legible and balanced.

#### 2. Product Catalog Cards (`.product-box`)
```css
.product-box {
  display: flex;
  flex-direction: column;
}

.product-img {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img img {
  max-height: 160px;
  object-fit: contain;
}
```
* **Explanation:** Products vary slightly in packaging aspect ratio. Using `object-fit: contain` inside a fixed-height frame (`height: 180px`) ensures images scale neatly without distortion, pixelation, or uneven card heights.

#### 3. Responsive Image Handling
```css
img {
  max-width: 100%;
  display: block;
}
```
* **Explanation:** Prevents images from ever overflowing their parent containers.

---

### D. `wholesale.css` (Forms & Data Tables)

Styles the dedicated B2B wholesale desk on `wholesale.html`.

#### 1. Form Inputs & User Feedback
```css
.form-group input[type="text"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #cccccc;
  border-radius: 4px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0b2746;
}
```
* **Explanation:** Form fields take 100% width of their column for clean vertical flow. We styled the `:focus` state with the brand navy color (`#0b2746`) to provide clear visual feedback when a user is actively typing.

#### 2. Clean Semantic Logistics Table
```css
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  border: 1px solid #cccccc;
}

th {
  background-color: #f7f7f7;
  color: #0b2746;
  width: 30%;
}
```
* **Explanation:** Tables are the correct semantic choice for tabular data (delivery areas, lead times, MOQ). `border-collapse: collapse` combines adjacent double-borders into clean single lines.

---

## 3. Responsive Web Design (Media Queries)

All four files include clean `@media` queries targeting mobile screens (`max-width: 768px`):

```css
@media (max-width: 768px) {
  .col-2,
  .col-3,
  .col-4 {
    flex: 1 1 100%;
  }

  .banner,
  .packaging-box,
  .wholesale-row {
    flex-direction: column;
  }
}
```

* **Defense talking point:** "When viewed on a phone or small tablet screen, multi-column flex rows automatically stack vertically (`flex: 1 1 100%` and `flex-direction: column`). This ensures that cards, images, and form elements remain large, readable, and easy to tap without horizontal scrolling."

---

## 4. Key Questions & Rehearsed Answers

**Q1: Why did you split the website into two HTML pages instead of keeping it in one long page?**  
> *"Separating the customer-facing showcase (`index.html`) from the B2B wholesale desk and logistics data (`wholesale.html`) gives our website clear information architecture. Regular retail customers looking for pasalubong aren't overwhelmed with logistics tables, while wholesale buyers can navigate straight to the inquiry form."*

**Q2: What is the benefit of your naming convention over arbitrary utility classes?**  
> *"We adhered to semantic, functional class names based on standard page components—such as `.banner`, `.box`, `.product-box`, and `.btn-blue`. This makes our code straightforward to debug, easy to understand for any developer reading our source, and directly aligned with the visual wireframe."*

**Q3: How did you ensure consistent colors and styling?**  
> *"We standardized our color scheme around ZM's Manna Bakeshop's identity: deep navy (`#0b2746`) for headers, titles, and primary action buttons; crisp neutral grays (`#cccccc` and `#eeeeee`) for borders and backgrounds; and clean white (`#ffffff`) for elevated content cards."*
