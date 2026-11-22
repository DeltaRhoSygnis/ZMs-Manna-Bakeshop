/* ==========================================
   catalog.js
   1. PRODUCTS — the six packs and their notes
   2. The product popup (openProductPopup / closeProductPopup)
   3. The looping product carousel
   ========================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. THE SIX PACKS
     Same shape as the archived interaction layer
     (.archive/app.js): catLabel, gradientFrom, gradientTo, letters.
     The popup reads the notes from here.
     --------------------------------------------------------------- */

  var PRODUCTS = [
    {
      id: 'toasted-biscocho',
      name: 'Toasted Biscocho',
      catLabel: 'Toasted specialties',
      desc: 'Twice-baked crispy bread slices glazed with butter and sugar.',
      texture: 'Deep crunch, glassy sugar crust',
      notes: 'Butter, toasted sugar, golden bread',
      pair: 'Morning coffee or hot tsokolate',
      pack: '100 g heat-sealed pouch',
      keep: 'Keep sealed to protect the crunch',
      img: 'assets/orig/Biscocho.webp',
      gradientFrom: '#D9A05B',
      gradientTo: '#8C4A1F',
      letters: 'B'
    },
    {
      id: 'hopia-choco',
      name: 'Hopia Choco',
      catLabel: 'Chocolate-filled',
      desc: 'Flaky crust pockets filled with rich chocolate sweet bean paste.',
      texture: 'Layered flaky shell, dense fudgy core',
      notes: 'Cocoa, sweet bean paste, pastry',
      pair: 'Warm milk or afternoon kape',
      pack: '100 g heat-sealed pouch',
      keep: 'Cool, dry place away from sunlight',
      img: 'assets/orig/Hopia.webp',
      gradientFrom: '#9A6A45',
      gradientTo: '#4A2C17',
      letters: 'H'
    },
    {
      id: 'toasted-mammon',
      name: 'Toasted Mammon',
      catLabel: 'Toasted specialties',
      desc: 'Light sponge cake slices slow-toasted for an airy, crispy crunch.',
      texture: 'Airy, melt-away crisp',
      notes: 'Vanilla sponge, light caramel',
      pair: 'Afternoon tea or kape',
      pack: '100 g heat-sealed pouch',
      keep: 'Away from humidity, reseal tightly',
      img: 'assets/orig/Mammon.webp',
      gradientFrom: '#F0D9A8',
      gradientTo: '#C98F3D',
      letters: 'M'
    },
    {
      id: 'patatas',
      name: 'Patatas Biscuits',
      catLabel: 'Crisp &amp; light',
      desc: 'Finger-style crunchy biscuit batons with a savory-sweet taste.',
      texture: 'Firm snap, fine crumb',
      notes: 'Buttery, lightly sweet, hint of salt',
      pair: 'Black coffee — a merienda classic',
      pack: '100 g heat-sealed pouch',
      keep: 'Cool, dry shelf; reseal after opening',
      img: 'assets/orig/Patatas.webp',
      gradientFrom: '#E3B778',
      gradientTo: '#A05C22',
      letters: 'P'
    },
    {
      id: 'cookie-de-longa',
      name: 'Cookie de Longa',
      catLabel: 'Sesame cookies',
      desc: 'Sesame-topped round cookie sandwiches with a sweet signature filling.',
      texture: 'Crumbly outside, soft sweet centre',
      notes: 'Toasted sesame, butter, caramel sugar',
      pair: 'Barako coffee or warm milk',
      pack: '100 g heat-sealed pouch',
      keep: 'Cool, dry place — reseal after opening',
      img: 'assets/orig/Cookie-de-longga.jpeg',
      gradientFrom: '#E8C07D',
      gradientTo: '#B4691E',
      letters: 'CdL'
    },
    {
      id: 'special-biscocho',
      name: 'Special Biscocho',
      catLabel: 'Toasted specialties',
      desc: 'Our special-cut biscocho — thicker slices, a deeper butter-and-sugar glaze, and one extra pass through the oven.',
      texture: 'Thick crunch, caramelised sugar shell',
      notes: 'Butter, muscovado sugar, toasted bread',
      pair: 'Hot chocolate or barako coffee',
      pack: '100 g heat-sealed pouch',
      keep: 'Keep sealed to protect the crunch',
      img: 'assets/orig/Biscocho2.webp',
      gradientFrom: '#C98F3D',
      gradientTo: '#6B4226',
      letters: 'SB'
    }
  ];

  function findProduct(productId) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === productId) return PRODUCTS[i];
    }
    return null;
  }

  /* A drag must not count as a tap. Both parts of the file share this. */
  var suppressClick = false;

  /* The carousel fills this in when it starts, so the popup can bring
     the chosen pack into focus without depending on the carousel. */
  var centerProduct = function () {};

  /* ---------------------------------------------------------------
     2. THE PRODUCT POPUP
     Ported from .archive/app.js — same markup, same classes.
     --------------------------------------------------------------- */

  var productModal = document.getElementById('product-modal');
  var productPopupPreviouslyFocused = null;

  /* Keeps the Tab key inside the popup, so it cannot wander off
     to the page behind it. */
  function keepFocusInside(event, box) {
    if (event.key !== 'Tab') return;

    var focusable = Array.prototype.filter.call(
      box.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"),
      function (element) { return element.offsetParent !== null; }
    );
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* If a photo cannot load, show the letters instead. */
  function handleBrokenImage(image) {
    if (!image) return;

    function showLetters() {
      image.parentElement.classList.add('image-missing');
    }
    image.addEventListener('error', showLetters, { once: true });

    if (image.complete && image.naturalWidth === 0 && image.src) {
      showLetters();
    }
  }

  /* Opens the popup for one product. */
  function openProductPopup(productId) {
    var product = findProduct(productId);
    if (!product || !productModal) return;

    productPopupPreviouslyFocused = document.activeElement;

    var media = productModal.querySelector('.modal-media');
    media.style.setProperty('--gradient-from', product.gradientFrom);
    media.style.setProperty('--gradient-to', product.gradientTo);
    media.classList.remove('image-missing');
    media.innerHTML =
      '<span class="fallback-text">' + product.letters + '</span>' +
      '<img src="' + product.img + '" alt="' + product.name + '" decoding="async">';
    handleBrokenImage(media.querySelector('img'));

    productModal.querySelector('.modal-info').innerHTML =
      '<span class="tag">' + product.catLabel + '</span>' +
      '<h3 id="modal-title">' + product.name + '</h3>' +
      '<p class="modal-description">' + product.desc + '</p>' +
      '<dl class="spec">' +
        '<div><dt>Texture</dt><dd>' + product.texture + '</dd></div>' +
        '<div><dt>Flavor notes</dt><dd>' + product.notes + '</dd></div>' +
        '<div><dt>Best enjoyed with</dt><dd>' + product.pair + '</dd></div>' +
        '<div><dt>Pack</dt><dd>' + product.pack + '</dd></div>' +
        '<div><dt>Keeping it fresh</dt><dd>' + product.keep + '</dd></div>' +
      '</dl>' +
      '<p class="modal-note">Baked in small batches and stocked daily at the bakehouse and partner counters around Bukidnon.</p>';

    productModal.classList.add('is-open');
    productModal.style.visibility = 'visible';
    productModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-locked');

    var closeBtn = productModal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }

  /* Closes the product popup. */
  function closeProductPopup() {
    if (!productModal || !productModal.classList.contains('is-open')) return;

    if (productPopupPreviouslyFocused) {
      productPopupPreviouslyFocused.focus({ preventScroll: true });
    }

    productModal.classList.remove('is-open');
    productModal.style.visibility = '';
    productModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scroll-locked');
  }

  /* Wires up the clicks inside the popup: the close button and the
     backdrop behind the box. */
  if (productModal) {
    productModal.addEventListener('click', function (event) {
      if (event.target === productModal || event.target.closest('.modal-close')) {
        closeProductPopup();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (!productModal.classList.contains('is-open')) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeProductPopup();
        return;
      }

      keepFocusInside(event, productModal);
    });
  }

  /* One delegated handler for every product card. It is attached to the
     document, not to the carousel, so the popup still opens if the
     carousel never starts. */
  document.addEventListener('click', function (event) {
    if (!event.target || !event.target.closest) return;

    var card = event.target.closest('[data-card]');
    if (!card) return;

    if (suppressClick) {
      event.preventDefault();
      suppressClick = false;
      return;
    }

    var item = card.closest('.showcase__item');
    var id = item ? item.getAttribute('data-product') : card.getAttribute('data-product');
    if (!id || !findProduct(id) || !productModal) return;

    event.preventDefault();
    centerProduct(id);
    openProductPopup(id);
  }, true);

  /* ---------------------------------------------------------------
     3. THE CAROUSEL
     --------------------------------------------------------------- */

  var root = document.querySelector('[data-showcase]');
  var stage = root ? root.querySelector('[data-stage]') : null;
  if (!root || !stage) return;

  var items = Array.prototype.slice.call(root.querySelectorAll('.showcase__item'));
  var cards = items.map(function (item) { return item.querySelector('[data-card]'); });
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-goto]'));
  var countEl = document.querySelector('[data-count]');
  var prevBtn = document.querySelector('[data-dir="-1"]');
  var nextBtn = document.querySelector('[data-dir="1"]');
  var total = items.length;

  /* index is never wrapped: it keeps counting up or down so the cards
     keep sliding the same way round the loop. */
  var index = 0;

  /* Distance from the centre, taken the short way round the loop */
  function wrap(value) {
    var m = ((value % total) + total) % total;
    return m > total / 2 ? m - total : m;
  }

  function activeIndex() {
    return ((Math.round(index) % total) + total) % total;
  }

  function render() {
    var active = activeIndex();

    for (var i = 0; i < total; i++) {
      var offset = wrap(i - index);
      var distance = Math.abs(offset);
      var item = items[i];
      var card = cards[i];
      var hidden = distance >= 2.5;

      item.style.setProperty('--o', offset.toFixed(3));
      item.style.setProperty('--s', Math.max(0.82, 1 - distance * 0.075).toFixed(3));
      item.style.setProperty('--a', hidden ? '0' : Math.max(0, 1 - distance * 0.25).toFixed(3));
      item.style.setProperty('--lift', distance < 0.5 ? '-10px' : '0px');
      item.style.setProperty('--z', String(Math.round(20 - distance * 4)));
      item.style.pointerEvents = hidden ? 'none' : '';
      item.inert = hidden;
      item.classList.toggle('is-center', distance < 0.5);

      /* One tab stop: whichever card is in focus */
      if (card) card.tabIndex = distance < 0.5 ? 0 : -1;
    }

    for (var d = 0; d < dots.length; d++) {
      if (d === active) dots[d].setAttribute('aria-current', 'true');
      else dots[d].removeAttribute('aria-current');
    }

    if (countEl) countEl.textContent = ('0' + (active + 1)).slice(-2);
  }

  function focusCenter() {
    if (cards[activeIndex()]) cards[activeIndex()].focus({ preventScroll: true });
  }

  /* Move by the shortest way round the loop */
  function moveTo(target, shouldFocus) {
    index = index + wrap(target - index);
    render();
    if (shouldFocus) focusCenter();
  }

  /* -- Measuring one step ------------------------------------------ */

  /* --step is written in CSS as a fraction of the card width, so the
     only reliable way to read it is to let the browser resolve it. */
  function measureStep() {
    var probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText =
      'position:absolute;top:0;left:0;width:var(--step);height:0;' +
      'visibility:hidden;pointer-events:none;';
    root.parentNode.appendChild(probe);
    var width = probe.getBoundingClientRect().width;
    probe.parentNode.removeChild(probe);
    if (width > 0) return width;
    return items[0] ? items[0].offsetWidth * 0.98 : 200;
  }

  /* -- Drag -------------------------------------------------------- */

  var drag = null;

  stage.addEventListener('pointerdown', function (event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    drag = {
      x: event.clientX,
      start: index,
      step: measureStep(),
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0
    };

    suppressClick = false;
    root.classList.add('is-dragging');
    if (stage.setPointerCapture) stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener('pointermove', function (event) {
    if (!drag) return;

    var dx = event.clientX - drag.x;
    if (Math.abs(dx) > 8) suppressClick = true;

    index = drag.start - dx / drag.step;

    var now = performance.now();
    var elapsed = now - drag.lastTime;
    if (elapsed > 0) drag.velocity = (event.clientX - drag.lastX) / elapsed;
    drag.lastX = event.clientX;
    drag.lastTime = now;

    render();
  });

  function endDrag() {
    if (!drag) return;

    var velocity = drag.velocity;
    var target = Math.round(index);

    /* A quick flick carries past the nearest card */
    if (Math.abs(velocity) > 0.35) target = Math.round(index - velocity * 0.3);

    drag = null;
    root.classList.remove('is-dragging');
    moveTo(target);
  }

  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('lostpointercapture', endDrag);

  stage.addEventListener('dragstart', function (event) {
    event.preventDefault();
  });

  /* -- Keyboard ---------------------------------------------------- */

  root.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveTo(index + 1, true);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveTo(index - 1, true);
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveTo(0, true);
    } else if (event.key === 'End') {
      event.preventDefault();
      moveTo(total - 1, true);
    }
  });

  /* -- Buttons and dots -------------------------------------------- */

  if (prevBtn) prevBtn.addEventListener('click', function () { moveTo(index - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { moveTo(index + 1); });

  for (var d = 0; d < dots.length; d++) {
    dots[d].addEventListener('click', function () {
      moveTo(Number(this.getAttribute('data-goto')), true);
    });
  }

  /* -- Horizontal trackpad / wheel --------------------------------- */

  var wheelLock = 0;
  stage.addEventListener('wheel', function (event) {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

    event.preventDefault();
    var now = Date.now();
    if (now < wheelLock) return;
    wheelLock = now + 220;

    moveTo(index + (event.deltaX > 0 ? 1 : -1));
  }, { passive: false });

  /* -- Let the popup bring a pack into focus ----------------------- */

  centerProduct = function (productId) {
    for (var i = 0; i < total; i++) {
      if (items[i].getAttribute('data-product') === productId) {
        if (i !== activeIndex()) moveTo(i);
        return;
      }
    }
  };

  render();
})();
