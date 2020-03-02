import { CustomElementBase } from '@ne1410s/cust-elems';
//
import * as config from './config.json';
import markupUrl from './popup.html';
import stylesUrl from './popup.css';

export class Popup extends CustomElementBase {

  static observedAttributes = ['open'];

  constructor() {
    super(stylesUrl, markupUrl);
    
    const back = this.root.querySelector('.back');
    const fore = this.root.querySelector('.fore');

    fore.addEventListener('click', event => event.stopPropagation());
    back.addEventListener('click', () => this.close());
  }

  close() {
    this.removeAttribute('open');
  }

  open() {
    this.setAttribute('open', '');
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'open':
        const back = this.root.querySelector('.back');
        const doOpen = !!newValue || typeof newValue === 'string';
        back.classList.toggle('open', doOpen);
        break;
    }
  }

  connectedCallback() {}
  disconnectedCallback() {}
}
