import { Component, ElementRef, effect, signal, viewChild } from '@angular/core';
import { buildTheme, formatOklch, RAMP_STEPS } from '@ngmona-ui/color';
import { ROLES } from '@ngmona-ui/color/src/roles.js';
import { Button } from '../../../registry/button/button';
import { Badge } from '../../../registry/badge/badge';
import { Avatar } from '../../../registry/avatar/avatar';
import { Alert } from '../../../registry/alert/alert';
import { Card } from '../../../registry/card/card';

// Mirrors scripts/theme.seeds.json. An intentional small duplication, same reasoning as
// packages/cli/src/lib/default-seeds.js: this docs only page has no build time access to that
// JSON file, and seven hex strings are not worth wiring an import for.
const INITIAL_SEEDS: Record<string, string> = {
  primary: '#D5006C',
  accent: '#3B3CF7',
  danger: '#FF4B4B',
  info: '#007EFF',
  warning: '#FFC058',
  success: '#15CC96',
  neutral: '#7A828C',
};

/**
 * Docs only live preview. Overrides the primitive ramp custom properties on a scoped container,
 * computed in the browser with the same `@ngmona-ui/color` used by the real generator. Every
 * semantic token (surface, text, border, and so on) already resolves through `var()` to those
 * primitives, so it updates for free, nothing here writes to any semantic token directly. This
 * page is not part of the component registry and is never installed by the CLI.
 */
@Component({
  selector: 'guide-theme-editor',
  imports: [Button, Badge, Avatar, Alert, Card],
  templateUrl: './theme-editor.html',
})
export default class ThemeEditorGuide {
  protected readonly roles = ROLES;
  protected readonly seeds = signal<Record<string, string>>({ ...INITIAL_SEEDS });
  protected readonly copied = signal(false);

  private readonly preview = viewChild<ElementRef<HTMLElement>>('preview');

  constructor() {
    effect(() => {
      const container = this.preview()?.nativeElement;
      if (!container) return;

      const theme = buildTheme(this.seeds());
      for (const [role, ramp] of Object.entries(theme.ramps)) {
        for (const step of RAMP_STEPS) {
          container.style.setProperty(`--color-${role}-${step}`, formatOklch(ramp[step]));
        }
        container.style.setProperty(`--color-${role}`, formatOklch(ramp[500]));
      }
    });
  }

  protected setSeed(role: string, value: string): void {
    this.seeds.update((current) => ({ ...current, [role]: value }));
  }

  protected reset(): void {
    this.seeds.set({ ...INITIAL_SEEDS });
  }

  protected async copySeeds(): Promise<void> {
    await navigator.clipboard.writeText(JSON.stringify(this.seeds(), null, 2));
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
