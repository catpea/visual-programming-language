import { front } from "/plug-ins/domek/index.js";

export default class Keyboard {

  component;
	handle;

	// handlers
	keyDownHandler;
	mouseUpHandler;

	constructor({ component, handle }) {

    if(!component) throw new Error('component is required')
    if(!handle) throw new Error('handle is required')

		this.component = component;
		this.handle = handle;
    this.mount();
  }

  mount(){

		this.keyDownHandler = (e) => {
      if (event.isComposing || event.keyCode === 229) { return; }
      console.log('plug-ins/keyboard/index.js', e.code);
      if(e.code === 'Delete') globalThis.project.removeSelected()
      if(e.code === 'Enter') globalThis.project.save()
		};

		this.handle.addEventListener('keydown', this.keyDownHandler);
	}

	destroy() {
		this.handle.removeEventListener('mousedown', this.keyDownHandler);
	}

}
