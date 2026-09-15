import { Component, computed, input, model } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';

type PageToken = number | 'ellipsis';

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i);
}

function paginationRange(current: number, total: number, siblingCount: number): PageToken[] {
  const totalVisible = siblingCount * 2 + 5; // first + last + current + siblings on each side + slack
  if (total <= totalVisible) {
    return range(1, total);
  }

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 3 + siblingCount * 2), 'ellipsis', total];
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, 'ellipsis', ...range(total - (3 + siblingCount * 2) + 1, total)];
  }
  return [1, 'ellipsis', ...range(leftSibling, rightSibling), 'ellipsis', total];
}

/**
 * Page-number navigation with previous and next buttons plus a condensed page-number range that
 * collapses to ellipses for large page counts.
 *
 * Purely presentational: it only controls a `page` index. Slicing the underlying dataset is left
 * to the caller. Use `siblingCount` to control how many page numbers show on each side of the
 * current page.
 */
@Component({
  selector: 'ui-paginator',
  imports: [LucideChevronLeft, LucideChevronRight],
  templateUrl: './paginator.html',
})
export class Paginator {
  /** Zero-based current page index. Two-way bindable via `[(page)]`. */
  readonly page = model(0);
  /** Total number of pages. */
  readonly pageCount = input.required<number>();
  /** How many page numbers to show on each side of the current page. */
  readonly siblingCount = input(1);
  /** Disables the previous/next buttons and every page-number button. */
  readonly disabled = input(false);
  /** Extra utility classes appended to the nav element. */
  readonly classNames = input('');

  protected readonly pages = computed<PageToken[]>(() =>
    paginationRange(this.page() + 1, this.pageCount(), this.siblingCount()),
  );

  protected readonly canGoPrevious = computed(() => this.page() > 0);
  protected readonly canGoNext = computed(() => this.page() < this.pageCount() - 1);

  protected goToPage(page: number): void {
    if (this.disabled() || page < 0 || page >= this.pageCount() || page === this.page()) return;
    this.page.set(page);
  }

  protected previous(): void {
    this.goToPage(this.page() - 1);
  }

  protected next(): void {
    this.goToPage(this.page() + 1);
  }
}
