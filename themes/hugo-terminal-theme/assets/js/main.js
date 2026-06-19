/**
 * Hugo Terminal Theme — main.js
 *
 * Lightweight progressive enhancement.
 * No frameworks, no dependencies.
 */

(function () {
  'use strict';

  /**
   * Adds a blinking-cursor class to all .prompt-text elements so the
   * decorative command lines look like an active terminal.
   */
  function initCursorBlink() {
    const prompts = document.querySelectorAll('.prompt-text');
    prompts.forEach(function (el) {
      el.classList.add('cursor-blink');
    });
  }

  /**
   * Typewriter effect for the first .cmd-line on the page.
   * Replaces the inner text character-by-character.
   *
   * @param {HTMLElement} el - element to animate
   * @param {string} text    - text to type
   * @param {number} speed   - ms per character (default 40)
   */
  function typeWriter(el, text, speed) {
    speed = speed || 40;
    el.textContent = '';
    var i = 0;

    function tick() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(tick, speed);
      }
    }

    tick();
  }

  /**
   * Animate only the very first .prompt-text on the page with a typewriter
   * effect. Subsequent ones are left static so the page feels snappy.
   */
  function initTypewriter() {
    var first = document.querySelector('.cmd-line .prompt-text');
    if (!first) {
      return;
    }

    var originalText = first.textContent;
    typeWriter(first, originalText, 35);
  }

  /**
   * Smooth-scroll anchor links that point to same-page IDs.
   */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) {
        return;
      }

      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /**
   * Adds a "back to top" keyboard shortcut (Ctrl+Home / Cmd+Home)
   * and scrolls the page to the top — mirrors the terminal Ctrl+A feel.
   */
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /**
   * Boot — runs after the DOM is ready.
   */
  function boot() {
    initCursorBlink();
    initTypewriter();
    initSmoothScroll();
    initKeyboardShortcuts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
