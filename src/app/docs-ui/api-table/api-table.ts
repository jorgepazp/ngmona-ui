import { Component, computed, input } from '@angular/core';
import { Table, TableCell, TableHeadCell, TableRow } from '../../registry/table/table';

export interface ApiProp {
  name: string;
  kind: 'input' | 'output' | 'model';
  required: boolean;
  /** Type text as written in the source's generic argument, or inferred from the default value when omitted. */
  type: string;
  /** Raw default-value expression as written in the source; empty for required inputs and outputs. */
  defaultValue: string;
  description: string;
}

export interface ComponentApiDoc {
  name: string;
  description: string;
  props: ApiProp[];
}

/**
 * Renders a component's usage description + inputs/two-way-bindings/outputs tables from a
 * generated `ComponentApiDoc` (see `scripts/generate-api-docs.mjs` — run `npm run api-docs` after
 * changing a component's public signals to regenerate its `<name>.api.ts`). Docs-app only, kept
 * outside `registry/` so it never gets bundled when someone copies a component folder.
 */
@Component({
  selector: 'app-api-table',
  imports: [Table, TableRow, TableHeadCell, TableCell],
  templateUrl: './api-table.html',
})
export class ApiTable {
  readonly doc = input.required<ComponentApiDoc>();

  protected readonly inputs = computed(() => this.doc().props.filter((p) => p.kind === 'input'));
  protected readonly models = computed(() => this.doc().props.filter((p) => p.kind === 'model'));
  protected readonly outputs = computed(() => this.doc().props.filter((p) => p.kind === 'output'));
}
