# @ne1410s/popup

## A lightweight & configurable modal popup.

```html
<ne14-pop>
  <p>Hello world</p>
</ne14-pop>
```

- **Use:** `<script src="PATH_TO_UMD_SCRIPT"></script>`
- **Extend:** _npm i @ne1410s/popup_

### Attributes

```html
<ne14-pop move resize>YO' STUFF<ne14-pop></ne14-pop></ne14-pop>
```

- **move**: User can drag the popup around
- **resize**: User can alter the size of the popup
- **shrink**: (Requires **_resize_**: User can reduce size below that initially presented)
- **open**: The popup is opened immediately
- **no-close**: The close icon is not made available
- **style**: If supplied inline, the following styles are propagated to the element. They are fairly self-explanatory
  - `background-color`
  - `border-radius`
  - `box-shadow`

### Events

```javascript
const pop = document.querySelector('ne14-pop');

pop.addEventListener('open', () => {
  console.log('Just opened!');
});
```

- **open**: Fired when the popup is opened
- **close**: Fired when the popup is closed
- **confirmaccept**: Fired when the confirm callback allowed the popup to close
- **confirmreject**: Fired when the confirm callback prevented the popup from closing
- **dismissaccept**: Fired when the dismiss callback allowed the popup to close
- **dismissreject**: Fired when the dismiss callback prevented the popup from closing

### Methods

- **open()**: Opens the popup
- **close()**: Closes the popup
- **wrap()**: Wraps existing html element(s) in a new popup
- **confirm()**: Closes the popup, unless confirmCallback is provided and returns `false`
- **dismiss()**: Closes the popup, unless dismissCallback is provided and returns `false`.

### Properties

- **confirmCallback**: () => boolean: Return false to prevent a call to confirm from closing the popup
- **dismissCallback**: () => boolean: Return false to prevent a call to dismiss from closing the popup

### CSS Variables

Some degree of custom styling can be provided, by way of css variables:

```css
ne14-pop {
  --background: rgba(0, 0, 0, 0.5);
  --border-radius: 5px;
  --box-shadow: 5px 5px 20px black;
}
```

- **`--background`** _Background behind the popup. Defaults to: `rgba(0, 0, 0, .85)`_
- **`--border-radius`** _Border radius for the popup._
- **`--box-shadow`** _Box shadow for the popup (when stationary)._
