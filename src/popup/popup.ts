import { CustomElementBase } from '@ne1410s/cust-elems';

import markupUrl from './popup.html';
import stylesUrl from './popup.css';

export class Popup extends CustomElementBase {

  public static readonly observedAttributes = ['open', 'style', 'title', 'confirm-text', 'dismiss-text'];

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

  public get confirmText(): string { return this.getAttribute('confirm-text'); }
  public set confirmText(value: string) {
    if (value == null) this.removeAttribute('confirm-text');
    else this.setAttribute('confirm-text', value);
  }

  public get dismissText(): string { return this.getAttribute('dismiss-text'); }
  public set dismissText(value: string) {
    if (value == null) this.removeAttribute('dismiss-text');
    else this.setAttribute('dismiss-text', value);
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
        if (doOpen) this.propagateSupportedStyles(backing as HTMLElement);
        backing.classList.toggle('open', doOpen);
        this.fire(doOpen ? 'open' : 'close');
        break;
      case 'style':
        if (newValue) {
          Popup.STYLE_KEYS
            .map(key => ({key, value: (this.style as any)[key]}))
            .filter(kvp => kvp.value)
            .forEach(kvp => this._styles[kvp.key] = kvp.value);
          this.removeAttribute('style');
        }
        break;
      case 'title':
        if (newValue === '__clearme__') {
          this.removeAttribute('title');          
        } else if (oldValue !== '__clearme__') {
          this.root.querySelector('.title').innerHTML = newValue;
          if (!newValue) this.setAttribute('title', '__clearme__');
        }
        break;
      case 'confirm-text':
        const confirmText = newValue == null ? '' : newValue || 'OK';
        this.root.querySelector('button.confirm').innerHTML = confirmText;
        break;  
      case 'dismiss-text':
        const dismissText = newValue == null ? '' : newValue || 'Cancel';
        this.root.querySelector('button.dismiss').innerHTML = dismissText;
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

  /** Emits an event from the specified node. */
  private fire<T>(event: string, detail?: T) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }
}
