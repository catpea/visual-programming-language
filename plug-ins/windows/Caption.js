import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Control from "/plug-ins/windows/Control.js";
import Label from "/plug-ins/windows/Label.js";
import Anchor from "/plug-ins/windows/Anchor.js";
import { svg, update, click } from "/plug-ins/domek/index.js"

export default class Caption {

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
      // console.log(`%cComponent.initialize!`, 'background: hsl(180, 80%, 60%); color: black;', this);
    },

    mount(){

      this.el.Container = svg.rect({
        name: this.name,
        class: 'editor-caption',
        'vector-effect': 'non-scaling-stroke',
        ry: this.r,
        // set initial values
        // these are special, handeled by the layout manager
        // NOTE: these are observables, getter returns a value, setter notifies listeners, and you can ```this.observe('x', v=>{...})```
        width: this.w,
        height: this.h,
        x: this.x,
        y: this.y,
      });

      this.on("selected", selected => selected?this.el.Container.classList.add('selected'):this.el.Container.classList.remove('selected'));


      const label = new Instance(Label, {scene:this.scene, h: 24, caption: `${this.name}`});
      this.destructable = ()=>{label.stop(); label.destroy();}


      this.disposable = click( this.el.Container, e=>{
        // console.log('CLICKED', this.parent.data.id, this, this.parent);
      });



      this.on('name',  name=>update(this.el.Container,{name}), );
      this.on('w',  width=>update(this.el.Container,{width}), );
      this.on('h', height=>update(this.el.Container,{height}),);
      this.on('x',      x=>update(this.el.Container,{x}),     );
      this.on('y',      y=>update(this.el.Container,{y}),     );
      this.on('r',     ry=>update(this.el.Container,{ry}),     );

      this.any(['x','y','w','h'],  ({x,y,w,h})=>Object.assign(label, {x,y,w,h}));



      this.appendElements();
      label.start()
      this.handle = label.el.Container;


      this.createControlAnchor({ name: 'input', side: 0 });
      this.createControlAnchor({ name: 'output', side: 1 });

    },

    destroy(){
      this.removeElements()
    }

  }

}
