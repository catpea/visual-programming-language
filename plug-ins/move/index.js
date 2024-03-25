export default class Move {

  component;
  window;
  handle;
  zone;

  mouseDownHandler;
  mouseMoveHandler;
  mouseUpHandler;

  lastX = 0;
  lastY = 0;
  dragging = false;

  constructor({component, window, handle, zone}){
    if(!component) throw new Error('component is required')
    if(!handle) throw new Error('handle is required')
    if(!window) throw new Error('window is required')
    if(!zone) throw new Error('zone is required')

    this.component = component;
    this.handle = handle;
    this.window = window;
    this.zone = zone;
    this.mount();
  }

  mount(){

    this.mouseDownHandler = (e) => {

      // Initialize
      // Remember where mouse touched down, seed the lastV system used in calculating how much the mouse has moved
      this.lastX = e.screenX;
      this.lastY = e.screenY;
      // Enable dragging
      this.dragging = true;
      globalThis.project.iframe = false;
      this.zone.addEventListener('mousemove', this.mouseMoveHandler);
    };

    this.mouseMoveHandler = (e) => {
      // Substract initial position from current cursor position to get relative motion, motion relative to initial touchdown
      const dx = this.lastX - e.screenX;
      const dy = this.lastY - e.screenY;

      const container = this.component.getRootContainer();
      console.log('ROOT CONTAINER', container.oo.name);

      // Asignment, does not use the raw screen number but their scaled vaions.
      this.component.node.x = this.component.node.x - (dx/globalThis.project.zoom);
      this.component.node.y = this.component.node.y - (dy/globalThis.project.zoom);

      // Reset, because the cursor has moved and is in a new position now.
      // lastN dat is used for calculating the delta between sampling mouse
      this.lastX = e.screenX;
      this.lastY = e.screenY;
     };

    this.mouseUpHandler = (e) => {
      this.dragging = false;
      globalThis.project.iframe = true;
      this.zone.removeEventListener('mousemove', this.mouseMoveHandler);
    };

    this.handle.addEventListener('mousedown', this.mouseDownHandler);
    this.zone.addEventListener('mouseup', this.mouseUpHandler);

  }

  destroy(){

    this.handle.removeEventListener('mousedown', this.mouseDownHandler);
    this.zone.removeEventListener('mousemove', this.mouseMoveHandler);
    this.zone.removeEventListener('mouseup', this.mouseUpHandler);

  }

}
