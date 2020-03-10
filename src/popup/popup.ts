import { CustomElementBase } from '@ne1410s/cust-elems';

import markupUrl from './popup.html';
import stylesUrl from './popup.css';

export class Popup extends CustomElementBase {

  public static readonly observedAttributes = ['open', 'style'];

  private static readonly STYLE_KEYS = [ 
    'backgroundColor',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomRightRadius',
    'borderBottomLeftRadius',
  ];
  private _styles: Record<string, string> = {};
  private _moveData: { backing: boolean, move: boolean };

  public confirmCallback: () => boolean;
  public dismissCallback: () => boolean;

  constructor() {
    super(stylesUrl, markupUrl);

    const backing = this.root.querySelector('.back');
    const fore = backing.querySelector('.fore');

    backing.addEventListener('mousedown', event => {
      this._moveData = { 
        backing: event.target === backing,
        move: event.target === fore,
      };
    });

    backing.addEventListener('mousemove', event => {
      if (this._moveData?.move) {
        console.log('move-lol');
      }
    });

    backing.addEventListener('mouseup', event => {
      if (event.target === backing && this._moveData.backing) {
        this.dismiss();
      }

      this._moveData = null;
    });
  }

  close(): void {
    this.removeAttribute('open');
  }

  open(): void {
    this.setAttribute('open', '');
  }

  wrap(selectorOrElem: string | Element): void {
    const target = typeof (selectorOrElem as Element).append === 'function' 
      ? selectorOrElem as Element
      : document.querySelector(selectorOrElem + '');
    this.appendChild(target);
  }

  confirm(): void {
    const doCheck = !!this.confirmCallback;
    const proceed = !doCheck || this.confirmCallback();
    if (doCheck) this.fire(proceed ? 'confirmaccept' : 'confirmreject');
    if (proceed) this.close();
  }

  dismiss(): void {
    const doCheck = !!this.dismissCallback;
    const proceed = !doCheck || this.dismissCallback();
    if (doCheck) this.fire(proceed ? 'dismissaccept' : 'dismissreject');
    if (proceed) this.close();
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
    [
      'borderTopLeftRadius',
      'borderTopRightRadius',
      'borderBottomRightRadius',
      'borderBottomLeftRadius'
    ].forEach(prop => {
      (fore.style as any)[prop] = this._styles[prop];
    });
  }

  /** Emits an event from the specified node. */
  private fire<T>(event: string, detail?: T) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }
}
