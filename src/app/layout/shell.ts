import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideMoon, LucideSun } from '@lucide/angular';
import { Button } from '../registry/button/button';
import { SearchInput } from '../registry/search-input/search-input';
import { Sidebar } from '../registry/sidebar/sidebar';
import { UiTemplateDirective } from '../registry/shared/ui-template.directive';
import { Toaster } from '../registry/toast/toaster';
import { ThemeService } from '../theme/theme.service';
import { NAV_ITEMS } from './nav-items';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Toaster, Sidebar, UiTemplateDirective, Button, SearchInput],
  templateUrl: './shell.html',
})
export class Shell {
  protected readonly theme = inject(ThemeService);
  protected readonly sunIcon = LucideSun;
  protected readonly moonIcon = LucideMoon;

  protected readonly search = signal('');
  protected readonly filteredNavItems = computed(() => {
    const query = this.search().trim().toLowerCase();
    if (!query) return NAV_ITEMS;
    return NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(query));
  });
}
