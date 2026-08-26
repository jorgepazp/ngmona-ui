import { Component, input } from '@angular/core';

/**
 * Indeterminate loading spinner (animated arc), for cases that need a standalone spinner rather
 * than `ui-button`'s built-in `[loading]` state.
 *
 * Both source copies (FTD/uiSDP; this component didn't exist in base) were identical, down to a
 * `TODO: quitar HEX del stroke a clases tailwind` comment — i.e. the original authors already
 * flagged that hardcoding the stroke color as a hex string (`#D5006C`, which is just
 * `--color-primary-300`) instead of a Tailwind class was wrong. Fixed here: the SVG now strokes
 * with `currentColor` and color is set via a `text-*` class (`classNames`, defaults to
 * `text-primary-500`), so it reskins the same way every other component in this library does.
 *
 * Accessibility: the original had none. Added `role="status"` plus an `ariaLabel` (defaults to
 * "Loading") so screen readers announce the loading state instead of silently seeing nothing.
 */
@Component({
  selector: 'ui-spinner',
  templateUrl: './spinner.html',
  styles: `
    :host {
      display: contents;
    }
    .ui-spinner {
      transition: all 0.7s ease-in-out;
    }
    .ui-spinner-track {
      transform-origin: center;
      animation: ui-spinner-rotate 2s linear infinite;
    }
    .ui-spinner-track circle {
      stroke-linecap: round;
      animation: ui-spinner-dash 1.5s ease-in-out infinite;
    }
    @keyframes ui-spinner-rotate {
      100% {
        transform: rotate(360deg);
      }
    }
    @keyframes ui-spinner-dash {
      0% {
        stroke-dasharray: 0 150;
        stroke-dashoffset: 0;
      }
      47.5% {
        stroke-dasharray: 42 150;
        stroke-dashoffset: -16;
      }
      95%,
      100% {
        stroke-dasharray: 42 150;
        stroke-dashoffset: -59;
      }
    }
  `,
})
export class Spinner {
  /** Width/height of the SVG in pixels. */
  readonly size = input(52);
  /** Text color class controlling the stroke via `currentColor` — swap to reskin the spinner. */
  readonly classNames = input('text-primary-500');
  /** Accessible name announced by screen readers via `role="status"`. */
  readonly ariaLabel = input('Loading');
}
