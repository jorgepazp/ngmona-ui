import { Routes } from '@angular/router';
import { Shell } from './layout/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', loadComponent: () => import('./pages/home/home') },
      {
        path: 'guides/installation',
        loadComponent: () => import('./pages/guides/installation/installation'),
      },
      {
        path: 'guides/usage',
        loadComponent: () => import('./pages/guides/usage/usage'),
      },
      {
        path: 'guides/theming',
        loadComponent: () => import('./pages/guides/theming/theming'),
      },
      {
        path: 'guides/theme-editor',
        loadComponent: () => import('./pages/guides/theme-editor/theme-editor'),
      },
      {
        path: 'components/button',
        loadComponent: () => import('./pages/docs/button/button-docs'),
      },
      {
        path: 'components/checkbox',
        loadComponent: () => import('./pages/docs/checkbox/checkbox-docs'),
      },
      {
        path: 'components/radio',
        loadComponent: () => import('./pages/docs/radio/radio-docs'),
      },
      {
        path: 'components/radio-group',
        loadComponent: () => import('./pages/docs/radio-group/radio-group-docs'),
      },
      {
        path: 'components/toggle',
        loadComponent: () => import('./pages/docs/toggle/toggle-docs'),
      },
      {
        path: 'components/textarea',
        loadComponent: () => import('./pages/docs/textarea/textarea-docs'),
      },
      {
        path: 'components/select',
        loadComponent: () => import('./pages/docs/select/select-docs'),
      },
      {
        path: 'components/input',
        loadComponent: () => import('./pages/docs/input/input-docs'),
      },
      {
        path: 'components/sidebar',
        loadComponent: () => import('./pages/docs/sidebar/sidebar-docs'),
      },
      {
        path: 'components/questionnaire',
        loadComponent: () => import('./pages/docs/questionnaire/questionnaire-docs'),
      },
      {
        path: 'components/drawer',
        loadComponent: () => import('./pages/docs/drawer/drawer-docs'),
      },
      {
        path: 'components/dropdown-menu',
        loadComponent: () => import('./pages/docs/dropdown-menu/dropdown-menu-docs'),
      },
      {
        path: 'components/card',
        loadComponent: () => import('./pages/docs/card/card-docs'),
      },
      {
        path: 'components/link',
        loadComponent: () => import('./pages/docs/link/link-docs'),
      },
      {
        path: 'components/label',
        loadComponent: () => import('./pages/docs/label/label-docs'),
      },
      {
        path: 'components/spinner',
        loadComponent: () => import('./pages/docs/spinner/spinner-docs'),
      },
      {
        path: 'components/url-copy',
        loadComponent: () => import('./pages/docs/url-copy/url-copy-docs'),
      },
      {
        path: 'components/modal',
        loadComponent: () => import('./pages/docs/modal/modal-docs'),
      },
      {
        path: 'components/tooltip',
        loadComponent: () => import('./pages/docs/tooltip/tooltip-docs'),
      },
      {
        path: 'components/notification',
        loadComponent: () => import('./pages/docs/notification/notification-docs'),
      },
      {
        path: 'components/calendar',
        loadComponent: () => import('./pages/docs/calendar/calendar-docs'),
      },
      {
        path: 'components/paginator',
        loadComponent: () => import('./pages/docs/paginator/paginator-docs'),
      },
      {
        path: 'components/stepper',
        loadComponent: () => import('./pages/docs/stepper/stepper-docs'),
      },
      {
        path: 'components/timeline',
        loadComponent: () => import('./pages/docs/timeline/timeline-docs'),
      },
      {
        path: 'components/file-upload',
        loadComponent: () => import('./pages/docs/file-upload/file-upload-docs'),
      },
      {
        path: 'components/popover',
        loadComponent: () => import('./pages/docs/popover/popover-docs'),
      },
      {
        path: 'components/toast',
        loadComponent: () => import('./pages/docs/toast/toast-docs'),
      },
      {
        path: 'components/skeleton',
        loadComponent: () => import('./pages/docs/skeleton/skeleton-docs'),
      },
      {
        path: 'components/table',
        loadComponent: () => import('./pages/docs/table/table-docs'),
      },
      {
        path: 'components/data-table',
        loadComponent: () => import('./pages/docs/data-table/data-table-docs'),
      },
      {
        path: 'components/badge',
        loadComponent: () => import('./pages/docs/badge/badge-docs'),
      },
      {
        path: 'components/avatar',
        loadComponent: () => import('./pages/docs/avatar/avatar-docs'),
      },
      {
        path: 'components/separator',
        loadComponent: () => import('./pages/docs/separator/separator-docs'),
      },
      {
        path: 'components/progress',
        loadComponent: () => import('./pages/docs/progress/progress-docs'),
      },
      {
        path: 'components/breadcrumb',
        loadComponent: () => import('./pages/docs/breadcrumb/breadcrumb-docs'),
      },
      {
        path: 'components/alert',
        loadComponent: () => import('./pages/docs/alert/alert-docs'),
      },
      {
        path: 'components/alert-dialog',
        loadComponent: () => import('./pages/docs/alert-dialog/alert-dialog-docs'),
      },
      {
        path: 'components/accordion',
        loadComponent: () => import('./pages/docs/accordion/accordion-docs'),
      },
      {
        path: 'components/tabs',
        loadComponent: () => import('./pages/docs/tabs/tabs-docs'),
      },
      {
        path: 'components/combobox',
        loadComponent: () => import('./pages/docs/combobox/combobox-docs'),
      },
      {
        path: 'components/autocomplete',
        loadComponent: () => import('./pages/docs/autocomplete/autocomplete-docs'),
      },
      {
        path: 'components/command',
        loadComponent: () => import('./pages/docs/command/command-docs'),
      },
      {
        path: 'components/slider',
        loadComponent: () => import('./pages/docs/slider/slider-docs'),
      },
      {
        path: 'components/input-group',
        loadComponent: () => import('./pages/docs/input-group/input-group-docs'),
      },
      {
        path: 'components/number-input',
        loadComponent: () => import('./pages/docs/number-input/number-input-docs'),
      },
      {
        path: 'components/search-input',
        loadComponent: () => import('./pages/docs/search-input/search-input-docs'),
      },
      {
        path: 'components/resizable',
        loadComponent: () => import('./pages/docs/resizable/resizable-docs'),
      },
    ],
  },
];
