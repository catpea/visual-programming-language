import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Anchor from "/plug-ins/windows/Anchor.js";

import Control from "/plug-ins/windows/Control.js";
import { svg, html, update } from "/plug-ins/domek/index.js"

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
      // console.log(`%cControl.initialize!`, 'background: hsl(180, 80%, 60%); color: black;', this);
    },

    mount(){

      this.createControlAnchor({ name: 'src', side: 0 });

      this.el.ForeignObject = svg.foreignObject({
        name: this.name,
        width: this.w,
        height: this.h,
        x: this.x,
        y: this.y,
      });

      const iframe = html.iframe({
        class: 'editor-frame',
        src: this.src,
      });
      // console.log('IFRAME', iframe);

      let origin = null;
      this.on('src', src=>{
        try{
        origin = (new URL(src)).origin;
        }catch(e){
          // malformed url
        }
      });

      window.addEventListener("message", (msg)=>{

        const isSameOrigin = origin === msg.origin;
        const isSameSource = this.src === msg.source.location.href;
        if (!isSameOrigin) return;
        if (!isSameSource) return;

        const {name, data} = msg.data;
        // console.log(`Message from an iframe`, msg.data);

        let anchor = this.anchors.find(anchor=>anchor.name===name);

        let color;
        if(data.color) color = `rgba(${data.color.join(', ')})`;
        // console.log(color, data.position);
        if(!anchor){
          this.anchors.create(new Instance(Anchor, { name, parent:this, scene: this.scene, side: 1, color }))
        }else{
          anchor.color = color;
        }

        // console.log(`Message SOURCE`, (!this.src === msg.source.location.href), this.src, msg.source.location.href);
        // console.log(`Message from an iframe`, msg);
        // console.log(this.src, {
        //   isSameOrigin: [isSameOrigin,origin, msg.origin],
        //   isSameSource: [isSameSource, this.src, msg.source.location.href],
        //   source: msg.source.location.href,
        //   origin: msg.origin,
        //   data: msg.data,
        // });


      }, false);

      this.el.ForeignObject.appendChild(iframe)


        globalThis.project.on('iframe', visibility=>{
          // console.log('visibility', visibility);
          this.el.ForeignObject.style.display = visibility?'block':'none';
        });


      this.on('name', name=>update(this.el.ForeignObject,{name}));
      this.on('src',   src=>update(iframe,{src}));

      this.on('w', width=>update(this.el.ForeignObject,{width}));
      this.on('h', height=>update(this.el.ForeignObject,{height}));
      this.on('x', x=>update(this.el.ForeignObject,{x}));
      this.on('y', y=>update(this.el.ForeignObject,{y}));
      this.on('w', width=>update(iframe, {style:{width: width+'px'}}));
      this.on('h', height=>update(iframe, {style:{height: height+'px'}}));

      this.appendElements();

    },

    destroy(){
      this.removeElements()
    }

  }

}
