import { svg, update } from "domek";

import Component from "/plug-ins/windows/Component.js";

import Connect from "/plug-ins/connect/index.js";

export default class Anchor {

  static extends = [Component];

  properties = {
    pad: null
  };

  observables = {
    side: 0,
    color: 'transparent',
  };

  constraints = {
    mount: {
      '.scene is required': function(){ if(!this.scene){return {error:'.svg not found'}} },
    }
  }

  methods = {

    initialize(){

      this.r = 8;
      this.s = 4;

      this.w = this.r*2;
      this.h = this.r*2+this.s;

      this.x = 0;
      this.y = 0;
    },

    mount(){

      this.el.Circle = svg.circle({
        name: this.name,
        class: 'anchor-container',
        'stroke-width': 2,
        r: this.r,
        cx: this.x,
        cy: this.y,
      });

      this.el.Circle.dataset.target = [this.name, this.root().data.id].join(':')

      this.pad = this.el.Circle;

      this.on('name',  name=>update(this.el.Circle,{name}), );
      this.on('color',  fill=>update(this.el.Circle,{style:{fill}}), );
      this.on('x',      cx=>update(this.el.Circle,{cx}),     );
      this.on('y',      cy=>update(this.el.Circle,{cy}),     );
      this.on('r',      r=>update(this.el.Circle,{r}),     );
      this.appendElements();

      const connect = new Connect({
        anchor: this,
        // handle: caption.handle,
        // window: this,
        zone: window,
      }); this.destructable = ()=>connect.destroy()


    },

    destroy(){
      this.removeElements()
    }

  }

}
