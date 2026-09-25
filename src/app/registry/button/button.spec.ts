import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { LucideTrash2 } from '@lucide/angular';
import { Button } from './button';
import { LegacyButton } from './legacy-button';
import { TooltipDirective } from '../tooltip/tooltip.directive';

function render<T>(component: new () => T) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  TestBed.tick();
  return fixture;
}

describe('Button (uiButton)', () => {
  it('styles the native <button> itself, defaulting to type="button" and keeping consumer classes and styles', () => {
    @Component({
      imports: [Button],
      template: `<button uiButton class="mt-2" [style.width.px]="200">Save</button>
        <button uiButton type="submit">Send</button>`,
    })
    class Host {}
    const buttons: HTMLButtonElement[] = [...render(Host).nativeElement.querySelectorAll('button')];

    expect(buttons[0].getAttribute('type')).toBe('button');
    expect(buttons[0].classList).toContain('mt-2');
    expect(buttons[0].classList).toContain('bg-primary-500');
    expect(buttons[0].style.width).toBe('200px');
    expect(buttons[1].getAttribute('type')).toBe('submit');
  });

  it('applies severity colors and the pill shape', () => {
    @Component({
      imports: [Button],
      template: `<button uiButton color="danger">A</button>
        <button uiButton variant="secondary" color="warning">B</button>
        <button uiButton shape="pill">C</button>
        <button uiButton>D</button>`,
    })
    class Host {}
    const [danger, warning, pill, plain]: HTMLButtonElement[] = [...render(Host).nativeElement.querySelectorAll('button')];

    expect(danger.classList).toContain('bg-surface-danger');
    expect(danger.classList).toContain('text-text-primary-inverse');
    expect(warning.classList).toContain('text-text-warning');
    expect(pill.classList).toContain('!rounded-full');
    expect(plain.classList).toContain('rounded');
    expect(plain.classList).not.toContain('!rounded-full');
  });

  it('disables a <button> natively, and an <a> with aria-disabled, no tab stop and no pointer input', () => {
    @Component({
      imports: [Button, RouterLink],
      template: `<button uiButton [disabled]="off()">A</button>
        <a uiButton routerLink="/settings" [disabled]="off()">B</a>`,
    })
    class Host {
      off = signal(true);
    }
    const fixture = render(Host);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');

    expect(button.disabled).toBe(true);
    expect(link.getAttribute('href')).toBe('/settings');
    expect(link.hasAttribute('type')).toBe(false);
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('-1');
    expect(link.classList).toContain('pointer-events-none');

    fixture.componentInstance.off.set(false);
    fixture.detectChanges();
    expect(button.disabled).toBe(false);
    expect(link.hasAttribute('aria-disabled')).toBe(false);
    expect(link.hasAttribute('tabindex')).toBe(false);
  });

  it('names an icon-only button after the tooltip on the same element, without also describing it', () => {
    @Component({
      imports: [Button, TooltipDirective],
      template: `<button uiButton variant="icon" [icon]="icon" uiTooltip="Delete" [uiTooltipVisible]="true"></button>
        <button uiButton variant="icon" [icon]="icon" aria-label="Remove" uiTooltip="Delete"></button>`,
    })
    class Host {
      icon = LucideTrash2;
    }
    const [fromTooltip, explicit]: HTMLButtonElement[] = [...render(Host).nativeElement.querySelectorAll('button')];

    expect(fromTooltip.getAttribute('aria-label')).toBe('Delete');
    expect(fromTooltip.hasAttribute('aria-describedby')).toBe(false);
    expect(explicit.getAttribute('aria-label')).toBe('Remove');
  });

  it('warns in development about an icon-only button with no accessible name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    @Component({
      imports: [Button],
      template: `<button uiButton variant="icon" [icon]="icon"></button>
        <button uiButton variant="icon" [icon]="icon" aria-label="Delete"></button>`,
    })
    class Host {
      icon = LucideTrash2;
    }
    render(Host);

    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain('no accessible name');
    warn.mockRestore();
  });
});

describe('LegacyButton (<ui-button>)', () => {
  it('keeps the old API working on top of uiButton', () => {
    @Component({
      imports: [LegacyButton],
      template: `<ui-button classNames="mt-2" attrType="submit" ariaLabel="Save" (clicked)="clicks = clicks + 1">Save</ui-button>`,
    })
    class Host {
      clicks = 0;
    }
    const fixture = render(Host);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('ui-button > button');

    expect(button.classList).toContain('mt-2');
    expect(button.classList).toContain('bg-primary-500');
    expect(button.getAttribute('type')).toBe('submit');
    expect(button.getAttribute('aria-label')).toBe('Save');
    button.click();
    expect(fixture.componentInstance.clicks).toBe(1);
  });
});
