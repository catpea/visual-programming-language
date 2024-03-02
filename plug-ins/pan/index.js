export default class Pan {

  component;
  handle;

  mouseDownHandler;
  mouseMoveHandler;
  mouseUpHandler;

  startX = 0;
  startY = 0;
  dragging = false;

  constructor({component, handle, zone}){
    this.component = component;
    this.handle = handle;
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
      this.component.iframe = false;
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
      // dx = dx + (this.component.panX * this.component.zoom);
      // dy = dy + (this.component.panY * this.component.zoom);
      dx = dx + this.component.panX;
      dy = dy + this.component.panY;

      // // Apply Scale Transformation To Everything
      // dx = dx / this.component.zoom;
      // dy = dy / this.component.zoom;

        console.log(this.component.panX, this.component.zoom);

      // Final Asignment
      this.component.panX = dx;
      this.component.panY = dy;
      // End
      dx = 0;
      dy = 0;
      // Reset, because the cursor has moved and is in a new position now.
      this.startX = e.clientX;
      this.startY = e.clientY;
     };

    this.mouseUpHandler = (e) => {
      this.dragging = false;
      this.component.iframe = true;
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
