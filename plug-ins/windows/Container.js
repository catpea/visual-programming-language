import Properties from "#plug-ins/properties/Properties.js";
import Component from "#plug-ins/windows/Component.js";
import { VerticalLayout } from "./Layout.js";

import { svg, update } from "domek";



export default class Container extends Component {



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

    this.properties.observe("started", started=>started?this.#onStart():this.#onStop());

  }

  /// OnX - concept upgrade - boundary layer -

  #onStart(){

    this.properties.observe('w',  width=>update(this.el.Container,{width}), );
    this.properties.observe('h', height=>update(this.el.Container,{height}),);
    this.properties.observe('x',      x=>update(this.el.Container,{x}),     );
    this.properties.observe('y',      y=>update(this.el.Container,{y}),     );
    this.properties.observe('r',     ry=>update(this.el.Container,{ry}),     );

    Object.values(this.el).forEach(el => this.g.appendChild(el));

    this.properties.observe("children.created", (item) => {
      item.container = this;
      item.g = this.g;
      this.layout.manage(item);
			item.started = true;
    }, {replay: true});

    this.properties.observe("children.removed", (item) => {
      item.stop();
      this.layout.forget(item);
    });

  }

  #onStop(){
      this.properties.stop();
      this.properties.status();
      Object.values(this.el).map(el=>el.remove());
  }









}
