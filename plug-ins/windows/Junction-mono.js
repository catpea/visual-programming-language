import { svg, update } from "/plug-ins/domek/index.js"

import Component from "/plug-ins/windows/Component.js";

import Select from "/plug-ins/select/index.js";
import Connect from "/plug-ins/connect/index.js";

export default class Junction {

  static extends = [Component];

  properties = {
    pad: null
  };

  observables = {
  };

  constraints = {
    mount: {
      '.scene is required to start the universe': function(){ if(!this.scene){return {error:'.svg not found'}} },
    }
  }

  methods = {

    initialize(){

      this.r = 8;

      // console.log(`%cJunction.initialize!`, 'background: hsl(180, 80%, 60%); color: black;', this);

      // setInterval(x=>{
      //   this.x = this.x + this.getRandomIntInclusive(-1,1);
      //   this.y = this.y + this.getRandomIntInclusive(-1,1);
      // }, 1_000/22);

    },

    mount(){

      this.el.Circle = svg.circle({
        name: this.name,
        class: 'editor-junction',
        'vector-effect': 'non-scaling-stroke',
        r: this.r,
        cx: this.x,
        cy: this.y,
      });

      this.pad = this.el.Circle;

      const connect = new Connect({
        anchor: this,
        // handle: caption.handle,
        // window: this,
        zone: window,
      }); this.destructable = ()=>connect.destroy()

      this.on('name',  name=>update(this.el.Circle,{name}), );
      this.on('x',      cx=>update(this.el.Circle,{cx}),     );
      this.on('y',      cy=>update(this.el.Circle,{cy}),     );
      this.on('r',      r=>update(this.el.Circle,{r}),     );

      this.appendElements();
    },

    destroy(){
      this.removeElements()
    }

  }

}
