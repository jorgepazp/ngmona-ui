import { Component, ElementRef, computed, effect, input, model, output, signal, viewChild } from '@angular/core';
import { LucideDynamicIcon, LucideSearch, type LucideIconInput } from '@lucide/angular';

export interface CommandItem {
  label: string;
  value: unknown;
  icon?: LucideIconInput;
  disabled?: boolean;
  /** Extra terms matched by the filter in addition to `label` (e.g. aliases). */
  keywords?: string[];
}

export interface CommandGroupDef {
  label: string;
  items: CommandItem[];
}

let nextId = 0;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Command palette (⌘K-style) shown as a centered dialog with a search input that filters a
 * grouped list of actions, with full keyboard navigation and a `selected` output emitting the
 * chosen item's `value`.
 *
 * Bind `[(open)]` to control visibility. Opening it globally, for example from a keyboard
 * shortcut, is left to the consuming page.
 */
@Component({
  selector: 'ui-command',
  imports: [LucideDynamicIcon],
  templateUrl: './command.html',
})
export class Command {
  /** Whether the palette dialog is visible. Two-way bindable via `[(open)]`. */
  readonly open = model(false);
  /** Grouped list of actions shown in the palette, each rendered under its group's label. */
  readonly groups = input<CommandGroupDef[]>([]);
  /** Placeholder text for the search input. */
  readonly placeholder = input('Type a command or search...');
  /** Message shown when no item matches the current query. */
  readonly emptyText = input('No results found.');
  /** Whether clicking the backdrop closes the palette. */
  readonly closeOnBackdrop = input(true);

  /** Fires with the chosen item's `value` when the user picks (click or Enter) an item; also closes the palette. */
  readonly selected = output<unknown>();

  protected readonly searchIcon = LucideSearch;

  protected readonly query = signal('');
  protected readonly activeIndex = signal(0);

  protected readonly titleId = `ui-command-title-${nextId++}`;
  protected readonly listboxId = `ui-command-listbox-${nextId++}`;

  private readonly searchInputEl = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private previouslyFocused: HTMLElement | null = null;

  /** Groups filtered down to items matching `query`, with empty groups dropped entirely. */
  protected readonly filteredGroups = computed(() => {
    const q = this.query().trim().toLowerCase();
    const groups = this.groups();
    if (!q) return groups;

    return groups
      .map((group) => ({
        label: group.label,
        items: group.items.filter(
          (item) => item.label.toLowerCase().includes(q) || item.keywords?.some((k) => k.toLowerCase().includes(q)),
        ),
      }))
      .filter((group) => group.items.length > 0);
  });

  /** The filtered groups' items flattened in display order — what keyboard nav walks over. */
  protected readonly flatItems = computed(() => this.filteredGroups().flatMap((g) => g.items));

  constructor() {
    // Focus the search input on open, restore focus to whatever opened us on close.
    effect(() => {
      const isOpen = this.open();
      const searchEl = this.searchInputEl()?.nativeElement;
      if (isOpen && searchEl) {
        this.previouslyFocused ??= document.activeElement as HTMLElement | null;
        searchEl.focus();
      } else if (!isOpen && this.previouslyFocused) {
        this.previouslyFocused.focus();
        this.previouslyFocused = null;
      }
    });

    // Reset search + active item every time the palette opens.
    effect(() => {
      if (this.open()) {
        this.query.set('');
        this.activeIndex.set(0);
      }
    });
  }

  protected itemDomId(index: number): string {
    return `${this.listboxId}-option-${index}`;
  }

  protected close(): void {
    this.open.set(false);
  }

  protected onBackdropClick(): void {
    if (this.closeOnBackdrop()) this.close();
  }

  protected onQueryChange(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeIndex.set(0);
  }

  protected executeItem(item: CommandItem): void {
    if (item.disabled) return;
    this.selected.emit(item.value);
    this.close();
  }

  protected onSearchKeydown(event: KeyboardEvent): void {
    const items = this.flatItems();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!items.length) break;
        this.activeIndex.set((this.activeIndex() + 1) % items.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!items.length) break;
        this.activeIndex.set((this.activeIndex() - 1 + items.length) % items.length);
        break;
      case 'Home':
        if (items.length) {
          event.preventDefault();
          this.activeIndex.set(0);
        }
        break;
      case 'End':
        if (items.length) {
          event.preventDefault();
          this.activeIndex.set(items.length - 1);
        }
        break;
      case 'Enter': {
        event.preventDefault();
        const active = items[this.activeIndex()];
        if (active) this.executeItem(active);
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  protected onKeydownTab(event: Event): void {
    if (!(event instanceof KeyboardEvent)) return;
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return;

    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
