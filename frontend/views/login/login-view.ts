import { LoginResult } from '@vaadin/flow-frontend';
import { AfterEnterObserver, RouterLocation } from '@vaadin/router';
import { LoginI18n } from '@vaadin/vaadin-login';
import '@vaadin/vaadin-login/vaadin-login-overlay';
import { html } from 'lit';
import { customElement, state } from 'lit/decorators';
import { login } from '../../auth';
import { View } from '../view';

const loginI18nDefault: LoginI18n = {
  form: {
    title: 'Log in',
    username: 'Username',
    password: 'Password',
    submit: 'Log in',
    forgotPassword: 'Forgot password',
  },
  errorMessage: {
    title: 'Incorrect username or password',
    message: 'Check that you have entered the correct username and password and try again.',
  },
};
@customElement('login-view')
export class LoginView extends View implements AfterEnterObserver {
  @state()
  private error = false;

  // the url to redirect to after a successful login
  private returnUrl?: string;

  private onSuccess = async (result: LoginResult) => {
    // If a login redirect was initiated by opening a protected URL, the server knows where to go (result.redirectUrl).

    // If a login redirect was initiated by the client router, this.returnUrl knows where to go.

    // If login was opened directly, use the default URL provided by the server.

    // As we do not know if the target is a resource or a Fusion view or a Flow view, we cannot just use Router.go
    window.location.href = result.redirectUrl || this.returnUrl || result.defaultUrl || '';
  };

  render() {
    return html`
      <vaadin-login-overlay
        opened
        .error="${this.error}"
        @login="${this.login}"
        no-forgot-password
        .i18n=${Object.assign(
          { header: { title: '### Project Name ###', description: 'Login using user/user or admin/admin' } },
          loginI18nDefault
        )}
      >
      </vaadin-login-overlay>
    `;
  }

  async login(event: CustomEvent) {
    this.error = false;
    const result = await login(event.detail.username, event.detail.password);
    this.error = result.error;

    if (!result.error) {
      this.onSuccess(result);
    }
  }

  onAfterEnter(location: RouterLocation) {
    this.returnUrl = location.redirectFrom;
  }
}
