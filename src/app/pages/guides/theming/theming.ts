import { Component } from '@angular/core';
import { ROLES } from '@ngmona-ui/color/src/roles.js';
import { RAMP_STEPS } from '@ngmona-ui/color/src/ramp.js';

@Component({
  selector: 'guide-theming',
  templateUrl: './theming.html',
})
export default class ThemingGuide {
  protected readonly roles = ROLES;
  protected readonly steps = RAMP_STEPS;

  protected swatchColor(role: string, step: number): string {
    return `var(--color-${role}-${step})`;
  }
}
