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
  private _coords: { x: number, y: number };
  private _drag: 'back' | 'fore' | 'fore*';

  public confirmCallback: () => boolean;
  public dismissCallback: () => boolean;

  constructor() {
    super(stylesUrl, markupUrl);

    const back = this.root.querySelector('.back') as HTMLElement;
    const fore = back.querySelector('.fore') as HTMLElement;

    back.addEventListener('mousedown', event => {  
      this._drag = event.target === back ? 'back' 
          : event.target === fore ? 'fore'
          : 'fore*';
    });

    back.addEventListener('mousemove', (event: MouseEvent) => {
      if (this._drag === 'fore' && this._coords) {
        const pos = { x: event.pageX, y: event.pageY };
        pos.x = Math.min(pos.x, (window.innerWidth - fore.clientWidth / 2));
        pos.y = Math.min(pos.y, (window.innerHeight - fore.clientHeight / 2));
        pos.x = Math.max(0, pos.x);
        pos.y = Math.max(0, pos.y);
        const xlate = `translate(${pos.x - this._coords.x}px, ${pos.y - this._coords.y}px)`;
        fore.style.transform = `translate(-50%, -50%) ${xlate}`;
      }
    });

    back.addEventListener('mouseup', event => {
      if (this._drag === 'back' && event.target === back) {
        this.dismiss();
      }

      this._drag = null;
    });

    fore.addEventListener('transitionend', (event: TransitionEvent) => {
      if (event.propertyName === 'transform') {
        if (back.classList.contains('open')) {
          fore.classList.add('ready');
          this._coords = { x: fore.offsetLeft, y: fore.offsetTop };
        } else {
          fore.style.transform = 'translate(-50%, -100vh)';
        }
      }
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
        const back = this.root.querySelector('.back');
        const fore = back.querySelector('.fore') as HTMLElement;
        const doOpen = !!newValue || typeof newValue === 'string';
        fore.classList.remove('ready');
        fore.style.transform = doOpen ? 'translate(-50%, -50%)' : fore.style.transform + ' translateY(-100vh)';
        back.classList.toggle('open', doOpen); 
        if (doOpen) this.propagateSupportedStyles(back as HTMLElement);
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
