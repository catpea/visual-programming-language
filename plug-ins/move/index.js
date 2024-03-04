export default class Move {

  component;
  window;
  handle;
  zone;

  mouseDownHandler;
  mouseMoveHandler;
  mouseUpHandler;

  startX = 0;
  startY = 0;
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
      // Remember where mouse touched down
      this.startX = e.clientX;
      this.startY = e.clientY;
      // Enable dragging
      this.dragging = true;
      globalThis.project.iframe = false;
      this.zone.addEventListener('mousemove', this.mouseMoveHandler);
    };

    this.mouseMoveHandler = (e) => {
      // if(this.scale == undefined) console.error('you must correctly configure scale',this.scale );
      // NOTE: this code has been tested and it works. //
      // Start from beginning, using "" to have dx available throughout
      let dx = 0;
      let dy = 0;
      // Substract initial position from current cursor position to get relative motion, motion relative to initial touchdown
      dx = e.clientX - this.startX;
      dy = e.clientY - this.startY;

      // Add a scaled version of the node
      dx = dx + (this.component.node.x * globalThis.project.zoom);
      dy = dy + (this.component.node.y * globalThis.project.zoom);
      // dx = dx + this.component.panX;
      // dy = dy + this.component.panY;

      // // Apply Scale Transformation To Everything
      dx = dx / globalThis.project.zoom;
      dy = dy / globalThis.project.zoom;

      // Final Asignment
      this.component.node.x = dx;
      this.component.node.y = dy;

      // End
      dx = 0;
      dy = 0;
      // Reset, because the cursor has moved and is in a new position now.
      this.startX = e.clientX;
      this.startY = e.clientY;
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
