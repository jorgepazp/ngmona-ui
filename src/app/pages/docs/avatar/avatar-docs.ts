import { Component } from '@angular/core';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { Avatar } from '../../../registry/avatar/avatar';
import { avatarApi } from '../../../registry/avatar/avatar.api';

@Component({
  selector: 'docs-avatar',
  imports: [Avatar, ApiTable],
  templateUrl: './avatar-docs.html',
})
export default class AvatarDocs {
  protected readonly api = avatarApi;
}
