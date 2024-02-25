import Properties from "#plug-ins/properties/Properties.js";
import Component from "#plug-ins/windows/Component.js";

import {log, error, warn, info, debug, seq} from "#plug-ins/log/index.js";
import { svg, update } from "domek";


export default class Control extends Component {

  #constraints = {
    // started: { 'this.container is required before start': (v) => v==true?!(this.container===undefined||this.scene===undefined):Infinity }
  }

  constructor(...a) {
    super(...a);
    this.h = 32;

    this.el.Container = svg.rect({
      name: this.data.id,
      class: 'node-box',
      ry: this.r,
      'stroke-width': 1,
      // set initial values
      // these are special, handeled by the layout manager
      // NOTE: these are observables, getter returns a value, setter notifies listeners, and you can ```this.observe('x', v=>{...})```
      width: this.w,
      height: this.h,
      x: this.x,
      y: this.y,
    });

    this.properties.observe('name',  name=>update(this.el.Container,{name}), );

    this.properties.constraints( this.#constraints );



    this.on("started", started=>{

      if(started === true){
        this.#started();
      }else if(started === false){
        this.#stopped()
      }
    });

  }

  #started(){
    log('child start')

    // if(!this.container) throw new Error('Property .container is required')

    this.on('w',  width=>update(this.el.Container,{width}), );
    this.on('h', height=>update(this.el.Container,{height}),);
    this.on('x',      x=>update(this.el.Container,{x}),     );
    this.on('y',      y=>update(this.el.Container,{y}),     );
    this.on('r',     ry=>update(this.el.Container,{ry}),     );

    Object.values(this.el).forEach(el => {
      this.g.appendChild(el);
      console.log(this.g);
      // console.log('AAA appending', this.container.g, el);
    })

  }

  #stopped(){
    this.properties.stop();
    this.properties.status();
    Object.values(this.el).map(el=>el.remove());
  }

}
