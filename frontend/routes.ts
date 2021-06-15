import { Route } from '@vaadin/router';
import './views/main/main-view';
import './views/public_/public-view';

export type ViewRoute = Route & { title?: string; children?: ViewRoute[] };

export const views: ViewRoute[] = [
  // place routes below (more info https://vaadin.com/docs/latest/fusion/routing/overview)
  {
    path: '',
    component: 'public-view',
    title: '',
  },
  {
    path: 'public',
    component: 'public-view',
    title: 'Public',
  },
  {
    path: 'private',
    component: 'private-view',
    title: 'Private',
    action: async () => {
      await import('./views/private_/private-view');
    },
  },
];
export const routes: ViewRoute[] = [
  {
    path: '',
    component: 'main-view',
    children: [...views],
  },
];
