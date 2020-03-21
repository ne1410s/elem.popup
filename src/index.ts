import { Popup } from './popup/popup';

if ('customElements' in window) {
  window.customElements.define('ne14-pop', Popup);
}

export { Popup };