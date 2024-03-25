import Component from "/plug-ins/windows/Component.js";

import { svg, update } from "/plug-ins/domek/index.js"

export default class Container {
  static extends = [Component];

  properties = {
    layout: null,
  };

  observables = {
    children: [],
  };

  traits = {
    draw(){
      this.el.Container = svg.rect({
        name: this.name,
        class: 'editor-container',
        ry: this.r,
        'stroke-width': 2,
        'vector-effect': 'non-scaling-stroke',

        // set initial values
        // these are special, handeled by the layout manager
        // NOTE: these are observables, getter returns a value, setter notifies listeners, and you can ```this.observe('x', v=>{...})```
        width: this.w,
        height: this.h,
        x: this.x,
        y: this.y,
      });

      this.on('name',  name=>update(this.el.Container,{name}), );
      this.on('w',  width=>update(this.el.Container,{width}), );
      this.on('h', height=>update(this.el.Container,{height}),);
      this.on('x',      x=>update(this.el.Container,{x}),     );
      this.on('y',      y=>update(this.el.Container,{y}),     );
      this.on('r',     ry=>update(this.el.Container,{ry}),     );

      this.appendElements();
    }
  };

  methods = {

    initialize(){

      this.on("children.created", (child) => {
        child.scene = this.scene;
        child.start();
        this.layout.manage(child);
      }, {replay: true});

      this.on("children.removed", (child) => {
        child.stop();
        this.layout.forget(child);
      });

    },

    mount(){



    },

    destroy(){
      this.removeElements()
    }

  }

}
