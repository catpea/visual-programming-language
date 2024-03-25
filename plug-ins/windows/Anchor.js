import { svg, update } from "/plug-ins/domek/index.js"

import Component from "/plug-ins/windows/Component.js";
import Select from "/plug-ins/select/index.js";


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

      this.el.Primary = svg.circle({
        name: this.name,
        class: 'editor-anchor',
        'vector-effect': 'non-scaling-stroke',
        r: this.r,
        cx: this.x,
        cy: this.y,
      });
      this.on("selected", selected => selected?this.el.Primary.classList.add('selected'):this.el.Primary.classList.remove('selected'));

      const select = new Select({
        component: this,
        handle: this.el.Primary,
      }); this.destructable = ()=>select.destroy()

      this.el.Primary.dataset.target = [this.name, this.getRootContainer().id].join(':')

      this.pad = this.el.Primary;

      this.on('name',  name=>update(this.el.Primary,{name}), );
      this.on('x',      cx=>update(this.el.Primary,{cx}),     );
      this.on('y',      cy=>update(this.el.Primary,{cy}),     );
      this.on('r',      r=>update(this.el.Primary,{r}),     );
      this.appendElements();

      const connect = new Connect({
        anchor: this,
        zone: window,
        parent: this,
      }); this.destructable = ()=>connect.destroy()


    },

    destroy(){
      this.removeElements()
    }

  }

}
