import { Component, computed, contentChildren, input, model } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideDynamicIcon, LucideMenu } from '@lucide/angular';
import { Drawer } from '../drawer/drawer';
import { UiTemplateDirective } from '../shared/ui-template.directive';

type SidebarBreakpoint = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Responsive app-shell layout: a persistent navigation column on desktop that collapses to a
 * hamburger button and top bar on mobile, opening the same navigation as an off-canvas panel.
 *
 * Wrap the page body as the default projected content. This component is meant to sit once at
 * the root of a routed app, rather than nested per page. Provide the navigation itself with a
 * `content` template via `uiTemplate`, and optional `header`/`footer` templates for chrome such
 * as a logo or a user menu, shown in both layouts. `breakpoint` sets the Tailwind breakpoint at
 * and above which the navigation becomes a persistent column instead of an off-canvas panel.
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
