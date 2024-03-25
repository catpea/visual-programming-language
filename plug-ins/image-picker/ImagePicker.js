import { svg, html, update } from "/plug-ins/domek/index.js"
import Control from "/plug-ins/windows/Control.js";

function range(n){
  return Array(n).fill().map((_,i)=>i)
}

export default class ImagePicker {

  static extends = [Control];

  observables = {
    url: undefined,
  };

  methods = {

    initialize(){
    },

    mount(){

      this.el.Primary = svg.foreignObject({
        name: this.name,
        width: this.w,
        height: this.h,
        x: this.x,
        y: this.y,
      });

      this.getRootContainer().node.on('colorAnchors', count=>{

        for (const number of range(count)) {
          const name = `color${number}`;
          this.createControlAnchor({name, side:1})
          this.oo.createObservable(`color${number}`)
        }

        for (const number of range(count)) {
          const name = `color${number}`;
          // this.pipe(`color{i}`).on('data', data=>this[name]=data); // update local property
        }

        // Array(count).fill().map((_,i)=>{
        //
      });
      // this.any(colorNames, packet=>{})

      const canvas = html.canvas({
        class: 'editor-image-picker-canvas w-100',
        width: this.w,
        height: this.h,
      });




      const pick = new Pick({
        component: this,
        handle: canvas,
        zone: window,
        onData: data => {
          for (const name of this.anchors.filter(anchor=>anchor.selected).map(anchor=>anchor.name)) {
            // store color locally
            this[name] = data;
            // send it along
            this.pipe(name).emit('data', data);
          }
        },
      }); this.destructable = ()=>pick.destroy()

      this.el.Primary.appendChild(canvas)

      this.on("url", (url) => {
        const img = new Image();
        img.addEventListener("load", function () {
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        });
        img.setAttribute("src", url);
      });

      this.on('w', width=>update(this.el.Primary,{width}));
      this.on('h', height=>update(this.el.Primary,{height}));

      this.on('x', x=>update(this.el.Primary,{x}));
      this.on('y', y=>update(this.el.Primary,{y}));

      this.on('w', width=>update(canvas, {style:{width: width+'px'}}));
      this.on('h', height=>update(canvas, {style:{height: height+'px'}}));

      this.appendElements();


    }
  };

}



class Pick {


    component;
    handle;
    zone;
    onData;

    mouseDownHandler;
    mouseMoveHandler;
    mouseUpHandler;

    dragging = false;

    constructor({component, handle, zone, onData}){
      if(!component) throw new Error('component is required')
      if(!handle) throw new Error('handle is required')
      if(!zone) throw new Error('zone is required')
      if(!onData) throw new Error('onData is required')

      this.component = component;
      this.handle = handle;
      this.zone = zone;
      this.onData = onData;
      this.mount();
    }

    mount(){



      this.mouseMoveHandler = (e) => {
        const context = this.handle.getContext('2d');

        const rect = this.handle.getBoundingClientRect();

        let imageRatio = Math.min(
          this.handle.width/
          (this.handle.getBoundingClientRect().width/globalThis.project.zoom),
          this.handle.height/
          (this.handle.getBoundingClientRect().height/globalThis.project.zoom)
        );

        // raw coordinates
        const trueX = e.clientX - rect.left;
        const trueY = e.clientY - rect.top;

        // corrected for zoom
        const zoomedX = trueX / globalThis.project.zoom;
        const zoomedY = trueY / globalThis.project.zoom;

        // corrected for image ratio (taking under consideration canvas resizing)
        const ratiodX = zoomedX * imageRatio;
        const ratiodY = zoomedY * imageRatio;

        const position = { x:ratiodX, y:ratiodY};
        const data = context.getImageData(position.x, position.y, 1, 1).data;
        const rgba = [data[0], data[1], data[2], data[3]];
        const packet = {
          color: `rgba(${rgba.join(', ')})`,
          rgba,
          ...position,
        };
        this.onData(packet);

       };

       this.mouseDownHandler = (e) => {
         this.dragging = true;
         this.mouseMoveHandler(e); //kick off
         this.zone.addEventListener('mousemove', this.mouseMoveHandler);
       };

      this.mouseUpHandler = (e) => {
        this.dragging = false;
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
