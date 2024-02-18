import Properties from "#plug-ins/properties/Properties.js";
import { v4 as uuid } from "uuid";

import { svg } from "domek";

const NOT_SET = 'NOT_SET';

export default class Component {
  properties; // property management

  defaults = {

    started:  undefined,
    scene:  undefined, // main svg group node to contain everything
    data:  NOT_SET, // raw object that described the initial configuration of the component

    name:  'un-named',

    x: 0,
    y: 0,
    w: 10,
    h: 10,
    H: 0, // min h
    r: 0,

    b: 0, // border
    p: 0, // padding
    s: 0, // spacer/gap

    container: null, // the visual parent container holding the child
  };


  id = uuid();


  // component creates its own g
  g = svg.g({class:'component'}); // svg group node to contain everything

  el = {}; // bag of elements


  constructor() {

    this.properties = new Properties(this);



    // this.properties.observe("scene", (scene) => {
    //   console.log('SCENE', {scene});
    //   if (scene) this.scene.appendChild(this.g)
    // },{autorun: false})


    // this.properties.constrain("theme", { message: (v) => `theme with id "${v}" is not installethis, d`, test: (v) => this.themes.map((o) => o.id).includes(v) });

    // once data is asigned, it should be monitored for changes





    this.on("data", (data) => {

      // console.log('############### DATA OBSERVING ##########################', data);
      if(data===NOT_SET) return;

      // observers of data opbject copy relevant data properties to the container properties
      data.on("x", x => this.x = x);
      data.on("y", y => this.y = y);
      data.on("w", w => this.w = w);
      data.on("h", h => this.h = h);
      data.on("H", H => this.H = H);
      data.on("r", r => this.r = r);

      data.on("b", b => this.b = b);
      data.on("p", p => this.p = p);
      data.on("s", s => this.s = s);

    });



  }

  // Introducing Concept of Root
  // NOTE: this is for both containers and controls so that they can find their way all the way up - therefore it belongs to Component.js

  get isRoot(){
    return !this.container;
  }

  get root() {
    let response = null;
    if(this.isRoot){
      response = this;
    }else{
      response = this.container.root;
    }
    return response;
  }

  ///

}
