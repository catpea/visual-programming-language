import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Control from "/plug-ins/windows/Control.js";
import Anchor from "/plug-ins/windows/Anchor.js";
import { svg, update, click } from "/plug-ins/domek/index.js"

import Move from "/plug-ins/move/index.js";
import Focus from "/plug-ins/focus/index.js";
import Select from "/plug-ins/select/index.js";

export default class Junction {

  static extends = [Control];

  properties = {
    handle:null,
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
      this.w = 0;
      this.h = 0;
      this.r = 12;
    },

    mount(){

      this.el.Primary = svg.circle({
        name: this.name,
        class: 'editor-junction',
        'vector-effect': 'non-scaling-stroke',
        r: this.r,
        width: this.w,
        height: this.h,
        cx: this.x,
        cy: this.y,
      });

      this.on("selected", selected => selected?this.el.Primary.classList.add('selected'):this.el.Primary.classList.remove('selected'));

      const move = new Move({
        component: this,
        handle: this.el.Primary,
        window: this,
        zone: window,
      }); this.destructable = ()=>move.destroy()

      const focus = new Focus({
        component: this,
        handle: this.scene, // set to caption above to react to window captions only
      }); this.destructable = ()=>focus.destroy()

      const select = new Select({
        component: this,
        handle: this.el.Primary,
      }); this.destructable = ()=>select.destroy()

      this.appendElements();

      const inputAnchor = this.createControlAnchor({ name: 'input', side:  0, r:4});
      const outputAnchor = this.createControlAnchor({ name: 'output', side: 1, r:4});
      
      this.pipe('input').on('data', (data)=>this.pipe('output').emit('data', data))

      this.on('name', name=>update(this.el.Primary,{name}) );
      this.on('x',      cx=>update(this.el.Primary,{cx})   );
      this.on('y',      cy=>update(this.el.Primary,{cy})   );

    },

    destroy(){
      this.removeElements()
    }

  }

}
