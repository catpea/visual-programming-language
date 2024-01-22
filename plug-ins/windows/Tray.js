import Properties from "#plug-ins/properties/Properties.js";
import Component from "#plug-ins/windows/Component.js";

import { svg, update } from "domek";


export default class Tray extends Component {

  constructor(...a) {
    super(...a);

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

    this.properties.observe("started", (started) => {
      if(started){

        this.properties.observe('w',  width=>update(this.el.Container,{width}), );
        this.properties.observe('h', height=>update(this.el.Container,{height}),);
        this.properties.observe('x',      x=>update(this.el.Container,{x}),     );
        this.properties.observe('y',      y=>update(this.el.Container,{y}),     );
        this.properties.observe('r',     ry=>update(this.el.Container,{ry}),     );

      }else{

      }
    })

  }

  start() {
    super.start();
    console.log(`I am a tray and I just got started... my id is ${this.id}::${this.data.id}`);


  }

  stop() {
    super.stop();
  }

}
