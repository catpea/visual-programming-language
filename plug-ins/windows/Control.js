import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Component from "/plug-ins/windows/Component.js";
import Anchor from "/plug-ins/windows/Anchor.js";
import { svg, update } from "/plug-ins/domek/index.js"
import { AnchorLayout } from "/plug-ins/layout-manager/index.js";
import { Pipe } from "/plug-ins/pipe/Pipe.js";

export default class Control {

  static extends = [Component];

  properties = {
    anchorage: null,
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
      // console.log(`%cControl.initialize!`, 'background: hsl(180, 80%, 60%); color: black;', this);
    },

    mount(){
      this.anchorage = new AnchorLayout(this, {source: 'anchors'});
      // this.piper = new EventSystem(this.getRootContainer(), {source: 'streams'});

      // this.el.Container = svg.rect({
      //   name: this.name,
      //   class: 'editor-control',
      //   ry: this.r,
      //   'stroke-width': 2,
      //   // set initial values
      //   // these are special, handeled by the layout manager
      //   // NOTE: these are observables, getter returns a value, setter notifies listeners, and you can ```this.observe('x', v=>{...})```
      //   width: this.w,
      //   height: this.h,
      //   x: this.x,
      //   y: this.y,
      // });

      this.on("anchors.created", (anchor) => {
        anchor.start();
        this.createPipe(anchor.name, anchor.side);
        this.anchorage.manage(anchor);
      }, {replay: true});

      this.on("anchors.removed", (anchor) => {
        anchor.stop();
        this.removePipe(anchor.name);
        this.removeControlAnchor(anchor.id);
        this.anchorage.forget(anchor);
      });

      // this.on('name',  name=>update(this.el.Container,{name}), );
      // this.on('w',  width=>update(this.el.Container,{width}), );
      // this.on('h', height=>update(this.el.Container,{height}),);
      // this.on('x',      x=>update(this.el.Container,{x}),     );
      // this.on('y',      y=>update(this.el.Container,{y}),     );
      // this.on('r',     ry=>update(this.el.Container,{ry}),     );

      this.appendElements();
    },


    createPipe(name, direction){
      const id = [name, this.getRootContainer().id].join(':');
      const pipe = new Pipe(id, direction);
      const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
      origin.root.pipes.create(pipe);
    },

    removePipe(name){
      const id = [name, this.getRootContainer().id].join(':');
      const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
      origin.root.pipes.get(id).stop();
      origin.root.pipes.remove(id);
    },


    createControlAnchor({name, side}){
      if(!name) throw new Error(`It is not possible to create an anchor without an anchor name.`);
      if(!side===undefined) throw new Error(`It is not possible to create an anchor without specifying a side, 0 or 1.`);
      const id = [name, this.getRootContainer().id].join(':')
      const anchor = new Instance(Anchor, { id, name, side, parent: this, scene: this.scene } )
      const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
      origin.root.anchors.create(anchor);
      this.anchors.create(anchor);
    },

    removeControlAnchor(id){
      this.anchors.remove(id);
      const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
      origin.root.anchors.remove(id);
    },

    destroy(){
      console.warn('TODO: DESTROY ALL ANCHORS');
      console.warn('TODO: STOP ANCHORAGE');
      this.removeElements()
    }

  }

}
