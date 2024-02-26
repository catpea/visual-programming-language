import Component from "/plug-ins/windows/Component.js";
import { svg, update } from "domek";

export default class Control {

  static extends = [Component];

  properties = {
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

      this.el.Container = svg.rect({
        name: this.name,
        class: 'node-box',
        ry: this.r,
        'stroke-width': 2,
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
    },

    destroy(){
      this.removeElements()
    }

  }

}
