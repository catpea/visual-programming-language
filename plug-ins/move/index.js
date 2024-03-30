export default class Move {

  component;
  window;
  handle;
  zone;

  mouseDownHandler;
  mouseMoveHandler;
  mouseUpHandler;

  previousX = 0;
  previousY = 0;
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
      // we log where the mouse down hit, that is the start of the drag operation
      this.previousX = e.screenX;
      this.previousY = e.screenY;

      // Enable dragging
      this.dragging = true;
      globalThis.project.iframe = false;
      this.zone.addEventListener('mousemove', this.mouseMoveHandler);
    };

    this.mouseMoveHandler = (e) => {
      // Substract initial position from current cursor position to get relative motion, motion relative to initial touchdown
      // to get the previous we use previous location of the cursor, and substract durrent location of the cursor.
      /* ***************************************************************************************************************************
      Warning: Browsers use different units for previousX and screenX than what the specification defines.
      Depending on the browser and operating system, the previousX units may be a physical pixel, a logical pixel, or a CSS pixel.
      You may want to avoid the previous properties,
      and instead calculate the delta between the current client values (screenX, screenY) and the previous client values.
      from: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/previousX
      *************************************************************************************************************************** */
      const movementX = this.previousX - e.screenX;
      const movementY = this.previousY - e.screenY;

      // Asignment, does not use the raw screen number but their scaled vaions.
      this.component.node.x = this.component.node.x - (movementX/globalThis.project.zoom);
      this.component.node.y = this.component.node.y - (movementY/globalThis.project.zoom);

      // Reset, because the cursor has moved and is in a new position now.
      // lastN dat is used for calculating the delta between sampling mouse
      // we must remember the current postion until mose move fires, becasue then we will calculate previous, reative to where we are.
      this.previousX = e.screenX;
      this.previousY = e.screenY;
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
