import { front } from "/plug-ins/domek/index.js"

export default class Focus {

  component;
	handle;

	// handlers
	mouseDownHandler;
	mouseUpHandler;

	constructor({ component, handle }) {

    if(!component) throw new Error('component is required')
    if(!handle) throw new Error('handle is required')

		this.component = component;
		this.handle = handle;
    this.mount();
  }

  mount(){

		this.mouseDownHandler = (e) => {
      front(this.component.scene)
		};

		this.handle.addEventListener('mousedown', this.mouseDownHandler);
	}

	destroy() {
		this.handle.removeEventListener('mousedown', this.mouseDownHandler);
	}

}
