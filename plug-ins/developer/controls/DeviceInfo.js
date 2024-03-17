import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Control from "/plug-ins/windows/Control.js";
import Anchor from "/plug-ins/windows/Anchor.js";
import { svg, update, click, text } from "/plug-ins/domek/index.js"

export default class DeviceInfo {

  static extends = [Control];

  properties = {
    handle:null,

  };

  observables = {
    caption: '',
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
        class: 'editor-node-info',
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


      this.el.Caption = svg.text({
        name: this.name,
        class: 'editor-node-info-text',
        'dominant-baseline': 'hanging',
        x: this.x,
        y: this.y,
      }, );

      const captionText = text(this.caption);
      this.el.Caption.appendChild(captionText);

      this.on("selected", selected => selected?this.el.Container.classList.add('selected'):this.el.Container.classList.remove('selected'));



      this.handle = this.el.Container;

      this.disposable = click( this.el.Container, e=>{
        // console.log('CLICKED', this.parent.data.id, this, this.parent);
      });



      this.on('name',  name=>update(this.el.Container,{name}), );
      this.on('w',  width=>update(this.el.Container,{width}), );
      this.on('h', height=>update(this.el.Container,{height}),);
      this.on('x',      x=>update(this.el.Container,{x}),     );
      this.on('y',      y=>update(this.el.Container,{y}),     );
      this.on('r',     ry=>update(this.el.Container,{ry}),     );


      this.on('caption',  caption=>captionText.nodeValue = caption);
      this.any(['x','y'], properties=>update(this.el.Caption, properties))


      this.appendElements();

      // this.createControlAnchor({ name: 'input', side: 0 });
      // this.createControlAnchor({ name: 'output', side: 1 });

    },

    destroy(){
      this.removeElements()
    }

  }

}
