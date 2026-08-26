import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ui-kit-theme';

/**
 * App-level (not registry — this isn't a copyable library piece) light/dark theme toggle.
 *
 * The actual theme switch is pure CSS: `src/styles/theme-dark.css` remaps the semantic color
 * tokens under `:root[data-theme="dark"]`. This service only owns the signal + persistence +
 * DOM attribute write. An inline script in `index.html` sets the same attribute before Angular
 * even bootstraps (from localStorage, falling back to `prefers-color-scheme`) so there's no flash
 * of the wrong theme — this service reads that already-resolved attribute as its initial value
 * instead of re-deriving it, so the two never disagree.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeSignal = signal<Theme>(this.readInitialTheme());
  readonly theme = this.themeSignal.asReadonly();

  private readInitialTheme(): Theme {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  toggle(): void {
    this.setTheme(this.themeSignal() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }
}
