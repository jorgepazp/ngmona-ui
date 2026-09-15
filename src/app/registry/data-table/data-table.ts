import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, computed, contentChildren, input, model } from '@angular/core';
import { LucideChevronDown, LucideChevronUp, LucideChevronsUpDown, LucideDynamicIcon } from '@lucide/angular';
import { Checkbox } from '../checkbox/checkbox';
import { Paginator } from '../paginator/paginator';
import { Radio } from '../radio/radio';
import { Skeleton } from '../skeleton/skeleton';
import { Table, TableCell, TableHeadCell, TableRow } from '../table/table';
import { UiTemplateDirective } from '../shared/ui-template.directive';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  /** Extracts the cell value for default rendering and client-side sort/filter. Defaults to `row[key]`. */
  accessor?: (row: T) => unknown;
}

export type SortDirection = 'asc' | 'desc';
export interface DataTableSort {
  key: string;
  direction: SortDirection;
}

/**
 * Sortable, paginated, selectable table driven by a column config. Customize rendering per
 * column with `uiTemplate="cell-<key>"` and `uiTemplate="header-<key>"`, and the empty state with
 * `uiTemplate="empty"`.
 *
 * By default the table runs in client-side mode: pass the full dataset via `data`, and sorting,
 * filtering and paging all happen in memory. Set `totalCount` to switch to controlled mode: pass
 * only the current page's rows in `data`, and the table reflects `page`, `sortState` and
 * `globalFilter` changes instead of slicing or sorting internally, so you can refetch from the
 * backend.
 *
 * Set `rowKey` to extract a stable identity per row, for example `(row) => row.id`, when rows are
 * recreated across page fetches. It defaults to the row object itself.
 */
@Component({
  selector: 'ui-data-table',
  imports: [Table, TableRow, TableHeadCell, TableCell, Checkbox, Radio, Paginator, Skeleton, NgTemplateOutlet, LucideDynamicIcon],
  templateUrl: './data-table.html',
})
export class DataTable<T> {
  /** Row data. In client-side mode, the full dataset; in controlled mode (`totalCount` set), only the current page's rows. */
  readonly data = input<readonly T[]>([]);
  /** Column definitions — header text, sortability, alignment, width, and an optional value accessor. */
  readonly columns = input.required<DataTableColumn<T>[]>();
  /** Extracts a stable identity per row, used for selection and `@for` tracking. Defaults to the row object itself (reference equality). */
  readonly rowKey = input<(row: T) => unknown>((row: T) => row);
  /** Row selection mode — adds a checkbox column (`multi`) or radio column (`single`) when not `'none'`. */
  readonly selectable = input<'none' | 'single' | 'multi'>('none');
  /** Currently selected rows. Two-way bindable via `[(selected)]`. */
  readonly selected = model<T[]>([]);
  /** Active sort column/direction, or `null` when unsorted. Two-way bindable; toggled by clicking a sortable header. */
  readonly sortState = model<DataTableSort | null>(null);
  /** Zero-based current page index. Two-way bindable via `[(page)]`. */
  readonly page = model(0);
  /** Rows per page (client-side mode) — or the row count `data` is expected to contain per page (controlled mode). */
  readonly pageSize = input(10);
  /** Switches to controlled mode when provided — see class doc. */
  readonly totalCount = input<number | undefined>(undefined);
  /** Shows skeleton placeholder rows instead of `data` while a fetch is in flight. */
  readonly loading = input(false);
  /** Fallback text shown when there are no rows to display; overridden by a `uiTemplate="empty"`. */
  readonly emptyMessage = input('No data');
  /** Client-side-only free-text filter, matched against every column's rendered value. Two-way bindable. */
  readonly globalFilter = model('');
  /** Accessible name for the underlying `<table>`. */
  readonly ariaLabel = input<string | undefined>(undefined);

  protected readonly chevronUpIcon = LucideChevronUp;
  protected readonly chevronDownIcon = LucideChevronDown;
  protected readonly chevronsUpDownIcon = LucideChevronsUpDown;

  protected readonly isControlled = computed(() => this.totalCount() !== undefined);

  private readonly templates = contentChildren(UiTemplateDirective);
  protected readonly emptyTemplate = computed(() => this.templates().find((t) => t.name() === 'empty')?.template);

  protected cellTemplate(key: string): TemplateRef<unknown> | undefined {
    return this.templates().find((t) => t.name() === `cell-${key}`)?.template;
  }

  protected headerTemplate(key: string): TemplateRef<unknown> | undefined {
    return this.templates().find((t) => t.name() === `header-${key}`)?.template;
  }

  protected cellValue(row: T, column: DataTableColumn<T>): unknown {
    return column.accessor ? column.accessor(row) : (row as Record<string, unknown>)[column.key];
  }

  protected alignClass(align: DataTableColumn<T>['align']): string {
    return align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : '';
  }

  private readonly filteredData = computed(() => {
    if (this.isControlled()) return this.data();
    const query = this.globalFilter().trim().toLowerCase();
    if (!query) return this.data();
    return this.data().filter((row) =>
      this.columns().some((column) => `${this.cellValue(row, column)}`.toLowerCase().includes(query)),
    );
  });

  private readonly sortedData = computed(() => {
    if (this.isControlled()) return this.filteredData();
    const sort = this.sortState();
    const column = sort && this.columns().find((c) => c.key === sort.key);
    if (!sort || !column) return this.filteredData();

    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...this.filteredData()].sort((a, b) => {
      const av = this.cellValue(a, column);
      const bv = this.cellValue(b, column);
      if (av == null && bv == null) return 0;
      if (av == null) return dir;
      if (bv == null) return -dir;
      if (av < bv) return -dir;
      if (av > bv) return dir;
      return 0;
    });
  });

  protected readonly pageCount = computed(() => {
    const total = this.isControlled() ? (this.totalCount() ?? 0) : this.sortedData().length;
    return Math.max(1, Math.ceil(total / this.pageSize()));
  });

  protected readonly pagedData = computed(() => {
    if (this.isControlled()) return this.data();
    const start = this.page() * this.pageSize();
    return this.sortedData().slice(start, start + this.pageSize());
  });

  protected readonly skeletonRows = computed(() => Array.from({ length: Math.min(this.pageSize(), 10) }));

  protected toggleSort(column: DataTableColumn<T>): void {
    if (!column.sortable) return;
    const current = this.sortState();
    if (!current || current.key !== column.key) {
      this.sortState.set({ key: column.key, direction: 'asc' });
    } else if (current.direction === 'asc') {
      this.sortState.set({ key: column.key, direction: 'desc' });
    } else {
      this.sortState.set(null);
    }
    this.page.set(0);
  }

  protected trackRow = (row: T): unknown => this.rowKey()(row);

  protected isSelected(row: T): boolean {
    const key = this.rowKey()(row);
    return this.selected().some((r) => this.rowKey()(r) === key);
  }

  protected toggleRow(row: T): void {
    if (this.selectable() === 'single') {
      this.selected.set(this.isSelected(row) ? [] : [row]);
      return;
    }
    const key = this.rowKey()(row);
    this.selected.set(
      this.isSelected(row) ? this.selected().filter((r) => this.rowKey()(r) !== key) : [...this.selected(), row],
    );
  }

  protected readonly allOnPageSelected = computed(() => {
    const rows = this.pagedData();
    return rows.length > 0 && rows.every((r) => this.isSelected(r));
  });

  protected readonly someOnPageSelected = computed(
    () => this.pagedData().some((r) => this.isSelected(r)) && !this.allOnPageSelected(),
  );

  protected toggleAllOnPage(): void {
    const pageRows = this.pagedData();
    if (this.allOnPageSelected()) {
      const pageKeys = new Set(pageRows.map((r) => this.rowKey()(r)));
      this.selected.set(this.selected().filter((r) => !pageKeys.has(this.rowKey()(r))));
    } else {
      const existingKeys = new Set(this.selected().map((r) => this.rowKey()(r)));
      this.selected.set([...this.selected(), ...pageRows.filter((r) => !existingKeys.has(this.rowKey()(r)))]);
    }
  }
}
