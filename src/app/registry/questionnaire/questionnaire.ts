import {
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { Button } from '../button/button';

export interface QuestionnaireOption {
  id: string;
  label: string;
  description?: string;
}

export interface QuestionnaireStep {
  id: string;
  title: string;
  subtitle?: string;
  options: readonly QuestionnaireOption[];
  /** Placeholder for the free-text fallback field below the options; omit to hide that field entirely. */
  otherPlaceholder?: string;
}

export interface QuestionnaireAnswer {
  stepId: string;
  /** Set when an option was picked; mutually exclusive with `otherText`. */
  optionId?: string;
  /** Set when the free-text field was used instead of an option; mutually exclusive with `optionId`. */
  otherText?: string;
}

/**
 * One-question-at-a-time survey flow: a "Question X of Y" progress header, a lettered
 * single-select option list (WAI-ARIA radiogroup — roving tabindex, arrow-key navigation), an
 * optional free-text fallback field, and Next/Back navigation. Each step's answer is either a
 * picked option or the free-text value, never both.
 *
 * Fully controlled: `stepIndex` and `answers` are both `model()`s the caller can read/seed/bind,
 * and `completed` fires with the full answer set when Next is pressed on the last step.
 */
@Component({
  selector: 'ui-questionnaire',
  imports: [Button],
  templateUrl: './questionnaire.html',
})
export class Questionnaire {
  /** Ordered list of questions to step through. */
  readonly steps = input.required<readonly QuestionnaireStep[]>();
  /** Zero-based index of the currently shown step. Two-way bindable via `[(stepIndex)]`. */
  readonly stepIndex = model(0);
  /** Collected answers, one per visited step. Two-way bindable; seed it to resume a flow in progress. */
  readonly answers = model<QuestionnaireAnswer[]>([]);
  /** Label for the Next button on every step except the last. */
  readonly nextLabel = input('Next');
  /** Label for the Next button on the last step. */
  readonly finishLabel = input('Finish');
  /** Label for the Back button, hidden entirely on the first step. */
  readonly backLabel = input('Back');
  /** Extra utility classes appended to the root element. */
  readonly classNames = input('');

  /** Fires with the full answer set when Next is pressed on the last step. */
  readonly completed = output<QuestionnaireAnswer[]>();
  /** Fires with the new index whenever the step changes via Next/Back. */
  readonly stepChange = output<number>();

  protected readonly currentStep = computed(() => this.steps()[this.stepIndex()]);
  protected readonly isLastStep = computed(() => this.stepIndex() === this.steps().length - 1);
  protected readonly isFirstStep = computed(() => this.stepIndex() === 0);

  private readonly currentAnswer = computed(() =>
    this.answers().find((a) => a.stepId === this.currentStep()?.id),
  );
  protected readonly selectedOptionId = computed(() => this.currentAnswer()?.optionId);

  /** Local draft for the free-text field — kept separate from `answers` so typing doesn't spam the model on every keystroke's re-render. */
  protected readonly otherDraft = signal('');

  protected readonly canAdvance = computed(() => {
    const answer = this.currentAnswer();
    return !!answer?.optionId || !!answer?.otherText?.trim();
  });

  private readonly optionRefs = viewChildren<ElementRef<HTMLButtonElement>>('optionRef');
  protected readonly activeIndex = signal(0);

  protected letterFor(index: number): string {
    return String.fromCharCode(65 + index);
  }

  protected isSelected(optionId: string): boolean {
    return this.selectedOptionId() === optionId;
  }

  protected tabIndexFor(index: number): number {
    const selectedIndex = this.currentStep()?.options.findIndex((o) => o.id === this.selectedOptionId()) ?? -1;
    if (selectedIndex >= 0) return index === selectedIndex ? 0 : -1;
    return index === this.activeIndex() ? 0 : -1;
  }

  protected selectOption(optionId: string): void {
    this.upsertAnswer({ stepId: this.currentStep().id, optionId });
    this.otherDraft.set('');
  }

  protected onOtherInput(value: string): void {
    this.otherDraft.set(value);
    if (value.trim()) {
      this.upsertAnswer({ stepId: this.currentStep().id, otherText: value });
    } else {
      this.clearAnswer();
    }
  }

  protected onOptionKeydown(event: KeyboardEvent, index: number): void {
    const options = this.currentStep()?.options ?? [];
    if (!options.length) return;

    let next: number | null = null;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = (index + 1) % options.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = (index - 1 + options.length) % options.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = options.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.activeIndex.set(next);
    this.optionRefs()[next]?.nativeElement.focus();
    this.selectOption(options[next].id);
  }

  protected next(): void {
    if (!this.canAdvance()) return;
    if (this.isLastStep()) {
      this.completed.emit(this.answers());
      return;
    }
    this.stepIndex.update((i) => i + 1);
    this.syncDraftFromAnswer();
    this.stepChange.emit(this.stepIndex());
  }

  protected back(): void {
    if (this.isFirstStep()) return;
    this.stepIndex.update((i) => i - 1);
    this.syncDraftFromAnswer();
    this.stepChange.emit(this.stepIndex());
  }

  private syncDraftFromAnswer(): void {
    this.otherDraft.set(this.currentAnswer()?.otherText ?? '');
    this.activeIndex.set(0);
  }

  private upsertAnswer(answer: QuestionnaireAnswer): void {
    const rest = this.answers().filter((a) => a.stepId !== answer.stepId);
    this.answers.set([...rest, answer]);
  }

  private clearAnswer(): void {
    this.answers.set(this.answers().filter((a) => a.stepId !== this.currentStep()?.id));
  }
}
