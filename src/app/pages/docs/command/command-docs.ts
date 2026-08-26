import { Component, HostListener, signal } from '@angular/core';
import {
  LucideCalendarPlus,
  LucideCopy,
  LucideFileText,
  LucideLogOut,
  LucideMail,
  LucideMoon,
  LucidePlus,
  LucideSettings,
  LucideSun,
  LucideUser,
} from '@lucide/angular';
import { Command, type CommandGroupDef } from '../../../registry/command/command';
import { ApiTable } from '../../../docs-ui/api-table/api-table';
import { commandApi } from '../../../registry/command/command.api';

/**
 * The component itself is a controlled, focused piece (just `[(open)]` + `groups` + `selected`).
 * Wiring a global "⌘K / Ctrl+K opens it from anywhere" shortcut is left to the consuming page —
 * this `@HostListener` is that example.
 */
@Component({
  selector: 'docs-command',
  imports: [Command, ApiTable],
  templateUrl: './command-docs.html',
})
export default class CommandDocs {
  protected readonly api = commandApi;
  protected readonly open = signal(false);
  protected readonly lastSelected = signal<string>('(none yet)');

  protected readonly groups: CommandGroupDef[] = [
    {
      label: 'Actions',
      items: [
        { label: 'New file', value: 'new-file', icon: LucideFileText, keywords: ['create', 'document'] },
        { label: 'New event', value: 'new-event', icon: LucideCalendarPlus, keywords: ['calendar', 'schedule'] },
        { label: 'Invite member', value: 'invite', icon: LucideMail, keywords: ['email', 'team'] },
        { label: 'Duplicate', value: 'duplicate', icon: LucideCopy },
      ],
    },
    {
      label: 'Appearance',
      items: [
        { label: 'Light theme', value: 'theme-light', icon: LucideSun },
        { label: 'Dark theme', value: 'theme-dark', icon: LucideMoon },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'Profile settings', value: 'profile', icon: LucideUser, keywords: ['account'] },
        { label: 'Preferences', value: 'preferences', icon: LucideSettings },
        { label: 'Log out', value: 'logout', icon: LucideLogOut, keywords: ['sign out'] },
        { label: 'Delete account', value: 'delete-account', icon: LucidePlus, disabled: true, keywords: ['danger'] },
      ],
    },
  ];

  @HostListener('document:keydown', ['$event'])
  protected onGlobalKeydown(event: KeyboardEvent): void {
    const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    if (!isShortcut) return;
    event.preventDefault();
    this.open.set(!this.open());
  }

  protected onSelected(value: unknown): void {
    this.lastSelected.set(`${value}`);
  }
}
