import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { View } from '../../views/view';

@customElement('public-view')
export class PublicView extends View {
  render() {
    return html`<div>Content placeholder</div>`;
  }
}
