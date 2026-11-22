/* =========================================================
   ZM'S MANNA — the interaction layer

   This file adds behaviour to the page in index.html.
   It is plain JavaScript: no frameworks, no libraries.

   HOW THE TWO LAYERS FIT TOGETHER
   JavaScript never styles anything. It changes *state* —
   it adds a class name to an element, or sets a CSS custom
   property — and the stylesheet reacts to that state.
   The whole contract is written down in the JS/CSS bridge notes
   kept in the local archive (.archive/docs/JS-CSS-BRIDGE.md).

   A NOTE ON ORDER
   index.html loads this file with `defer`, which means the
   whole page has already been read by the browser before
   this file runs. So we can look up elements straight away
   — there is no need to wait for a "page is ready" event.
   ========================================================= */

/* =========================================================
   1. SMALL HELPERS
   ========================================================= */

/* Finds the first element that matches the selector.
   You can also look inside a particular element:
   findElement(".modal-close", popup) */
function findElement(selector, parent) {
  return (parent || document).querySelector(selector);
}

/* Finds every element that matches the selector, as a list.
   You can also look inside a particular element:
   findElements(".product-card", grid) */
function findElements(selector, parent) {
  return Array.from((parent || document).querySelectorAll(selector));
}

/* Does the visitor's device want less movement? Some people
   get motion sickness from animations, so they ask the
   operating system to turn them down. */
const userPrefersLessMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Does the visitor have a real mouse or trackpad? Touch
   screens do not have a pointer to follow, so the little
   mouse effects are skipped on phones. */
const userHasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* =========================================================
   2. SITE DATA — edit this part

   This is the content of the site. Changing a product name,
   a photo, or a colour happens here and nowhere else.
   ========================================================= */

/* The few site-wide settings. */
const SITE_CONFIG = {
  // TODO: replace this with the real Facebook page URL
  facebook: "https://www.facebook.com/search/top?q=Zm%27s%20Manna%20Bakeshop"
};

/* The six products. Each one becomes a card on the page. */
const PRODUCTS = [
<<<<<<< HEAD
  { id:"cookie-de-longa", name:"Cookie de Longa", cat:"cookies", catLabel:"Cookies & Biscuits", tag:"Sesame cookie sandwich",
=======
  { id:"cookie-de-longa", name:"Cookie de Longa", hook:"Sesame cookie sandwiches with a soft caramel centre", cat:"cookies", catLabel:"Cookies & Biscuits", tag:"Sesame cookie sandwich",
>>>>>>> 4dcacea4060d42f8ebc1886ae37d1a7c60e6636f
    img:"assets/CookieDeLonga.webp", gradientFrom:"#E8C07D", gradientTo:"#B4691E", letters:"CdL",
    desc:"Sesame-topped round cookie sandwiches with a sweet signature filling.",
    texture:"Crumbly outside, soft sweet center", notes:"Toasted sesame, butter, caramel sugar",
    pair:"Barako coffee or warm milk", pack:"100 g heat-sealed pouch", keep:"Cool, dry place — reseal after opening" },
<<<<<<< HEAD
  { id:"biscocho", name:"Biscocho", cat:"toasted", catLabel:"Toasted Specialties", tag:"Top seller",
=======
  { id:"biscocho", name:"Biscocho", hook:"Twice-baked bread with a glassy sugar crust", cat:"toasted", catLabel:"Toasted Specialties", tag:"Top seller",
>>>>>>> 4dcacea4060d42f8ebc1886ae37d1a7c60e6636f
    img:"assets/Biscocho.webp", gradientFrom:"#D9A05B", gradientTo:"#8C4A1F", letters:"B",
    desc:"Twice-baked crispy bread slices glazed with butter and sugar.",
    texture:"Deep crunch, glassy sugar crust", notes:"Butter, toasted sugar, golden bread",
    pair:"Morning coffee or hot tsokolate", pack:"100 g heat-sealed pouch", keep:"Keep sealed to protect the crunch" },
<<<<<<< HEAD
  { id:"toasted-mammon", name:"Toasted Mammon", cat:"toasted", catLabel:"Toasted Specialties", tag:"Light & airy",
=======
  { id:"toasted-mammon", name:"Toasted Mammon", hook:"Slow-toasted sponge with an airy crunch", cat:"toasted", catLabel:"Toasted Specialties", tag:"Light & airy",
>>>>>>> 4dcacea4060d42f8ebc1886ae37d1a7c60e6636f
    img:"assets/Mammon.webp", gradientFrom:"#F0D9A8", gradientTo:"#C98F3D", letters:"M",
    desc:"Light sponge cake slices slow-toasted for an airy, crispy crunch.",
    texture:"Airy, melt-away crisp", notes:"Vanilla sponge, light caramel",
    pair:"Afternoon tea or kape", pack:"100 g heat-sealed pouch", keep:"Away from humidity, reseal tightly" },
<<<<<<< HEAD
  { id:"patatas", name:"Patatas", cat:"cookies", catLabel:"Cookies & Biscuits", tag:"Coffee pairing",
=======
  { id:"patatas", name:"Patatas", hook:"Savory-sweet biscuit batons for black coffee", cat:"cookies", catLabel:"Cookies & Biscuits", tag:"Coffee pairing",
>>>>>>> 4dcacea4060d42f8ebc1886ae37d1a7c60e6636f
    img:"assets/Patatas.webp", gradientFrom:"#E3B778", gradientTo:"#A05C22", letters:"P",
    desc:"Finger-style crunchy biscuit batons with a savory-sweet taste.",
    texture:"Firm snap, fine crumb", notes:"Buttery, lightly sweet, hint of salt",
    pair:"Black coffee — merienda classic", pack:"100 g heat-sealed pouch", keep:"Cool, dry shelf; reseal after opening" },
<<<<<<< HEAD
  { id:"hopia-choco", name:"Hopia Choco", cat:"pastry", catLabel:"Pastry & Bread", tag:"Rich filling",
=======
  { id:"hopia-choco", name:"Hopia Choco", hook:"Flaky pockets packed with chocolate bean paste", cat:"pastry", catLabel:"Pastry & Bread", tag:"Rich filling",
>>>>>>> 4dcacea4060d42f8ebc1886ae37d1a7c60e6636f
    img:"assets/Hopia.webp", gradientFrom:"#9A6A45", gradientTo:"#4A2C17", letters:"H",
    desc:"Flaky crust pockets filled with rich chocolate sweet bean paste.",
    texture:"Layered flaky shell, dense fudgy core", notes:"Cocoa, sweet bean paste, pastry",
    pair:"Warm milk or afternoon kape", pack:"100 g heat-sealed pouch", keep:"Cool, dry place away from sunlight" },
<<<<<<< HEAD
  { id:"otap-loaf", name:"Otap & Loaf Breads", cat:"pastry", catLabel:"Pastry & Bread", tag:"Specialty line",
=======
  { id:"otap-loaf", name:"Otap & Loaf Breads", hook:"Crisp otap puffs and soft sliced loaves", cat:"pastry", catLabel:"Pastry & Bread", tag:"Specialty line",
>>>>>>> 4dcacea4060d42f8ebc1886ae37d1a7c60e6636f
    img:"assets/ZmsLogo.webp", fit:"contained", gradientFrom:"#EAD3A2", gradientTo:"#B98A44", letters:"O",
    desc:"Crisp oval puff biscuits and soft sliced loaves for breakfast and merienda.",
    texture:"Shatter-crisp otap, pillowy loaf", notes:"Puff pastry sugar / soft milk bread",
    pair:"Breakfast spreads, butter, or jam", pack:"Standard specialty packs", keep:"Loaves best fresh; otap keeps sealed" }
];

/* The six photos the big photo viewer can show. */
const PHOTOS = [
  { src:"assets/CookieDeLonga.webp", cap:"Cookie de Longa", gradientFrom:"#E8C07D", gradientTo:"#B4691E", letters:"CdL" },
  { src:"assets/Biscocho.webp", cap:"Toasted Biscocho", gradientFrom:"#D9A05B", gradientTo:"#8C4A1F", letters:"B" },
  { src:"assets/Mammon.webp", cap:"Toasted Mammon", gradientFrom:"#F0D9A8", gradientTo:"#C98F3D", letters:"M" },
  { src:"assets/Patatas.webp", cap:"Patatas Biscuits", gradientFrom:"#E3B778", gradientTo:"#A05C22", letters:"P" },
  { src:"assets/Hopia.webp", cap:"Hopia Choco", gradientFrom:"#9A6A45", gradientTo:"#4A2C17", letters:"H" },
  { src:"assets/BiscochoNice.webp", cap:"Biscocho on Dark Wood", gradientFrom:"#6B4226", gradientTo:"#2B1708", letters:"B" }
];

/* =========================================================
<<<<<<< HEAD
   3. DRAW THE PRODUCT CARDS

   The page starts with an empty box where the products go.
   This builds the cards and puts them in it.
   ========================================================= */

/* Builds one card for each product and puts them in the grid. */
function buildProductTiles() {
  const productGrid = findElement("#product-grid");

  productGrid.innerHTML = PRODUCTS.map(function (product, index) {
    // The colours are written into the card as CSS custom properties, so
    // the stylesheet can use them for the background gradient.
    const gradient = "--gradient-from:" + product.gradientFrom + ";" +
                     "--gradient-to:" + product.gradientTo + ";";

    return `
    <button class="product-card${product.fit ? " is-logo" : ""}" data-id="${product.id}" data-reveal data-delay="${(index % 3) * 90}"
      style="${gradient}" aria-haspopup="dialog" aria-label="View details: ${product.name}">
      <span class="fallback-text" aria-hidden="true">${product.letters}</span>
      <img src="${product.img}" class="${product.fit ? "is-contained" : ""}" alt="${product.name}" loading="lazy" decoding="async">
      <span class="product-caption">${product.name}</span>
    </button>`;
  }).join("");

  // Now that the cards exist, give each one a click handler.
  for (const card of findElements(".product-card")) {
    card.addEventListener("click", function () {
      openProductPopup(card.dataset.id);
    });
  }

  // Every photo needs a fallback ready in case it cannot load.
  for (const image of findElements(".product-card img, .banner-image img")) {
    handleBrokenImage(image);
  }
=======
   3. DRAW THE COUNTER

   The page starts with one empty counter. This fills it with a
   single product and wires up the two arrows that step through
   the rest.
   ========================================================= */

/* Everything the counter writes into. */
const counterBand = findElement("#counter-band");
const counterImage = findElement("#counter-image");
const counterCategory = findElement("#counter-cat");
const counterName = findElement("#counter-name");
const counterHook = findElement("#counter-hook");
const counterIndex = findElement("#counter-index");
const counterDescription = findElement("#counter-description");
const counterFacts = findElement("#counter-facts");

/* Which product the counter is showing right now. */
let counterPosition = 0;

/* Shows one product in the counter.
   The number can be any integer and it wraps round, so the back arrow
   on the first product lands on the last one instead of stopping. */
function showCounterProduct(position) {
  const total = PRODUCTS.length;
  counterPosition = ((position % total) + total) % total;

  const product = PRODUCTS[counterPosition];

  counterCategory.textContent = product.catLabel;
  counterName.textContent = product.name;
  counterHook.textContent = "“" + (product.hook || product.desc) + "”";
  counterDescription.textContent = product.desc + " " + product.texture + ".";
  counterIndex.textContent = String(counterPosition + 1).padStart(2, "0");

  // The photo, with a fallback ready in case it cannot load.
  counterBand.classList.remove("image-missing");
  counterImage.onerror = function () {
    counterBand.classList.add("image-missing");
  };
  counterImage.classList.toggle("is-contained", Boolean(product.fit));
  counterImage.src = product.img;
  counterImage.alt = product.name + " from Zm’s Manna, in its clear pouch.";

  // The three short facts under the photo.
  const pairing = product.pair.charAt(0).toLowerCase() + product.pair.slice(1);
  counterFacts.innerHTML = [product.pack, "Best with " + pairing, "DTI-labelled, barcoded"]
    .map(function (fact) { return "<span>" + fact + "</span>"; })
    .join("");

  // Restart the fade, so it plays on every swap and not just the first.
  counterBand.classList.remove("is-changing");
  void counterBand.offsetWidth;
  counterBand.classList.add("is-changing");
}

/* Wires the two arrows, the "read the full notes" button, and the
   left and right arrow keys while the counter has the focus. */
function setupCounter() {
  findElement("#counter-total").textContent = String(PRODUCTS.length).padStart(2, "0");

  findElement("#counter-back").addEventListener("click", function () {
    showCounterProduct(counterPosition - 1);
  });
  findElement("#counter-forward").addEventListener("click", function () {
    showCounterProduct(counterPosition + 1);
  });
  findElement("#counter-more").addEventListener("click", function () {
    openProductPopup(PRODUCTS[counterPosition].id);
  });

  document.addEventListener("keydown", function (event) {
    if (productModal.classList.contains("is-open")) return;
    if (!counterBand.contains(document.activeElement)) return;
    if (event.key === "ArrowRight") { showCounterProduct(counterPosition + 1); event.preventDefault(); }
    if (event.key === "ArrowLeft") { showCounterProduct(counterPosition - 1); event.preventDefault(); }
  });

  showCounterProduct(0);
>>>>>>> 4dcacea4060d42f8ebc1886ae37d1a7c60e6636f
}

/* If a photo cannot load, show the letters instead.
   The CSS hides the broken image and reveals the letters. */
function handleBrokenImage(image) {
  function showLetters() {
    image.parentElement.classList.add("image-missing");
  }
  image.addEventListener("error", showLetters, { once: true });

  // An image that already failed before this ran never fires "error",
  // so check for that case as well.
  if (image.complete && image.naturalWidth === 0 && image.src) {
    showLetters();
  }
}

/* =========================================================
   4. APPLY THE SETTINGS

   A few small things that come from SITE_CONFIG.
   ========================================================= */

/* Sets the Facebook links and the year.
   The banner photo is not set here: it lives in a <picture> element in
   index.html, which picks the right image for the screen size. */
function applySiteSettings() {
  for (const link of findElements("[data-fb]")) {
    link.href = SITE_CONFIG.facebook;
  }

  findElement("#year").textContent = new Date().getFullYear();
}

/* =========================================================
   5. REVEAL THINGS AS YOU SCROLL

   Some parts of the page start hidden and fade in when you
   scroll to them. An IntersectionObserver watches for that.
   ========================================================= */

/* Watches for elements that scroll into view and reveals them. */
function setupScrollReveal() {
  const revealObserver = new IntersectionObserver(function (entries) {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);   // reveal it once, then stop watching
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  for (const element of findElements("[data-reveal]")) {
    // data-delay is a number of milliseconds to wait before revealing.
    if (element.dataset.delay) {
      element.style.transitionDelay = element.dataset.delay + "ms";
    }
    revealObserver.observe(element);
  }
}

/* =========================================================
   6. COUNT UP THE STATISTICS

   The numbers in the story section count up from zero when
   they scroll into view.
   ========================================================= */

/* Watches for the numbers and counts them up. */
function setupAnimatedCounters() {
  const counterObserver = new IntersectionObserver(function (entries) {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      counterObserver.unobserve(entry.target);

      const element = entry.target;
      const finalNumber = Number(element.dataset.count);
      const suffix = element.dataset.suffix || "";

      // If the visitor wants less motion, show the number straight away.
      if (userPrefersLessMotion) {
        element.textContent = finalNumber + suffix;
        return;
      }

      const startedAt = performance.now();
      const duration = 1400;

      function tick(now) {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(finalNumber * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });

  for (const element of findElements("[data-count]")) {
    counterObserver.observe(element);
  }
}

/* =========================================================
   7. THE HEADER, THE PROGRESS BAR AND BACK-TO-TOP

   Three things that change while you scroll.
   ========================================================= */

/* Wires up the header, the scroll bar and the back-to-top button. */
function setupScrollChrome() {
  const navBar = findElement("#navbar");
  const progressBar = findElement("#progress-bar");
  const backToTop = findElement("#back-to-top");

  let lastScrollY = 0;
  let waitingForFrame = false;

  function onScroll() {
    const currentY = window.scrollY;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

    // the thin bar across the top shows how far down the page you are
    const percentage = scrollableHeight > 0 ? (currentY / scrollableHeight) * 100 : 0;
    progressBar.style.width = percentage + "%";

    // the header slides away when you scroll down, and comes back when
    // you scroll up
    navBar.classList.toggle("is-hidden", currentY > 220 && currentY > lastScrollY);
    lastScrollY = currentY;

    // the back-to-top button appears once you are a way down the page
    backToTop.classList.toggle("is-shown", currentY > 600);

    waitingForFrame = false;
  }

  // requestAnimationFrame runs this once per frame, so scrolling stays
  // smooth no matter how many scroll events fire.
  window.addEventListener("scroll", function () {
    if (waitingForFrame) return;
    waitingForFrame = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });

  onScroll();

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: userPrefersLessMotion ? "auto" : "smooth" });
  });
}

/* =========================================================
   8. THE FULL-SCREEN MENU
   ========================================================= */

<<<<<<< HEAD
/* The menu button, the menu itself, and whether the menu is open. */
const menuButton = findElement("#menu-button");
const mobileMenu = findElement("#mobile-menu");
let menuIsOpen = false;

/* Opens or closes the menu. */
function setMenuOpen(open) {
  menuIsOpen = open;

  // the three bars fold into an X
  menuButton.classList.toggle("is-active", open);
  menuButton.setAttribute("aria-expanded", String(open));

  // the menu fades in
  mobileMenu.classList.toggle("is-open", open);
  // visibility is set here as well as in CSS, so the links leave the
  // tab order the instant the menu closes
  mobileMenu.style.visibility = open ? "visible" : "";
  mobileMenu.setAttribute("aria-hidden", String(!open));

  // the page behind the menu stops scrolling
  document.body.classList.toggle("scroll-locked", open);

  // move the keyboard focus into the menu
  if (open) {
    const firstLink = findElement("a", mobileMenu);
    if (firstLink) firstLink.focus();
  }
}

/* Wires up the menu button and the links inside the menu. */
function setupMobileMenu() {
  menuButton.addEventListener("click", function () {
    setMenuOpen(!menuIsOpen);
  });

  for (const link of findElements("a", mobileMenu)) {
    link.addEventListener("click", function () {
      setMenuOpen(false);
    });
  }
}

=======
>>>>>>> 4dcacea4060d42f8ebc1886ae37d1a7c60e6636f
/* =========================================================
   9. THE PRODUCT POPUP

   Clicking a product card opens a popup with the details.
   ========================================================= */

/* The popup itself, and where the keyboard focus was before it opened. */
const productModal = findElement("#product-modal");
let productPopupPreviouslyFocused = null;

/* Keeps the Tab key inside the popup, so it cannot wander off
   to the page behind it. */
function keepFocusInside(event, box) {
  if (event.key !== "Tab") return;

  // every element inside the box that can be focused
  const focusable = findElements(
    "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])", box
  ).filter(function (element) {
    return element.offsetParent !== null;    // skip anything invisible
  });
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  // Tab from the last one wraps to the first, and Shift+Tab from the
  // first wraps to the last.
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* Opens the popup for one product. */
function openProductPopup(productId) {
  const product = PRODUCTS.find(function (item) {
    return item.id === productId;
  });
  if (!product) return;

  // remember where the keyboard focus was, so we can put it back
  productPopupPreviouslyFocused = document.activeElement;

  const media = findElement(".modal-media", productModal);
  media.style.setProperty("--gradient-from", product.gradientFrom);
  media.style.setProperty("--gradient-to", product.gradientTo);
  media.classList.toggle("is-logo", Boolean(product.fit));
  media.innerHTML = `
    <span class="fallback-text">${product.letters}</span>
    <img src="${product.img}" class="${product.fit ? "is-contained" : ""}" alt="${product.name}" decoding="async">`;
  handleBrokenImage(findElement("img", media));

  // find the matching photo, so the popup can offer "View full image"
  const photoIndex = PHOTOS.findIndex(function (photo) {
    return photo.src === product.img;
  });

  const viewFullImage = photoIndex > -1
    ? `<button class="btn btn-secondary" data-gl="${photoIndex}">View full image <span class="btn-arrow">→</span></button>`
    : "";

  findElement(".modal-info", productModal).innerHTML = `
    <span class="tag">${product.catLabel}</span>
    <h3 id="modal-title">${product.name}</h3>
    <p class="modal-description">${product.desc}</p>
    <dl class="spec">
      <div><dt>Texture</dt><dd>${product.texture}</dd></div>
      <div><dt>Flavor notes</dt><dd>${product.notes}</dd></div>
      <div><dt>Best enjoyed with</dt><dd>${product.pair}</dd></div>
      <div><dt>Pack</dt><dd>${product.pack}</dd></div>
      <div><dt>Keeping it fresh</dt><dd>${product.keep}</dd></div>
    </dl>
    <p class="modal-note">Baked in small batches and stocked daily at the bakehouse and partner counters around Bukidnon.</p>
    ${viewFullImage}`;

  productModal.classList.add("is-open");
  // visibility is set here as well as in CSS, so the close button can be
  // focused straight away instead of waiting for the fade
  productModal.style.visibility = "visible";
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("scroll-locked");

  findElement(".modal-close", productModal).focus();
}

/* Closes the product popup. */
function closeProductPopup() {
  // put the keyboard focus back where it came from
  if (productPopupPreviouslyFocused) productPopupPreviouslyFocused.focus();

  productModal.classList.remove("is-open");
  productModal.style.visibility = "";
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("scroll-locked");
}

/* Wires up the clicks inside the popup: the close button, the backdrop,
   and the "View full image" button. */
function setupProductPopup() {
  productModal.addEventListener("click", function (event) {
    // "View full image" — close the popup and open the photo viewer
    const viewFullImage = event.target.closest("[data-gl]");
    if (viewFullImage) {
      closeProductPopup();
      openPhotoViewer(Number(viewFullImage.dataset.gl));
      return;
    }

    // the close button, or a click on the backdrop behind the box
    if (event.target === productModal || event.target.closest(".modal-close")) {
      closeProductPopup();
    }
  });
}

/* =========================================================
   10. THE PHOTO VIEWER

   The big overlay that shows one photo at a time.
   ========================================================= */

/* The viewer itself, which photo it is showing, and where the keyboard
   focus was before it opened. */
const photoViewer = findElement("#photo-viewer");
let currentPhotoIndex = 0;
let photoViewerPreviouslyFocused = null;

/* Puts the current photo into the viewer. */
function showCurrentPhoto() {
  const photo = PHOTOS[currentPhotoIndex];
  const image = findElement(".photo-image", photoViewer);

  image.style.display = "";
  image.src = photo.src;
  image.alt = photo.cap;

  findElement(".photo-caption", photoViewer).textContent = photo.cap;
  findElement(".photo-counter", photoViewer).textContent = (currentPhotoIndex + 1) + " / " + PHOTOS.length;

  findElement(".photo-frame", photoViewer).style.background =
    "linear-gradient(135deg, " + photo.gradientFrom + ", " + photo.gradientTo + ")";
}

/* Opens the viewer on one photo. */
function openPhotoViewer(index) {
  photoViewerPreviouslyFocused = document.activeElement;
  currentPhotoIndex = index;
  showCurrentPhoto();

  photoViewer.classList.add("is-open");
  photoViewer.style.visibility = "visible";
  photoViewer.setAttribute("aria-hidden", "false");
  document.body.classList.add("scroll-locked");

  findElement(".photo-close", photoViewer).focus();
}

/* Closes the viewer. */
function closePhotoViewer() {
  if (photoViewerPreviouslyFocused) photoViewerPreviouslyFocused.focus();

  photoViewer.classList.remove("is-open");
  photoViewer.style.visibility = "";
  photoViewer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("scroll-locked");
}

/* Moves to the next or the previous photo, wrapping around at the ends. */
function showNextPhoto(direction) {
  currentPhotoIndex = (currentPhotoIndex + direction + PHOTOS.length) % PHOTOS.length;
  showCurrentPhoto();
}

/* Wires up the clicks inside the photo viewer: the arrows, the close
   button and the backdrop. */
function setupPhotoViewer() {
  // a photo that fails to load should not leave a broken image behind
  findElement(".photo-image", photoViewer).addEventListener("error", function (event) {
    event.target.style.display = "none";
  });

  findElement(".photo-prev", photoViewer).addEventListener("click", function () {
    showNextPhoto(-1);
  });
  findElement(".photo-next", photoViewer).addEventListener("click", function () {
    showNextPhoto(1);
  });

  photoViewer.addEventListener("click", function (event) {
    // the close button, or a click on the backdrop around the photo
    if (event.target === photoViewer || event.target.closest(".photo-close")) {
      closePhotoViewer();
    }
  });
}

/* =========================================================
   11. KEYBOARD CONTROLS

   Escape closes whatever is open. The arrow keys move through
   the photos.
   ========================================================= */

/* Sets up one keyboard handler for the whole page. */
function setupKeyboardControls() {
  document.addEventListener("keydown", function (event) {
    if (photoViewer.classList.contains("is-open")) {
      if (event.key === "Escape") closePhotoViewer();
      else if (event.key === "ArrowRight") showNextPhoto(1);
      else if (event.key === "ArrowLeft") showNextPhoto(-1);
      else keepFocusInside(event, photoViewer);
    } else if (productModal.classList.contains("is-open")) {
      if (event.key === "Escape") closeProductPopup();
      else keepFocusInside(event, productModal);
<<<<<<< HEAD
    } else if (menuIsOpen) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        findElement("#menu-button").focus();
      } else {
        keepFocusInside(event, findElement("#mobile-menu"));
      }
=======
>>>>>>> 4dcacea4060d42f8ebc1886ae37d1a7c60e6636f
    }
  });
}

/* =========================================================
   12. SMALL MOUSE EFFECTS

   Only for visitors with a real mouse, and only when they have
   not asked for less motion.
   ========================================================= */

/* Makes the buttons drift gently towards the pointer. */
function setupMouseEffects() {
  if (!userHasMouse || userPrefersLessMotion) return;

  for (const button of findElements(".btn")) {
    button.addEventListener("pointermove", function (event) {
      const box = button.getBoundingClientRect();
      const offsetX = ((event.clientX - box.left) / box.width - 0.5) * 8;
      const offsetY = ((event.clientY - box.top) / box.height - 0.5) * 8;
      button.style.transform = "translate(" + offsetX.toFixed(1) + "px, " + offsetY.toFixed(1) + "px)";
    });
    button.addEventListener("pointerleave", function () {
      button.style.transform = "";
    });
  }
}

/* =========================================================
   13. RUN EVERYTHING

<<<<<<< HEAD
   The order matters for one reason: the product cards have to
   be built first, because setupScrollReveal() can only reveal
   cards that already exist in the page.
   ========================================================= */
buildProductTiles();
=======
   The order matters for one reason: the counter has to be filled
   first, because setupScrollReveal() can only reveal things that
   already exist in the page.
   ========================================================= */
setupCounter();
>>>>>>> 4dcacea4060d42f8ebc1886ae37d1a7c60e6636f
applySiteSettings();
setupScrollReveal();
setupAnimatedCounters();
setupScrollChrome();
<<<<<<< HEAD
setupMobileMenu();
=======
>>>>>>> 4dcacea4060d42f8ebc1886ae37d1a7c60e6636f
setupProductPopup();
setupPhotoViewer();
setupKeyboardControls();
setupMouseEffects();
