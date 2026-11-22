/* ==========================================
   catalog.js — horizontal product rail
   CSS scroll-snap handles the snapping. This
   file only adds: arrow buttons, mouse drag,
   keyboard steps and the progress indicator.
   ========================================== */

(function () {
  'use strict';

  var rail = document.querySelector('[data-rail]');
  if (!rail) return;

  var track = rail.querySelector('.rail__track');
  var cards = rail.querySelectorAll('.rail__item');
  var thumb = document.querySelector('[data-thumb]');
  var prevBtn = document.querySelector('[data-dir="-1"]');
  var nextBtn = document.querySelector('[data-dir="1"]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function stepSize() {
    var card = cards[0];
    if (!card) return rail.clientWidth * 0.8;
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function scrollByStep(direction) {
    rail.scrollBy({
      left: direction * stepSize(),
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });
  }

  function sync() {
    var max = rail.scrollWidth - rail.clientWidth;
    var progress = max > 0 ? Math.min(1, Math.max(0, rail.scrollLeft / max)) : 0;

    if (thumb) {
      var ratio = rail.scrollWidth ? Math.min(1, rail.clientWidth / rail.scrollWidth) : 1;
      thumb.style.width = ratio * 100 + '%';
      thumb.style.left = progress * (1 - ratio) * 100 + '%';
    }

    if (prevBtn) prevBtn.disabled = rail.scrollLeft <= 2;
    if (nextBtn) nextBtn.disabled = rail.scrollLeft >= max - 2;
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { scrollByStep(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { scrollByStep(1); });

  rail.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  window.addEventListener('load', sync);

  /* Keyboard: one card per arrow press */
  rail.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollByStep(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollByStep(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      rail.scrollTo({ left: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    } else if (event.key === 'End') {
      event.preventDefault();
      rail.scrollTo({
        left: rail.scrollWidth,
        behavior: reduceMotion.matches ? 'auto' : 'smooth'
      });
    }
  });

  /* Drag to scroll — mouse and pen only, so touch keeps native momentum */
  var drag = null;
  var moved = 0;

  rail.addEventListener('pointerdown', function (event) {
    if (event.pointerType === 'touch' || event.button !== 0) return;
    drag = { x: event.clientX, left: rail.scrollLeft, id: event.pointerId };
    moved = 0;
    rail.classList.add('is-dragging');
    if (rail.setPointerCapture) rail.setPointerCapture(event.pointerId);
  });

  rail.addEventListener('pointermove', function (event) {
    if (!drag) return;
    var dx = event.clientX - drag.x;
    if (Math.abs(dx) > moved) moved = Math.abs(dx);
    if (moved > 4) rail.scrollLeft = drag.left - dx;
  });

  function endDrag() {
    if (!drag) return;
    drag = null;
    rail.classList.remove('is-dragging');
  }

  rail.addEventListener('pointerup', endDrag);
  rail.addEventListener('pointercancel', endDrag);
  rail.addEventListener('lostpointercapture', endDrag);

  /* A drag must not count as a click on the card underneath */
  rail.addEventListener('click', function (event) {
    if (moved > 8) {
      event.preventDefault();
      event.stopPropagation();
      moved = 0;
    }
  }, true);

  rail.addEventListener('dragstart', function (event) { event.preventDefault(); });

  sync();
})();
