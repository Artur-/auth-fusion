import { Commands, Context, Route } from '@vaadin/router';
import { isAuthenticated } from './auth';
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
    action: async (_context: Context, commands: Commands) => {
      if (!isAuthenticated()) {
        return commands.redirect('/login');
      }

      await import('./views/private_/private-view');
      return undefined;
    },
  },
];
export const routes: ViewRoute[] = [
  {
    path: '/login',
    component: 'login-view',
    action: async () => {
      await import('./views/login/login-view');
    },
  },
  {
    path: '',
    component: 'main-view',
    children: [...views],
  },
];
