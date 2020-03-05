import { CustomElementBase } from '@ne1410s/cust-elems';

import markupUrl from './popup.html';
import stylesUrl from './popup.css';

export class Popup extends CustomElementBase {

  public static readonly observedAttributes = ['open', 'style'];

  private static readonly STYLE_KEYS = [ 
    'backgroundColor',
    'borderRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomRightRadius',
    'borderBottomLeftRadius',
  ];
  private _styles: Record<string, string> = {};

  constructor() {
    super(stylesUrl, markupUrl);
    
    const backing = this.root.querySelector('.back');
    const fore = this.root.querySelector('.fore');

    fore.addEventListener('click', event => event.stopPropagation());
    backing.addEventListener('click', () => this.close());
  }

  close() {
    this.removeAttribute('open');
  }

  open() {
    this.setAttribute('open', '');
  }

  wrap(selectorOrElem: string | Element) {
    const target = typeof (selectorOrElem as Element).append === 'function' 
      ? selectorOrElem as Element
      : document.querySelector(selectorOrElem + '');
    this.appendChild(target);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'open':
        const backing = this.root.querySelector('.back');
        const doOpen = !!newValue || typeof newValue === 'string';
        this.root.querySelector('.title').innerHTML = this.title;
        if (doOpen) this.propagateSupportedStyles(backing as HTMLElement);
        backing.classList.toggle('open', doOpen);
        break;
      case 'style':
        if (newValue) {
          Popup.STYLE_KEYS
            .map(key => ({key, value: (this.style as any)[key]}))
            .filter(kvp => kvp.value)
            .forEach(kvp => { 
              this._styles[kvp.key] = kvp.value;
              console.log(`om nom nom. ${kvp.key} tastes like '${kvp.value}'`);
            });
          this.removeAttribute('style');
        }
        break;
    }
  }

  connectedCallback() {}
  disconnectedCallback() {}

  /** Some relevant style properties are propagated */
  private propagateSupportedStyles(backing: HTMLElement) {
    
    // Backing
    ['backgroundColor'].forEach(prop => {
      (backing.style as any)[prop] = this._styles[prop];
    });

    // Fore
    const fore = backing.querySelector('.fore') as HTMLElement;
    ['borderRadius'].forEach(prop => {
      (fore.style as any)[prop] = this._styles[prop];
    });

    // Title
    const title = backing.querySelector('.title') as HTMLElement;
    ['borderTopLeftRadius', 'borderTopRightRadius'].forEach(prop => {
      (title.style as any)[prop] = this._styles[prop];
    });
  }
}
