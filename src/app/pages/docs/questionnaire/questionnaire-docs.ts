import { Component, signal } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Button } from '../../../registry/button/button';
import { Questionnaire, QuestionnaireAnswer, QuestionnaireStep } from '../../../registry/questionnaire/questionnaire';
import { questionnaireApi } from '../../../registry/questionnaire/questionnaire.api';

const STEPS: QuestionnaireStep[] = [
  {
    id: 'next-feature',
    title: 'What should the agent build next?',
    subtitle: 'Choose a direction or describe another task.',
    options: [
      { id: 'timeline', label: 'Tool call timeline', description: 'Show what the agent ran and what came back.' },
      { id: 'approvals', label: 'Approval checkpoints', description: 'Ask before sensitive or destructive actions.' },
      { id: 'handoffs', label: 'Sub-agent handoffs', description: 'Make delegated work and results easier to follow.' },
    ],
    otherPlaceholder: 'Describe another feature…',
  },
  {
    id: 'priority',
    title: 'How urgent is this?',
    subtitle: 'This helps us plan the next release.',
    options: [
      { id: 'now', label: 'Blocking', description: "Can't ship without it." },
      { id: 'soon', label: 'Soon', description: 'Would like it in the next couple of releases.' },
      { id: 'later', label: 'Eventually', description: 'Nice to have, no rush.' },
    ],
  },
  {
    id: 'audience',
    title: 'Who is this mainly for?',
    options: [
      { id: 'you', label: 'Just me', description: 'Personal project or experimentation.' },
      { id: 'team', label: 'My team', description: 'Shared internally at work.' },
      { id: 'public', label: 'Everyone', description: 'A public-facing product.' },
    ],
    otherPlaceholder: 'Someone else…',
  },
];

@Component({
  selector: 'docs-questionnaire',
  imports: [Questionnaire, ApiTable, Button, CodeTabs],
  templateUrl: './questionnaire-docs.html',
})
export default class QuestionnaireDocs {
  protected readonly api = questionnaireApi;
  protected readonly steps = STEPS;
  protected readonly stepIndex = signal(0);
  protected readonly answers = signal<QuestionnaireAnswer[]>([]);
  protected readonly result = signal<QuestionnaireAnswer[] | null>(null);

  protected onCompleted(answers: QuestionnaireAnswer[]): void {
    this.result.set(answers);
  }

  protected restart(): void {
    this.stepIndex.set(0);
    this.answers.set([]);
    this.result.set(null);
  }

  protected readonly basicHtml = `<ui-questionnaire
  [steps]="steps"
  [(stepIndex)]="stepIndex"
  [(answers)]="answers"
  (completed)="onCompleted($event)"
></ui-questionnaire>`;

  protected readonly basicTs = `import { Component, signal } from '@angular/core';
import { Questionnaire, type QuestionnaireAnswer, type QuestionnaireStep } from './ui/questionnaire/questionnaire';

@Component({
  selector: 'app-feedback-survey',
  imports: [Questionnaire],
  templateUrl: './feedback-survey.html',
})
export class FeedbackSurvey {
  steps: QuestionnaireStep[] = [
    {
      id: 'priority',
      title: 'How urgent is this?',
      options: [
        { id: 'now', label: 'Blocking' },
        { id: 'soon', label: 'Soon' },
        { id: 'later', label: 'Eventually' },
      ],
    },
  ];

  stepIndex = signal(0);
  answers = signal<QuestionnaireAnswer[]>([]);

  onCompleted(answers: QuestionnaireAnswer[]): void {
    console.log('survey completed', answers);
  }
}`;
}
