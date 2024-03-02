import Component from "/plug-ins/windows/Component.js";
import { VerticalLayout } from "/plug-ins/layout-manager/index.js";

import { svg, update } from "domek";

export default class Container {
  static extends = [Component];

  properties = {
    layout: null,
  };

  observables = {
    children: [],
  };

  methods = {

    initialize(){
      // console.log(`%cContainer.initialize!`, 'background: hsl(180, 80%, 60%); color: black;');
      this.layout = new VerticalLayout(this);

      this.on("children.created", (child) => {
        // console.log(`About to start ${child.oo.name}`, child, );
        child.start();
        this.layout.manage(child);
      }, {replay: true});

      this.on("children.removed", (item) => {
        // log('children.removed');
        item.stop();
        this.layout.forget(item);
      });
    },

    mount(){

      this.el.Container = svg.rect({
        name: this.name,
        class: 'node-container',
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
      // console.log(this.el.Container);
    },

    destroy(){
      this.removeElements()
    }

  }

}
