import type { AnimationCallbackEvent } from '@angular/core';

/**
 * Migrated from the deprecated `@angular/animations` `trigger()`/`transition()` API to Angular's
 * native `animate.enter`/`animate.leave` template bindings (stable since v20.2) — no
 * `BrowserAnimationsModule`/`provideAnimationsAsync()`, no per-component `animations: [...]`
 * metadata, no JS animation engine shipped to the browser.
 *
 * Two different binding styles are used depending on what the animation needs:
 *
 * - Plain CSS classes (`animate.enter="ui-anim-fade-enter"`), for anything a CSS
 *   `@keyframes`/`transition` can express on its own. See `styles/animations.css`.
 * - JS callback functions (`(animate.enter)="collapseEnter($event)"`), for anything that needs to
 *   measure the real DOM — CSS can transition to a pixel value or a keyword, but never to `auto`,
 *   so animating "height/width from 0 to its natural content size" (`collapseEnter`/`collapseLeave`
 *   below) has to read `scrollHeight`/`scrollWidth` and drive a Web Animations API animation
 *   instead of a CSS class.
 */

const COLLAPSE_DURATION_MS = 250;
const APPEAR_ENTER_DURATION_MS = 150;
const APPEAR_LEAVE_DURATION_MS = 150;

/** Static fade, bind directly in templates: `animate.enter="ui-anim-fade-enter" animate.leave="ui-anim-fade-leave"`. */
export const fadeEnterClass = 'ui-anim-fade-enter';
export const fadeLeaveClass = 'ui-anim-fade-leave';

/** Enter-only fade (no leave transition — the element is simply removed). */
export const appearNoLeaveEnterClass = 'ui-anim-appear-no-leave-enter';

/**
 * Bind directly on each repeated element inside a `@for` block (not on the containing list) —
 * `animate.enter` only fires on the element that's actually entering, and CSS `:nth-child` supplies
 * the stagger delay. Replaces the old `listAnimation` trigger's `query(':enter', stagger(...))`,
 * which had to live on the parent because the classic engine could query descendants; the native
 * API only ever animates the node the binding is on.
 */
export const listItemEnterClass = 'ui-anim-list-item-enter';

function animateBox(
  element: HTMLElement,
  dimension: 'height' | 'width',
  from: number,
  to: number,
  fromOpacity: number,
  toOpacity: number,
  duration: number,
  onDone?: () => void,
): void {
  const previousOverflow = element.style.overflow;
  element.style.overflow = 'hidden';

  const animation = element.animate(
    [
      { [dimension]: `${from}px`, opacity: fromOpacity },
      { [dimension]: `${to}px`, opacity: toOpacity },
    ],
    { duration, easing: 'ease' },
  );

  const finish = () => {
    element.style.overflow = previousOverflow;
    element.style[dimension] = '';
    onDone?.();
  };
  animation.onfinish = finish;
  animation.oncancel = finish;
}

/**
 * Grows an element from height 0 to its natural content height while fading in, and shrinks it
 * back to 0 while fading out on the way out — height and opacity animate together as one motion
 * instead of the old trigger's sequential steps (fade out fully, *then* collapse the now-invisible
 * husk), so the panel visibly shrinks as it fades rather than sitting at full height, invisible,
 * before the space collapses.
 */
export function collapseEnter(event: AnimationCallbackEvent): void {
  const element = event.target as HTMLElement;
  animateBox(element, 'height', 0, element.scrollHeight, 0, 1, COLLAPSE_DURATION_MS, event.animationComplete);
}

export function collapseLeave(event: AnimationCallbackEvent): void {
  const element = event.target as HTMLElement;
  animateBox(element, 'height', element.scrollHeight, 0, 1, 0, COLLAPSE_DURATION_MS, event.animationComplete);
}

/**
 * Animates an already-mounted element's height between two states (e.g. driven by
 * `SmoothHeightDirective` when its bound content changes size without the host element itself
 * being inserted/removed). `animate.enter`/`animate.leave` only fire on insertion/removal, so
 * this is called directly rather than through a template binding.
 */
export function animateHeightTo(element: HTMLElement, fromHeight: number, onDone?: () => void): void {
  const toHeight = element.scrollHeight;
  if (fromHeight === toHeight) {
    onDone?.();
    return;
  }
  animateBox(element, 'height', fromHeight, toHeight, 1, 1, COLLAPSE_DURATION_MS, onDone);
}

/** Same idea as `collapseEnter`/`collapseLeave`, along the width axis. */
export function appearEnter(event: AnimationCallbackEvent): void {
  const element = event.target as HTMLElement;
  animateBox(element, 'width', 0, element.scrollWidth, 0, 1, APPEAR_ENTER_DURATION_MS, event.animationComplete);
}

export function appearLeave(event: AnimationCallbackEvent): void {
  const element = event.target as HTMLElement;
  animateBox(element, 'width', element.scrollWidth, 0, 1, 0, APPEAR_LEAVE_DURATION_MS, event.animationComplete);
}
