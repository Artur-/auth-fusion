import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { View } from '../../views/view';

@customElement('private-view')
export class PrivateView extends View {
  render() {
    return html`<div>This is the private view</div>`;
  }
}
