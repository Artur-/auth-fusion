import '@vaadin/vaadin-app-layout';
import { AppLayoutElement } from '@vaadin/vaadin-app-layout';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle';
import '@vaadin/vaadin-avatar/vaadin-avatar';
import '@vaadin/vaadin-context-menu';
import '@vaadin/vaadin-tabs';
import '@vaadin/vaadin-tabs/vaadin-tab';
import '@vaadin/vaadin-template-renderer';
import { html, render } from 'lit';
import { customElement } from 'lit/decorators.js';
import { logout } from '../../auth';
import { router } from '../../index';
import { views } from '../../routes';
import { appStore } from '../../stores/app-store';
import { Layout } from '../view';
interface RouteInfo {
  path: string;
  title: string;
}

@customElement('main-view')
export class MainView extends Layout {
  render() {
    return html`
      <vaadin-app-layout primary-section="drawer">
        <header slot="navbar" theme="dark" class="sidemenu-header">
          <vaadin-drawer-toggle></vaadin-drawer-toggle>
          <h1>${appStore.currentViewTitle}</h1>
          ${appStore.user
            ? html` <vaadin-context-menu class="user" open-on="click" .renderer=${this.renderLogoutOptions}>
                <vaadin-avatar img="${appStore.user.profilePictureUrl}" name="${appStore.user.username}"></vaadin-avatar
              ></vaadin-context-menu>`
            : html`<a class="user" router-ignore href="login">Sign in</a>`}
        </header>

        <div slot="drawer" class="sidemenu-menu">
          <div id="logo">
            <img src="images/logo.png" alt="${appStore.applicationName} logo" />
            <span>${appStore.applicationName}</span>
          </div>
          <hr />
          <vaadin-tabs orientation="vertical" theme="minimal" .selected=${this.getSelectedViewRoute()}>
            ${this.getMenuRoutes().map(
              (viewRoute) => html`
                <vaadin-tab>
                  <a href="${router.urlForPath(viewRoute.path)}" tabindex="-1">${viewRoute.title}</a>
                </vaadin-tab>
              `
            )}
          </vaadin-tabs>
        </div>
        <slot></slot>
      </vaadin-app-layout>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add('block', 'h-full');
    this.reaction(
      () => appStore.location,
      () => {
        AppLayoutElement.dispatchCloseOverlayDrawerEvent();
      }
    );
  }

  private renderLogoutOptions(root: HTMLElement) {
    render(
      html`<vaadin-list-box>
        <vaadin-item @click=${() => logout()}>Logout</vaadin-item>
      </vaadin-list-box>`,
      root
    );
  }
  private getMenuRoutes(): RouteInfo[] {
    return views.filter((route) => route.title) as RouteInfo[];
  }

  private getSelectedViewRoute(): number {
    return this.getMenuRoutes().findIndex((viewRoute) => viewRoute.path == appStore.location);
  }
}
