import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Component from "/plug-ins/windows/Component.js";
import Anchor from "/plug-ins/windows/Anchor.js";
import { svg, update, click } from "domek";
import { AnchorLayout } from "/plug-ins/layout-manager/index.js";

export default class Caption {

  static extends = [Component];

  properties = {
    anchorage:null,
    handle:null,
  };

  observables = {
    anchors:[],
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
      this.anchorage = new AnchorLayout(this, {source: 'anchors'});

      this.el.Container = svg.rect({
        name: this.name,
        class: 'node-container',
        ry: this.r,
        // fill: 'red',
        'stroke-width': 2,
        // set initial values
        // these are special, handeled by the layout manager
        // NOTE: these are observables, getter returns a value, setter notifies listeners, and you can ```this.observe('x', v=>{...})```
        width: this.w,
        height: this.h,
        x: this.x,
        y: this.y,
      });

      this.handle = this.el.Container;

      this.disposable = click( this.el.Container, e=>{
        // console.log('CLICKED', this.parent.data.id, this, this.parent);
      });

      this.on("anchors.created", (anchor) => {
        anchor.start();
        this.anchorage.manage(anchor);
      }, {replay: true});

      this.on("anchors.removed", (anchor) => {
        anchor.stop();
        this.anchorage.forget(anchor);
      });

      this.on('name',  name=>update(this.el.Container,{name}), );
      this.on('w',  width=>update(this.el.Container,{width}), );
      this.on('h', height=>update(this.el.Container,{height}),);
      this.on('x',      x=>update(this.el.Container,{x}),     );
      this.on('y',      y=>update(this.el.Container,{y}),     );
      this.on('r',     ry=>update(this.el.Container,{ry}),     );

      this.appendElements();

      this.anchors.create(new Instance(Anchor, { name: 'input',  parent:this, scene: this.scene, side: 0 }))
      this.anchors.create(new Instance(Anchor, { name: 'output', parent:this, scene: this.scene, side: 1 }))
    },

    destroy(){
      this.removeElements()
    }

  }

}
