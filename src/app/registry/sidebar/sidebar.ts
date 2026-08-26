import { Component, computed, contentChildren, input, model } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideDynamicIcon, LucideMenu } from '@lucide/angular';
import { Drawer } from '../drawer/drawer';
import { UiTemplateDirective } from '../shared/ui-template.directive';

type SidebarBreakpoint = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Responsive app-shell layout: a persistent nav column on desktop that collapses to a hamburger
 * button + top bar on mobile, opening the same nav as an off-canvas panel. Wraps the page body
 * (passed as default content) next to the nav, so it's meant to sit once at the root of a routed
 * app (e.g. replacing a hand-rolled header+nav+main layout), not nested per-page.
 *
 * The nav itself is a single `uiTemplate="content"` template, instantiated twice (desktop aside +
 * mobile drawer) via `ngTemplateOutlet` — not `<ng-content>`, which can only render its projected
 * nodes in one place. `header`/`footer` templates are optional chrome (e.g. a logo, a user menu)
 * shown above/below the nav in both layouts.
 *
 * The mobile off-canvas panel reuses `Drawer` (`side="left"`) rather than reimplementing
 * backdrop/focus-trap/Escape-to-close/slide-in behavior — on mobile this component's nav really is
 * just a left `Drawer` with a hamburger trigger.
 */
@Component({
  selector: 'ui-sidebar',
  imports: [NgTemplateOutlet, LucideDynamicIcon, Drawer, UiTemplateDirective],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  /** Whether the mobile off-canvas nav is open. Two-way bindable via `[(mobileOpen)]`. */
  readonly mobileOpen = model(false);
  /** Tailwind breakpoint at/above which the nav becomes a persistent column instead of an off-canvas panel. */
  readonly breakpoint = input<SidebarBreakpoint>('md');
  /** Width of the persistent desktop nav column (any CSS width value). */
  readonly width = input('16rem');
  /** Shown in the mobile top bar next to the hamburger button, and as the mobile nav panel's accessible name. */
  readonly title = input('');
  /** Extra utility classes appended to the root layout element. */
  readonly classNames = input('');
  /** Extra utility classes appended to the `<nav>` element in both layouts. */
  readonly navClassNames = input('');
  /** Closes the mobile off-canvas nav automatically when a click bubbles up from inside it (e.g. a nav link). */
  readonly closeOnMobileNavigate = input(true);

  protected readonly menuIcon = LucideMenu;

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly headerTemplate = computed(() => this.templates().find((t) => t.name() === 'header')?.template);
  protected readonly contentTemplate = computed(
    () => this.templates().find((t) => t.name() === 'content')?.template,
  );
  protected readonly footerTemplate = computed(() => this.templates().find((t) => t.name() === 'footer')?.template);

  protected readonly desktopAsideClass = computed(() => {
    switch (this.breakpoint()) {
      case 'sm':
        return 'hidden sm:flex';
      case 'lg':
        return 'hidden lg:flex';
      case 'xl':
        return 'hidden xl:flex';
      case 'md':
      default:
        return 'hidden md:flex';
    }
  });

  protected readonly mobileBarClass = computed(() => {
    switch (this.breakpoint()) {
      case 'sm':
        return 'flex sm:hidden';
      case 'lg':
        return 'flex lg:hidden';
      case 'xl':
        return 'flex xl:hidden';
      case 'md':
      default:
        return 'flex md:hidden';
    }
  });

  protected onMobileNavClick(): void {
    if (this.closeOnMobileNavigate()) {
      this.mobileOpen.set(false);
    }
  }
}
