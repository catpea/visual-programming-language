export default class Pan {

  transformMovement = (data)=>data;
  component;
  handle;

  mouseDownHandler;
  mouseMoveHandler;
  mouseUpHandler;

  dragging = false;

  previousX = 0;
  previousY = 0;

  constructor({component, handle, zone, transformMovement}){
    if(transformMovement) this.transformMovement = transformMovement;
    this.component = component;
    this.handle = handle;
    this.zone = zone;
    this.mount();
  }

  mount(){

    this.mouseDownHandler = (e) => {

      this.previousX = e.screenX;
      this.previousY = e.screenY;
      // Enable dragging
      this.dragging = true;
      this.component.iframe = false;
      this.zone.addEventListener('mousemove', this.mouseMoveHandler);
    };

    this.mouseMoveHandler = (e) => {
      const movementX = this.transformMovement( this.previousX - e.screenX );
      const movementY = this.transformMovement( this.previousY - e.screenY );

      this.component.panX = this.component.panX - movementX;
      this.component.panY = this.component.panY - movementY;

      this.previousX = e.screenX;
      this.previousY = e.screenY;
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
