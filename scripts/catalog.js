/* Product carousel + popup. */
(function () {
  'use strict';

  var PRODUCTS = {
    'toasted-biscocho': {
      name: 'Toasted Biscocho', cat: 'Toasted specialties', letters: 'B',
      img: 'assets/orig/Biscocho.webp', from: '#D9A05B', to: '#8C4A1F',
      desc: 'Twice-baked crispy bread slices glazed with butter and sugar.',
      texture: 'Deep crunch, glassy sugar crust', notes: 'Butter, toasted sugar, golden bread',
      pair: 'Morning coffee or hot tsokolate', keep: 'Keep sealed to protect the crunch'
    },
    'hopia-choco': {
      name: 'Hopia Choco', cat: 'Chocolate-filled', letters: 'H',
      img: 'assets/orig/Hopia.webp', from: '#9A6A45', to: '#4A2C17',
      desc: 'Flaky crust pockets filled with rich chocolate sweet bean paste.',
      texture: 'Layered flaky shell, dense fudgy core', notes: 'Cocoa, sweet bean paste, pastry',
      pair: 'Warm milk or afternoon kape', keep: 'Cool, dry place away from sunlight'
    },
    'toasted-mammon': {
      name: 'Toasted Mammon', cat: 'Toasted specialties', letters: 'M',
      img: 'assets/orig/Mammon.webp', from: '#F0D9A8', to: '#C98F3D',
      desc: 'Light sponge cake slices slow-toasted for an airy, crispy crunch.',
      texture: 'Airy, melt-away crisp', notes: 'Vanilla sponge, light caramel',
      pair: 'Afternoon tea or kape', keep: 'Away from humidity, reseal tightly'
    },
    'patatas': {
      name: 'Patatas Biscuits', cat: 'Crisp & light', letters: 'P',
      img: 'assets/orig/Patatas.webp', from: '#E3B778', to: '#A05C22',
      desc: 'Finger-style crunchy biscuit batons with a savory-sweet taste.',
      texture: 'Firm snap, fine crumb', notes: 'Buttery, lightly sweet, hint of salt',
      pair: 'Black coffee — a merienda classic', keep: 'Cool, dry shelf; reseal after opening'
    },
    'cookie-de-longa': {
      name: 'Cookie de Longa', cat: 'Sesame cookies', letters: 'CdL',
      img: 'assets/orig/Cookie-de-longga.jpeg', from: '#E8C07D', to: '#B4691E',
      desc: 'Sesame-topped round cookie sandwiches with a sweet signature filling.',
      texture: 'Crumbly outside, soft sweet centre', notes: 'Toasted sesame, butter, caramel sugar',
      pair: 'Barako coffee or warm milk', keep: 'Cool, dry place — reseal after opening'
    },
    'special-biscocho': {
      name: 'Special Biscocho', cat: 'Toasted specialties', letters: 'SB',
      img: 'assets/orig/Biscocho2.webp', from: '#C98F3D', to: '#6B4226',
      desc: 'Our special-cut biscocho — thicker slices, a deeper butter-and-sugar glaze, and one extra pass through the oven.',
      texture: 'Thick crunch, caramelised sugar shell', notes: 'Butter, muscovado sugar, toasted bread',
      pair: 'Hot chocolate or barako coffee', keep: 'Keep sealed to protect the crunch'
    }
  };

  var modal = document.getElementById('product-modal');
  var lastFocus = null;

  function openProductPopup(id) {
    var p = PRODUCTS[id];
    if (!p || !modal) return;
    lastFocus = document.activeElement;

    var media = modal.querySelector('.modal__media');
    media.style.setProperty('--modal-gradient-from', p.from);
    media.style.setProperty('--modal-gradient-to', p.to);
    media.innerHTML = '<span class="modal__fallback">' + p.letters + '</span>' +
      '<img src="' + p.img + '" alt="' + p.name + '" decoding="async">';

    modal.querySelector('.modal__info').innerHTML =
      '<span class="tag tag--gold">' + p.cat + '</span><h3 id="modal-title" class="modal__title">' + p.name + '</h3>' +
      '<p class="modal__description">' + p.desc + '</p><dl class="spec">' +
      '<div class="spec__row"><dt class="spec__label">Texture</dt><dd class="spec__value">' + p.texture + '</dd></div>' +
      '<div class="spec__row"><dt class="spec__label">Flavor notes</dt><dd class="spec__value">' + p.notes + '</dd></div>' +
      '<div class="spec__row"><dt class="spec__label">Best enjoyed with</dt><dd class="spec__value">' + p.pair + '</dd></div>' +
      '<div class="spec__row"><dt class="spec__label">Pack</dt><dd class="spec__value">100 g heat-sealed pouch</dd></div>' +
      '<div class="spec__row"><dt class="spec__label">Keeping it fresh</dt><dd class="spec__value">' + p.keep + '</dd></div></dl>' +
      '<p class="modal__note">Baked in small batches and stocked daily at the bakehouse and partner counters around Bukidnon.</p>';

    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-locked');
    modal.querySelector('.modal__close').focus({ preventScroll: true });
  }

  function closeProductPopup() {
    if (!modal || !modal.classList.contains('modal--open')) return;
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scroll-locked');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('.modal__close')) closeProductPopup();
    });

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('modal--open')) return;
      if (e.key === 'Escape') { closeProductPopup(); return; }
      if (e.key !== 'Tab') return;
      var f = modal.querySelectorAll('a[href], button:not([disabled])');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- carousel ---- */

  var root = document.querySelector('[data-showcase]');
  if (!root) return;

  var stage = root.querySelector('[data-stage]');
  var items = [].slice.call(root.querySelectorAll('.showcase__item'));
  var cards = items.map(function (i) { return i.querySelector('[data-card]'); });
  var dots = [].slice.call(document.querySelectorAll('[data-goto]'));
  var count = document.querySelector('[data-count]');
  var n = items.length;
  var index = 0;
  var drag = null;
  var isSwiping = false;
  var startX = 0;
  var startY = 0;
  var suppressClick = false;

  function wrap(v) {
    var m = ((v % n) + n) % n;
    return m > n / 2 ? m - n : m;
  }

  function active() {
    return ((Math.round(index) % n) + n) % n;
  }

  function render() {
    items.forEach(function (item, i) {
      var o = wrap(i - index);
      var d = Math.abs(o);
      var hidden = d >= 2.5;
      item.style.setProperty('--o', o.toFixed(3));
      item.style.setProperty('--s', Math.max(0.82, 1 - d * 0.075).toFixed(3));
      item.style.setProperty('--a', hidden ? '0' : Math.max(0, 1 - d * 0.25).toFixed(3));
      item.style.setProperty('--lift', d < 0.5 ? '-10px' : '0px');
      item.style.setProperty('--z', 20 - Math.round(d * 4));
      item.classList.toggle('showcase__item--center', d < 0.5);
      item.inert = hidden;
      if (cards[i]) cards[i].tabIndex = d < 0.5 ? 0 : -1;
    });

    dots.forEach(function (dot, i) {
      if (i === active()) {
        dot.setAttribute('aria-current', 'true');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.removeAttribute('aria-current');
        dot.setAttribute('aria-selected', 'false');
      }
    });

    if (count) count.textContent = ('0' + (active() + 1)).slice(-2);
  }

  function moveBy(step) {
    index += step;
    render();
  }

  function moveTo(i) {
    index += wrap(i - index);
    render();
  }

  /* Drag & Swipe Gestures with strict click conflict separation */
  stage.addEventListener('pointerdown', function (e) {
    // Only capture primary mouse button or touch/pen
    if (e.button !== undefined && e.button !== 0) return;
    startX = e.clientX;
    startY = e.clientY;
    isSwiping = false;
    suppressClick = false;
    drag = {
      x: e.clientX,
      y: e.clientY,
      i: index,
      w: (items[0] && items[0].offsetWidth * 0.98) || 300
    };
    if (stage.setPointerCapture) {
      try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    }
  });

  stage.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x;
    var dy = e.clientY - drag.y;

    // Detect if this is an intentional horizontal swipe vs a tap/vertical scroll
    if (!isSwiping) {
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        isSwiping = true;
        suppressClick = true;
        root.classList.add('showcase--dragging');
      } else if (Math.abs(dy) > 10) {
        // Natural vertical scroll, release gesture tracking
        drag = null;
        return;
      }
    }

    if (isSwiping) {
      index = drag.i - dx / drag.w;
      render();
    }
  });

  function endPointer(e) {
    if (!drag) return;
    if (isSwiping) {
      var dx = (e ? e.clientX : startX) - startX;
      // Flick threshold or snap to nearest card
      if (Math.abs(dx) > 40) {
        index = Math.round(index);
      } else {
        index = Math.round(drag.i);
      }
      render();
      setTimeout(function () {
        suppressClick = false;
      }, 50);
    }
    drag = null;
    isSwiping = false;
    root.classList.remove('showcase--dragging');
  }

  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);

  /* Card click listener — opens modal cleanly without swipe conflict */
  stage.addEventListener('click', function (e) {
    var card = e.target.closest && e.target.closest('[data-card]');
    if (!card) return;

    if (suppressClick) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
      return;
    }

    e.preventDefault();
    var item = card.closest('.showcase__item');
    if (!item) return;

    var itemIdx = items.indexOf(item);
    if (itemIdx !== -1 && itemIdx !== active()) {
      moveTo(itemIdx);
    }
    openProductPopup(item.getAttribute('data-product'));
  });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); moveBy(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); moveBy(-1); }
    else if (e.key === 'Home') { e.preventDefault(); moveTo(0); }
    else if (e.key === 'End') { e.preventDefault(); moveTo(n - 1); }
  });

  var prevArrow = document.querySelector('[data-dir="-1"]');
  if (prevArrow) prevArrow.addEventListener('click', function () { moveBy(-1); });

  var nextArrow = document.querySelector('[data-dir="1"]');
  if (nextArrow) nextArrow.addEventListener('click', function () { moveBy(1); });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { moveTo(i); });
  });

  render();
})();