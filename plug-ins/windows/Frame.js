import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Anchor from "/plug-ins/windows/Anchor.js";

import Control from "/plug-ins/windows/Control.js";
import { svg, html, update } from "domek";

export default class Frame {

  static extends = [Control];

  observables = {
    src: "",
  };

  constraints = {
    mount: {
      '.scene is required to start the universe': function(){ if(!this.scene){return {error:'.svg not found'}} },
    }
  }

  methods = {

    initialize(){
      console.log(`%cControl.initialize!`, 'background: hsl(180, 80%, 60%); color: black;', this);
    },

    mount(){

      this.anchors.create(new Instance(Anchor, { scene: this.scene, side: 0 }))
      this.anchors.create(new Instance(Anchor, { scene: this.scene, side: 0 }))
      this.anchors.create(new Instance(Anchor, { scene: this.scene, side: 1 }))
      this.anchors.create(new Instance(Anchor, { scene: this.scene, side: 1 }))
      this.anchors.create(new Instance(Anchor, { scene: this.scene, side: 1 }))
      this.anchors.create(new Instance(Anchor, { scene: this.scene, side: 1 }))

      this.el.ForeignObject = svg.foreignObject({
        name: this.name,
        width: this.w,
        height: this.h,
        x: this.x,
        y: this.y,
      });

      const iframe = html.iframe({
        src: this.src,
      });
      console.log('IFRAME', iframe);

      let origin = null;
      this.on('src', src=>{
        try{
        origin = (new URL(src)).origin;
        }catch(e){
          // malformed url
        }
      });
      window.addEventListener("message", function(msg){
        if (!origin === msg.origin) return;
        console.log(`Message from an iframe`, msg);
      }, false);

      this.el.ForeignObject.appendChild(iframe)

      this.on('name', name=>update(this.el.ForeignObject,{name}), );
      this.on('src',   src=>update(iframe,{src}) );



      this.on('w',   width=>update(this.el.ForeignObject,{width}),);
      this.on('h',   height=>update(this.el.ForeignObject,{height}),);
      this.on('x',       x=>update(this.el.ForeignObject,{x}),     );
      this.on('y',       y=>update(this.el.ForeignObject,{y}),     );

        this.on('w',   width=>update(iframe, {style:{width: width+'px'}} ));
        this.on('h',   height=>update(iframe, {style:{height: height+'px'}} ));

      this.appendElements();

    },

    destroy(){
      this.removeElements()
    }

  }

}
