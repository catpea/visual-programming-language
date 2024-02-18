import Properties from "#plug-ins/properties/Properties.js";
import Component from "#plug-ins/windows/Component.js";
import { VerticalLayout } from "./Layout.js";

import {log, error, warn, info, debug, seq} from "#plug-ins/log/index.js";
import { svg, update } from "domek";



export default class Container extends Component {

  extends = [Component];

  // NOTE: only containers have a layout, becasue they have children
  // NOTE: a layout applies to children only, this will not set xywh of the root component
  layout;

  constructor(...a) {
    super(...a);

    this.layout = new VerticalLayout(this);

    // NOTE: only containers have children, controls do not
    this.properties.install('children', []);


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


    this.properties.observe('name',  name=>update(this.el.Container,{name}), );

    this.on("started", started=>{
      if(started === true){
        this.#start();
      }else if(started === false){
        this.#stop()
      }
    });
  }

  /// OnX - concept upgrade - boundary layer -

  #start(){

    this.on('w',  width=>update(this.el.Container,{width}), );
    this.on('h', height=>update(this.el.Container,{height}),);
    this.on('x',      x=>update(this.el.Container,{x}),     );
    this.on('y',      y=>update(this.el.Container,{y}),     );
    this.on('r',     ry=>update(this.el.Container,{ry}),     );

    // Object.values(this.el).forEach(el => this.g.appendChild(el));

    this.on("children.created", (child) => {

      child.g = this.g;
			child.started = true;
      this.layout.manage(child);
    }, {replay: true});

    this.properties.observe("children.removed", (item) => {
      log('children.removed');
      item.started = false;
      this.layout.forget(item);
    });

  }

  #stop(){
    this.properties.stop();
    this.properties.status();
    Object.values(this.el).map(el=>el.remove());
  }









}
