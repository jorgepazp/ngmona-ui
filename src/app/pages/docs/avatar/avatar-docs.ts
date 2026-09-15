import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { CodeTabs } from '../../../docs-ui/code-tabs/code-tabs';
import { Avatar } from '../../../registry/avatar/avatar';
import { avatarApi } from '../../../registry/avatar/avatar.api';

@Component({
  selector: 'docs-avatar',
  imports: [Avatar, ApiTable, CodeTabs],
  templateUrl: './avatar-docs.html',
})
export default class AvatarDocs {
  protected readonly api = avatarApi;

  protected readonly fallbackHtml = `<ui-avatar src="https://i.pravatar.cc/100?img=12" alt="Jane Cooper"></ui-avatar>
<ui-avatar initials="JC" alt="Jane Cooper" variant="primary"></ui-avatar>
<ui-avatar alt="Unknown user"></ui-avatar>
<ui-avatar
  src="https://broken-url.example/missing.jpg"
  initials="FB"
  alt="Broken image falls back to initials"
></ui-avatar>`;

  protected readonly fallbackTs = `import { Component } from '@angular/core';
import { Avatar } from './ui/avatar/avatar';

@Component({
  selector: 'app-user-avatars',
  imports: [Avatar],
  templateUrl: './user-avatars.html',
})
export class UserAvatars {}`;

  protected readonly sizesHtml = `<ui-avatar size="sm" initials="SM" alt="Small"></ui-avatar>
<ui-avatar size="md" initials="MD" alt="Medium"></ui-avatar>
<ui-avatar size="lg" initials="LG" alt="Large"></ui-avatar>
<ui-avatar size="xl" initials="XL" alt="Extra large"></ui-avatar>`;

  protected readonly sizesTs = `import { Component } from '@angular/core';
import { Avatar } from './ui/avatar/avatar';

@Component({
  selector: 'app-avatar-sizes',
  imports: [Avatar],
  templateUrl: './avatar-sizes.html',
})
export class AvatarSizes {}`;

  protected readonly shapeHtml = `<ui-avatar shape="circle" initials="CI" alt="Circle"></ui-avatar>
<ui-avatar shape="square" initials="SQ" alt="Square"></ui-avatar>`;

  protected readonly shapeTs = `import { Component } from '@angular/core';
import { Avatar } from './ui/avatar/avatar';

@Component({
  selector: 'app-avatar-shapes',
  imports: [Avatar],
  templateUrl: './avatar-shapes.html',
})
export class AvatarShapes {}`;

  protected readonly variantsHtml = `<ui-avatar variant="primary" initials="PR" alt="Primary"></ui-avatar>
<ui-avatar variant="neutral" initials="NE" alt="Neutral"></ui-avatar>
<ui-avatar variant="success" initials="SU" alt="Success"></ui-avatar>
<ui-avatar variant="warning" initials="WA" alt="Warning"></ui-avatar>
<ui-avatar variant="danger" initials="DA" alt="Danger"></ui-avatar>
<ui-avatar variant="info" initials="IN" alt="Info"></ui-avatar>`;

  protected readonly variantsTs = `import { Component } from '@angular/core';
import { Avatar } from './ui/avatar/avatar';

@Component({
  selector: 'app-avatar-variants',
  imports: [Avatar],
  templateUrl: './avatar-variants.html',
})
export class AvatarVariants {}`;

  protected readonly statusHtml = `<ui-avatar initials="ON" alt="Online user" status="online"></ui-avatar>
<ui-avatar initials="OF" alt="Offline user" status="offline"></ui-avatar>
<ui-avatar initials="BU" alt="Busy user" status="busy"></ui-avatar>
<ui-avatar initials="AW" alt="Away user" status="away"></ui-avatar>`;

  protected readonly statusTs = `import { Component } from '@angular/core';
import { Avatar } from './ui/avatar/avatar';

@Component({
  selector: 'app-avatar-status',
  imports: [Avatar],
  templateUrl: './avatar-status.html',
})
export class AvatarStatus {}`;
}
