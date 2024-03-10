import { svg, html, update } from "domek";
import Container from "/plug-ins/windows/Container.js";

export default class ImagePicker {

  static extends = [Container];

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

      const canvas = html.canvas({
        class: 'editor-image-picker-canvas w-100',
        width: this.w,
        height: this.h,
      });

      // function getEventLocation(element, event){
      // 		const pos = getElementPosition(element);
      //     const actualWidth = element.getBoundingClientRect().width;
      //     const actualWeight = element.getBoundingClientRect().height;
      //     const ratio = Math.min(actualWidth / element.width, actualWeight / element.height);
      //     const x = event.pageX/ratio;
      //     const y = event.pageY/ratio;
      //     return { x , y };
      // }

      const that = this;
      const getData = function(e){
    	  // const eventLocation = getEventLocation(this, e);
        const context = this.getContext('2d');
        var ratio = Math.min(this.width/this.getBoundingClientRect().width , this.height/this.getBoundingClientRect().height );
        const position = {r:ratio, z:globalThis.project.zoom, x:(e.layerX*ratio )*globalThis.project.zoom, y:(e.layerY*ratio )*globalThis.project.zoom};
        // context.fillRect(position.x, position.y, 10, 10);


        const data = context.getImageData(position.x, position.y, 1, 1).data;
        const color = [data[0], data[1], data[2], data[3]];
        const packet = { name:'color'+e.button, data:{position, color} };

        // console.log('SEND PACKET', packet);
        // const id = ['output', that.root().id].join(':');
        // const output = globalThis.project.pipes.get(id);
        // console.log(output);




        that.pipe('output').emit('data', packet);

        // output.emit('data', packet);

        // output.enqueue(packet);
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
