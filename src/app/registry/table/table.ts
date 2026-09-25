import { Component, Directive } from '@angular/core';

/**
 * Styled `<table>` wrapper with a horizontal-scroll container for narrow viewports. Compose it
 * with plain `<thead>`/`<tbody>`/`<tr>` and the `uiTableRow`/`uiTableHeadCell`/`uiTableCell`
 * directives below for a fully custom table, or use `DataTable` (`../data-table/data-table`) for
 * a ready-made sortable/paginated/selectable table driven by a column config.
 */
@Component({
  selector: 'ui-table',
  template: `<div class="w-full overflow-x-auto"><table class="w-full text-label-md text-text-primary border-collapse"><ng-content></ng-content></table></div>`,
})
export class Table {}

@Directive({
  selector: '[uiTableRow]',
  host: { class: 'border-b border-divider last:border-b-0 hover:bg-surface-light transition-colors' },
})
export class TableRow {}

@Directive({
  selector: '[uiTableHeadCell]',
  host: { class: 'text-left px-4 py-3 text-label-sm font-semibold text-text-subdued whitespace-nowrap' },
})
export class TableHeadCell {}

@Directive({
  selector: '[uiTableCell]',
  host: { class: 'px-4 py-3 align-middle' },
})
export class TableCell {}
