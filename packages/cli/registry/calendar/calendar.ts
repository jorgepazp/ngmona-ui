import { Component, computed, forwardRef, input, model, signal, effect } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';

type WeekdayNames = [string, string, string, string, string, string, string];
type MonthNames = [
  string, string, string, string, string, string,
  string, string, string, string, string, string,
];

const DEFAULT_WEEKDAY_NAMES: WeekdayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];
const DEFAULT_MONTH_NAMES: MonthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isSameMonth(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function addMonths(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
}

/**
 * Month-grid date picker with native forms interop (`ControlValueAccessor`) and a signal-based
 * `[(selected)]` two-way binding for standalone usage — same bridging pattern as `Checkbox`.
 *
 * Fixes carried over from the original: `canSelectCurrentDay` was inverted (it disabled today
 * instead of enabling it) and was redundant with a second, always-on "no past dates" check inside
 * `selectDay` that ran regardless of `canSelectPreviousDates` — between the two, today's date could
 * never actually be selected no matter which inputs were set. Both are fixed here: a single
 * `isDayDisabled` check handles today/past/future consistently. The next/previous-month buttons
 * also used to render inconsistently when disabled — the "prev" button vanished (`*ngIf`) while
 * "next" tried (and failed, via a nonexistent `text-color-icon-disabled` class) to dim; both
 * are now real `disabled` buttons with matching, working styles. The offset math for the first
 * week of the month has been rewritten as a single modulo expression — the original had an
 * unmodded subtraction that went negative for some `startDayOffset` values, worked around with a
 * second special-cased branch elsewhere in the matrix-building loop. The prev/next-month buttons
 * also carried a `fade` trigger binding that was pure dead weight: both buttons are always
 * mounted (never inserted/removed), so the enter/leave transitions it declared could never fire —
 * removed rather than migrated.
 */
@Component({
  selector: 'ui-calendar',
  imports: [LucideChevronLeft, LucideChevronRight],
  templateUrl: './calendar.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Calendar),
      multi: true,
    },
  ],
})
export class Calendar implements ControlValueAccessor {
  /** Currently selected date. Two-way bindable via `[(selected)]`. */
  readonly selected = model<Date | null>(null);
  /** Disables the whole calendar — no day, or the prev/next-month buttons, can be interacted with. */
  readonly disabled = input(false);

  /** Weekday names, starting from Sunday, rotated for display according to `startDayOffset`. */
  readonly weekdayNames = input<WeekdayNames>(DEFAULT_WEEKDAY_NAMES);
  /** Month names, January first, used for the header label (e.g. "March 2026"). */
  readonly monthNames = input<MonthNames>(DEFAULT_MONTH_NAMES);
  /** First day of the week shown in the grid: 0 = Sunday, 1 = Monday, ... 6 = Saturday. */
  readonly startDayOffset = input<0 | 1 | 2 | 3 | 4 | 5 | 6>(1);

  /** Specific dates disabled in addition to any weekday/past/future rules. */
  readonly disabledDates = input<Date[]>([]);
  /** Weekday indices (0 = Sunday ... 6 = Saturday) disabled on every month, e.g. `[0, 6]`. */
  readonly disabledWeekdays = input<number[]>([]);
  /** When set, only dates present in this array are selectable — overrides every other rule. */
  readonly enabledDates = input<Date[] | null>(null);
  /** Whether dates before today can be selected. */
  readonly canSelectPreviousDates = input(false);
  /** Whether today's date can be selected. */
  readonly canSelectCurrentDay = input(true);
  /** Whether clicking the already-selected day clears the selection. */
  readonly canDeselectDate = input(false);
  /** Earliest month the caller can navigate to; disables the "previous month" button once reached. */
  readonly minEnabledDate = input<Date | null>(null);
  /** Latest month the caller can navigate to; disables the "next month" button once reached. */
  readonly maxEnabledDate = input<Date | null>(null);

  protected readonly prevIcon = LucideChevronLeft;
  protected readonly nextIcon = LucideChevronRight;

  private readonly today = startOfDay(new Date());
  protected readonly viewDate = signal(startOfDay(new Date()));

  private readonly formDisabled = signal(false);
  protected readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  protected readonly monthLabel = computed(() => {
    const view = this.viewDate();
    const name = this.monthNames()[view.getMonth()];
    return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${view.getFullYear()}`;
  });

  protected readonly weekdayHeaders = computed(() => {
    const names = this.weekdayNames();
    const offset = this.startDayOffset();
    return Array.from({ length: 7 }, (_, i) => {
      const index = (offset + i) % 7;
      return { index, name: names[index] };
    });
  });

  protected readonly weeks = computed<(Date | null)[][]>(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay();
    const offset = (firstWeekday - this.startDayOffset() + 7) % 7;

    const cells: (Date | null)[] = Array.from({ length: offset }, () => null);
    for (let day = 1; day <= totalDays; day++) {
      cells.push(new Date(year, month, day));
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const rows: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(cells.slice(i, i + 7));
    }
    return rows;
  });

  protected readonly canGoToPreviousMonth = computed(() => {
    const min = this.minEnabledDate();
    return !min || !isSameMonth(this.viewDate(), min);
  });

  protected readonly canGoToNextMonth = computed(() => {
    const max = this.maxEnabledDate();
    return !max || !isSameMonth(this.viewDate(), max);
  });

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => this.onChange(this.selected()));
  }

  protected previousMonth(): void {
    if (!this.canGoToPreviousMonth()) return;
    this.viewDate.update((d) => addMonths(d, -1));
  }

  protected nextMonth(): void {
    if (!this.canGoToNextMonth()) return;
    this.viewDate.update((d) => addMonths(d, 1));
  }

  protected isToday(date: Date): boolean {
    return isSameDay(date, this.today);
  }

  protected isSelected(date: Date): boolean {
    return isSameDay(date, this.selected());
  }

  protected isWeekend(dayIndex: number): boolean {
    return dayIndex === 0 || dayIndex === 6;
  }

  protected isDayDisabled(date: Date): boolean {
    const enabled = this.enabledDates();
    if (enabled) {
      return !enabled.some((d) => isSameDay(d, date));
    }
    if (this.disabledWeekdays().includes(date.getDay())) {
      return true;
    }

    const day = startOfDay(date);
    if (isSameDay(day, this.today)) {
      return !this.canSelectCurrentDay();
    }
    if (day < this.today && !this.canSelectPreviousDates()) {
      return true;
    }

    return this.disabledDates().some((d) => isSameDay(d, date));
  }

  protected dayClass(date: Date): string {
    const disabled = this.isDisabled() || this.isDayDisabled(date);
    const selected = this.isSelected(date);
    const classes = [disabled ? 'opacity-30 !cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-500'];

    if (selected) {
      classes.push('bg-primary-500 !text-white hover:!bg-primary-500');
    } else if (this.isWeekend(date.getDay())) {
      classes.push('text-danger-500');
    }
    if (this.isToday(date) && !selected) {
      classes.push('font-bold ring-1 ring-inset ring-primary-500');
    }
    return classes.join(' ');
  }

  protected dayLabel(date: Date): string {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  protected selectDay(date: Date): void {
    if (this.isDisabled() || this.isDayDisabled(date)) return;
    if (this.isSelected(date) && this.canDeselectDate()) {
      this.selected.set(null);
      return;
    }
    this.selected.set(date);
  }

  protected markTouched(): void {
    this.onTouched();
  }

  writeValue(value: Date | null): void {
    this.selected.set(value ?? null);
    if (value) {
      this.viewDate.set(startOfDay(value));
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }
}
