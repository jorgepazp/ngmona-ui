import { Component, computed, effect, input, signal } from '@angular/core';
import { LucideDynamicIcon, LucideUser, type LucideIconInput } from '@lucide/angular';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarVariant = 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type AvatarStatus = 'none' | 'online' | 'offline' | 'busy' | 'away';

/**
 * User or entity avatar with automatic fallback between an image, initials and an icon.
 *
 * When `src` is set the image is shown first, and falls back to `initials` (then `icon`)
 * automatically if it fails to load. `alt` is the accessible name in every case: it is used as
 * the `<img alt>` when an image renders, and as `aria-label` on the container otherwise.
 */
@Component({
  selector: 'ui-avatar',
  imports: [LucideDynamicIcon],
  templateUrl: './avatar.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class Avatar {
  /** Image URL, tried first. Falls back to `initials` (then `icon`) if unset or the image fails to load. */
  readonly src = input<string | undefined>(undefined);
  /** Accessible name, used as `<img alt>` or `aria-label` depending on which tier renders (see class doc). */
  readonly alt = input('');
  /** Fallback text (e.g. initials) shown when there's no image; takes priority over `icon`. */
  readonly initials = input<string | undefined>(undefined);
  /** Fallback icon shown when there's no image and no `initials`. Defaults to a generic user icon. */
  readonly icon = input<LucideIconInput | undefined>(undefined);
  /** Overall size of the avatar and its fallback icon. */
  readonly size = input<AvatarSize>('md');
  /** Container shape. */
  readonly shape = input<AvatarShape>('circle');
  /** Background/text color used for the initials or icon fallback; ignored while an image is showing. */
  readonly variant = input<AvatarVariant>('neutral');
  /** Presence indicator dot rendered in the bottom-right corner; `'none'` hides it. */
  readonly status = input<AvatarStatus>('none');
  /** Extra utility classes appended to the root element. */
  readonly classNames = input('');

  protected readonly fallbackIcon: LucideIconInput = LucideUser;

  private readonly imgError = signal(false);
  protected readonly showImage = computed(() => !!this.src() && !this.imgError());

  protected readonly iconSize = computed(() => {
    const map: Record<AvatarSize, number> = { sm: 12, md: 16, lg: 20, xl: 24 };
    return map[this.size()];
  });

  protected readonly avatarClass = computed(() => {
    const base = `relative inline-flex items-center justify-center shrink-0 select-none font-semibold ${this.shapeClass()} ${this.sizeClass()}`;
    return `${base} ${this.showImage() ? 'bg-neutral-100' : this.variantClass()} ${this.classNames()}`;
  });

  protected readonly statusClass = computed(() => {
    const color: Record<Exclude<AvatarStatus, 'none'>, string> = {
      online: 'bg-success-400',
      offline: 'bg-neutral-400',
      busy: 'bg-danger-400',
      away: 'bg-warning-400',
    };
    const status = this.status();
    return status === 'none' ? '' : ` ${color[status]} ${this.statusSizeClass()}`;
  });

  constructor() {
    // Reset the broken-image flag whenever the caller points to a new src.
    effect(() => {
      this.src();
      this.imgError.set(false);
    });
  }

  protected onImgError(): void {
    this.imgError.set(true);
  }

  shapeClass(): string {
    return this.shape() === 'circle' ? 'rounded-full' : 'rounded';
  }

  private sizeClass(): string {
    const map: Record<AvatarSize, string> = {
      sm: 'w-6 h-6 text-caption',
      md: 'w-8 h-8 text-label-xs',
      lg: 'w-10 h-10 text-label-sm',
      xl: 'w-12 h-12 text-label-md',
    };
    return map[this.size()];
  }

  private statusSizeClass(): string {
    const map: Record<AvatarSize, string> = {
      sm: 'w-2 h-2 border',
      md: 'w-3 h-3 border-2',
      lg: 'w-3 h-3 border-2',
      xl: 'w-4 h-4 border-2',
    };
    return `absolute bottom-0 right-0 rounded-full border-surface-white ${map[this.size()]}`;
  }

  private variantClass(): string {
    const map: Record<AvatarVariant, string> = {
      primary: 'bg-primary-500 text-white',
      neutral: 'bg-surface-light text-text-primary',
      success: 'bg-surface-success-light text-text-success',
      warning: 'bg-surface-warning-light text-text-warning',
      danger: 'bg-surface-danger-light text-text-danger',
      info: 'bg-surface-info-light text-text-info',
    };
    return map[this.variant()];
  }
}
