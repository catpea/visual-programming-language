import { front } from "domek";

export default class Select {

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
      const multiSelect = e.ctrlKey;

      this.component.selected = !this.component.selected;

      if(multiSelect){

      }else{
        if(this.component.selected){
          for (const [id, application] of globalThis.project.applications) {
            if(this.component.id !== application.id){
              application.selected = false;
            }
          }
        }
      }

		};

		this.handle.addEventListener('mousedown', this.mouseDownHandler);
	}

	destroy() {
		this.handle.removeEventListener('mousedown', this.mouseDownHandler);
	}

}
