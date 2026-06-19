/**
 * banner.js — Pixel block-font canvas banner renderer.
 *
 * Renders text using a 5×7 bitmap font as large coloured blocks,
 * matching the LED-segment display look of todoprogramming.org.
 *
 * Scaling: text fills the full container width exactly.
 * Rendering: each "pixel" is a two-tone block (bright border, slightly
 *             darker fill) that matches the LED-segment look in the image.
 * HiDPI: canvas is scaled by devicePixelRatio for crisp output on
 *         Retina and similar screens.
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Colours                                                             */
  /* ------------------------------------------------------------------ */

  var COLOR_BG     = '#0a0f0a';
  var COLOR_BORDER = '#39ff14';  /* neon green outer ring               */
  var COLOR_FILL   = '#25b800';  /* slightly darker inner — LED depth   */

  /* ------------------------------------------------------------------ */
  /* 5×7 bitmap font                                                     */
  /*                                                                     */
  /* Each entry is an array of 7 rows; each row is a 5-bit number where */
  /* bit 4 (MSB) = left column, bit 0 (LSB) = right column.            */
  /*                                                                     */
  /* Letter shapes are rectangular / block-style to match the image:    */
  /*   - O, C, G, S, U all use full-width top/bottom rows               */
  /*   - diagonals in M, N kept minimal                                 */
  /* ------------------------------------------------------------------ */

  var FONT = {
    /* — uppercase letters — */
    'A': [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
    'B': [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
    'C': [0b11111, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
    'D': [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
    'E': [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
    'F': [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
    'G': [0b11111, 0b10000, 0b10000, 0b10111, 0b10001, 0b10001, 0b11111],
    'H': [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
    'I': [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
    'J': [0b00111, 0b00001, 0b00001, 0b00001, 0b10001, 0b10001, 0b11111],
    'K': [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
    'L': [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
    'M': [0b10001, 0b11011, 0b10101, 0b10001, 0b10001, 0b10001, 0b10001],
    'N': [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
    'O': [0b11111, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11111],
    'P': [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
    'Q': [0b11111, 0b10001, 0b10001, 0b10001, 0b10101, 0b10011, 0b11111],
    'R': [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
    'S': [0b11111, 0b10000, 0b10000, 0b11111, 0b00001, 0b00001, 0b11111],
    'T': [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
    'U': [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11111],
    'V': [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
    'W': [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
    'X': [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
    'Y': [0b10001, 0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100],
    'Z': [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
    /* — digits — */
    '0': [0b11111, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b11111],
    '1': [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
    '2': [0b11111, 0b00001, 0b00001, 0b11111, 0b10000, 0b10000, 0b11111],
    '3': [0b11111, 0b00001, 0b00001, 0b11111, 0b00001, 0b00001, 0b11111],
    '4': [0b10001, 0b10001, 0b10001, 0b11111, 0b00001, 0b00001, 0b00001],
    '5': [0b11111, 0b10000, 0b10000, 0b11111, 0b00001, 0b00001, 0b11111],
    '6': [0b11111, 0b10000, 0b10000, 0b11111, 0b10001, 0b10001, 0b11111],
    '7': [0b11111, 0b00001, 0b00010, 0b00100, 0b00100, 0b00100, 0b00100],
    '8': [0b11111, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b11111],
    '9': [0b11111, 0b10001, 0b10001, 0b11111, 0b00001, 0b00001, 0b11111],
    /* — punctuation — */
    '-': [0b00000, 0b00000, 0b00000, 0b11111, 0b00000, 0b00000, 0b00000],
    '.': [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00100],
    '!': [0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00000, 0b00100],
    ' ': [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000]
  };

  /* ------------------------------------------------------------------ */
  /* Font metrics                                                        */
  /* ------------------------------------------------------------------ */

  var CHAR_COLS    = 5;  /* pixel columns per glyph                     */
  var CHAR_ROWS    = 7;  /* pixel rows per glyph                        */
  var SPACE_COLS   = 3;  /* columns for a space character               */
  var CHAR_SPACING = 1;  /* gap columns inserted between characters     */

  /* ------------------------------------------------------------------ */
  /* Drawing helpers                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Returns the total number of pixel-column units the string occupies.
   * (Does not include a trailing gap after the last column.)
   *
   * @param {string[]} chars
   * @returns {number}
   */
  function totalUnits(chars) {
    var n = 0;
    chars.forEach(function (c, i) {
      n += (c === ' ') ? SPACE_COLS : CHAR_COLS;
      if (i < chars.length - 1) {
        n += CHAR_SPACING;
      }
    });
    return n;
  }

  /**
   * Draws one pixel block at canvas coordinates (x, y).
   * Uses a two-tone approach: bright outer ring + slightly darker inner fill.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} size - block edge length in CSS pixels
   */
  function drawBlock(ctx, x, y, size) {
    /* bright outer ring */
    ctx.fillStyle = COLOR_BORDER;
    ctx.fillRect(x, y, size, size);

    /* darker inner fill */
    var inset = Math.max(1, Math.round(size * 0.13));
    ctx.fillStyle = COLOR_FILL;
    ctx.fillRect(x + inset, y + inset, size - inset * 2, size - inset * 2);
  }

  /* ------------------------------------------------------------------ */
  /* Main render                                                         */
  /* ------------------------------------------------------------------ */

  /**
   * Redraws the canvas to fill its container's current width.
   *
   * Scaling formula
   * ---------------
   * Let  u  = unit  = blockSize + gap
   *      r  = gap / u  (fractional gap size)
   *      T  = totalUnits(chars)
   *
   * Rendered width:
   *   renderW = T * u - gap
   *           = T * u - r * u
   *           = u * (T - r)
   *
   * Solving for u to fill availW exactly:
   *   u = availW / (T - r)
   *
   * @param {HTMLCanvasElement} canvas
   */
  function render(canvas) {
    var text  = (canvas.dataset.text || 'BLOG').toUpperCase();
    var chars = text.split('');

    var availW = canvas.parentElement.clientWidth || window.innerWidth;
    var dpr    = window.devicePixelRatio || 1;

    /* -- compute unit size so text fills availW exactly -- */
    var GAP_FRAC = 0.16;               /* gap is 16% of unit             */
    var T        = totalUnits(chars);

    var unitF    = availW / (T - GAP_FRAC);
    var unit     = Math.floor(unitF);
    if (unit < 3) { unit = 3; }

    var gap       = Math.max(1, Math.round(unit * GAP_FRAC));
    var blockSize = unit - gap;

    var vPad    = Math.round(blockSize * 0.7);
    var canvasW = availW;
    var canvasH = CHAR_ROWS * unit - gap + vPad * 2;

    /* -- set physical vs CSS pixel dimensions -- */
    canvas.width  = Math.round(canvasW * dpr);
    canvas.height = Math.round(canvasH * dpr);
    canvas.style.width  = canvasW + 'px';
    canvas.style.height = canvasH + 'px';

    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    /* background */
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, canvasW, canvasH);

    /* -- measure actual rendered width for horizontal centering -- */
    var renderW = T * unit - gap;
    var xCursor = Math.floor((canvasW - renderW) / 2);

    /* -- draw each character -- */
    chars.forEach(function (char, ci) {
      var cols   = (char === ' ') ? SPACE_COLS : CHAR_COLS;
      var bitmap = FONT[char];

      if (char !== ' ' && bitmap) {
        for (var row = 0; row < CHAR_ROWS; row++) {
          var bits = bitmap[row] || 0;
          for (var col = 0; col < CHAR_COLS; col++) {
            var on = (bits >> (CHAR_COLS - 1 - col)) & 1;
            if (!on) { continue; }
            var bx = xCursor + col * unit;
            var by = vPad    + row * unit;
            drawBlock(ctx, bx, by, blockSize);
          }
        }
      }

      xCursor += cols * unit;
      if (ci < chars.length - 1) {
        xCursor += CHAR_SPACING * unit;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                */
  /* ------------------------------------------------------------------ */

  function init() {
    var canvas = document.getElementById('site-canvas');
    if (!canvas) { return; }

    render(canvas);

    /* re-render on resize (debounced 80 ms) */
    var timer;
    window.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { render(canvas); }, 80);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
