import { svg, html, update } from "domek";
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

      this.root().node.on('colorAnchors', count=>{

        for (const number of range(count)) {
          const name = `color${number}`;
          this.createControlAnchor({name, side:1})
          this.oo.addObservable(`color${number}`)
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



      const that = this;
      const getData = function(e){
    	  // const eventLocation = getEventLocation(this, e);
        const context = this.getContext('2d');
        var ratio = Math.min(this.width/this.getBoundingClientRect().width , this.height/this.getBoundingClientRect().height );
        const position = {r:ratio, z:globalThis.project.zoom, x:(e.layerX*ratio )*globalThis.project.zoom, y:(e.layerY*ratio )*globalThis.project.zoom};

        const data = context.getImageData(position.x, position.y, 1, 1).data;
        const color = [data[0], data[1], data[2], data[3]];
        const packet = {
          name:'color'+e.button,
          color: `rgba(${color.join(', ')})`,
          data:{position, color}
        };

        // console.log( that.anchors.filter(anchor=>anchor.selected).map(anchor=>anchor.name) );
        for (const name of that.anchors.filter(anchor=>anchor.selected).map(anchor=>anchor.name)) {

          // store color locally
          that[name] = packet;

          // send it along
          that.pipe(name).emit('data', packet);

        }
      }
      canvas.addEventListener("mousedown", getData);
      this.destructible = ()=> canvas.removeEventListener("mousedown", getData);



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
