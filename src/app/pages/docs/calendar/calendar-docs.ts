import { Component, signal } from '@angular/core';
import { Calendar } from '../../../registry/calendar/calendar';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { calendarApi } from '../../../registry/calendar/calendar.api';

@Component({
  selector: 'docs-calendar',
  imports: [Calendar, ApiTable, CodeTabs],
  templateUrl: './calendar-docs.html',
})
export default class CalendarDocs {
  protected readonly selectedDate = signal<Date | null>(null);

  protected readonly minDate = new Date();
  protected readonly maxDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth() + 3, 0);
  protected readonly api = calendarApi;

  protected readonly bindingHtml = `<ui-calendar [(selected)]="selectedDate"></ui-calendar>
<p>selected = {{ selectedDate() ? selectedDate()!.toDateString() : 'none' }}</p>`;

  protected readonly bindingTs = `import { Component, signal } from '@angular/core';
import { Calendar } from './ui/calendar/calendar';

@Component({
  selector: 'app-date-picker',
  imports: [Calendar],
  templateUrl: './date-picker.html',
})
export class DatePicker {
  selectedDate = signal<Date | null>(null);
}`;

  protected readonly weekendsHtml = `<ui-calendar [canDeselectDate]="true" [disabledWeekdays]="[0, 6]"></ui-calendar>`;

  protected readonly weekendsTs = `import { Component } from '@angular/core';
import { Calendar } from './ui/calendar/calendar';

@Component({
  selector: 'app-weekday-picker',
  imports: [Calendar],
  templateUrl: './weekday-picker.html',
})
export class WeekdayPicker {}`;

  protected readonly boundedHtml = `<ui-calendar
  [minEnabledDate]="minDate"
  [maxEnabledDate]="maxDate"
  [canSelectPreviousDates]="true"
></ui-calendar>`;

  protected readonly boundedTs = `import { Component } from '@angular/core';
import { Calendar } from './ui/calendar/calendar';

@Component({
  selector: 'app-bounded-calendar',
  imports: [Calendar],
  templateUrl: './bounded-calendar.html',
})
export class BoundedCalendar {
  minDate = new Date();
  maxDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth() + 3, 0);
}`;

  protected readonly disabledHtml = `<ui-calendar [disabled]="true"></ui-calendar>`;

  protected readonly disabledTs = `import { Component } from '@angular/core';
import { Calendar } from './ui/calendar/calendar';

@Component({
  selector: 'app-disabled-calendar',
  imports: [Calendar],
  templateUrl: './disabled-calendar.html',
})
export class DisabledCalendar {}`;
}
