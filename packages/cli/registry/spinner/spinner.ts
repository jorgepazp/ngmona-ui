import { Component, input } from '@angular/core';

/**
 * Indeterminate loading spinner (animated arc), for standalone use rather than `ui-button`'s
 * built-in `loading` state.
 *
 * The stroke uses `currentColor`, controlled via a text color class in `classNames`. Renders with
 * `role="status"` and `ariaLabel` so screen readers announce the loading state.
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
