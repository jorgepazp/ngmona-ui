import { InjectionToken, Signal, WritableSignal } from '@angular/core';

/**
 * Something on the same element that can name it for assistive technology when it has no text of
 * its own — `uiTooltip` provides this, so `<button uiButton variant="icon" uiTooltip="Delete">`
 * gets `aria-label="Delete"` without repeating the text.
 */
export interface UiLabelSource {
  /** The text to use as the element's accessible name ('' when there is none). */
  readonly label: Signal<string>;
  /**
   * Set by the consumer when it actually uses `label` as the element's name, so the source can
   * avoid also announcing the same text as a description.
   */
  readonly usedAsLabel: WritableSignal<boolean>;
}

export const UI_LABEL_SOURCE = new InjectionToken<UiLabelSource>('UI_LABEL_SOURCE');
