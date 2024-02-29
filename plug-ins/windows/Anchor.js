import Component from "/plug-ins/windows/Component.js";
import { svg, update } from "domek";

export default class Anchor {

  static extends = [Component];

  properties = {
  };

  observables = {
    side: 0,
  };

  constraints = {
    mount: {
      '.scene is required': function(){ if(!this.scene){return {error:'.svg not found'}} },
    }
  }

  methods = {

    initialize(){
      console.log(`%cAnchor.initialize!`, 'background: hsl(180, 80%, 60%); color: black;', this);
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
      this.on('name',  name=>update(this.el.Circle,{name}), );
      this.on('x',      cx=>update(this.el.Circle,{cx}),     );
      this.on('y',      cy=>update(this.el.Circle,{cy}),     );
      this.on('r',      r=>update(this.el.Circle,{r}),     );
      this.appendElements();

      let leCounter = 0;
      setInterval(()=>{
        if(leCounter % 2 == 0){
          update(this.el.Circle, {style:{fill:'yellow'}} )
        }else{
          update(this.el.Circle, {style:{fill:'red'}} )
        }

        leCounter++;
      }, 10_000/this.getRandomIntInclusive(1, 10))


    },

    destroy(){
      this.removeElements()
    }

  }

}
