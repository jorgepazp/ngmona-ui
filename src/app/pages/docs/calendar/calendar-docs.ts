import { Component, signal } from '@angular/core';
import { Calendar } from '../../../registry/calendar/calendar';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { calendarApi } from '../../../registry/calendar/calendar.api';

@Component({
  selector: 'docs-calendar',
  imports: [Calendar, ApiTable],
  templateUrl: './calendar-docs.html',
})
export default class CalendarDocs {
  protected readonly selectedDate = signal<Date | null>(null);

  protected readonly minDate = new Date();
  protected readonly maxDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth() + 3, 0);
  protected readonly api = calendarApi;
}
