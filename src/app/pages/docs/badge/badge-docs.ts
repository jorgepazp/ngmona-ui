import { Component } from '@angular/core';
import { LucideCheck } from '@lucide/angular';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Badge } from '../../../registry/badge/badge';
import { badgeApi } from '../../../registry/badge/badge.api';

@Component({
  selector: 'docs-badge',
  imports: [Badge, ApiTable, CodeTabs],
  templateUrl: './badge-docs.html',
})
export default class BadgeDocs {
  protected readonly checkIcon = LucideCheck;
  protected readonly api = badgeApi;

  protected readonly variantsHtml = `<ui-badge variant="primary">Primary</ui-badge>
<ui-badge variant="neutral">Neutral</ui-badge>
<ui-badge variant="success">Success</ui-badge>
<ui-badge variant="warning">Warning</ui-badge>
<ui-badge variant="danger">Danger</ui-badge>
<ui-badge variant="info">Info</ui-badge>`;

  protected readonly variantsTs = `import { Component } from '@angular/core';
import { Badge } from './ui/badge/badge';

@Component({
  selector: 'app-badge-variants',
  imports: [Badge],
  templateUrl: './badge-variants.html',
})
export class BadgeVariants {}`;

  protected readonly sizesHtml = `<ui-badge size="sm" variant="primary">Small</ui-badge>
<ui-badge size="md" variant="primary">Medium</ui-badge>`;

  protected readonly sizesTs = `import { Component } from '@angular/core';
import { Badge } from './ui/badge/badge';

@Component({
  selector: 'app-badge-sizes',
  imports: [Badge],
  templateUrl: './badge-sizes.html',
})
export class BadgeSizes {}`;

  protected readonly iconHtml = `<ui-badge variant="success" [icon]="checkIcon">Verified</ui-badge>`;

  protected readonly iconTs = `import { Component } from '@angular/core';
import { LucideCheck } from '@lucide/angular';
import { Badge } from './ui/badge/badge';

@Component({
  selector: 'app-verified-badge',
  imports: [Badge],
  templateUrl: './verified-badge.html',
})
export class VerifiedBadge {
  checkIcon = LucideCheck;
}`;

  protected readonly shapeHtml = `<ui-badge variant="info" [pill]="true">Pill</ui-badge>
<ui-badge variant="info" [pill]="false">Square</ui-badge>`;

  protected readonly shapeTs = `import { Component } from '@angular/core';
import { Badge } from './ui/badge/badge';

@Component({
  selector: 'app-badge-shapes',
  imports: [Badge],
  templateUrl: './badge-shapes.html',
})
export class BadgeShapes {}`;
}
