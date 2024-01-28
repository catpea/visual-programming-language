import Properties from "#plug-ins/properties/Properties.js";
import { v4 as uuid } from "uuid";

import { svg } from "domek";


export default class Component {
  properties; // property management

  id = uuid();
  name = "unnamed"

  started = false;

  root; // root container
  container; // Component super-class that this is a child of

  scene; // svg group node to contain everything
  g = svg.g({class:'component'}); // svg group node to contain everything

  el = {}; // bag of elements

  x=0;
  y=0;
  w=10;
  h=10;
  H=110; // min h
  r=0;

  b=0; // border
  p=0; // padding
  s=2; // spacer/gap

  container; // the visual parent container holding the child
  data; // raw object that described the initial configuration of the component

  constructor() {




    this.properties = new Properties(this);

    this.properties.install("started");
    this.properties.install("name");
    this.properties.install("data");
    this.properties.install("scene");

    this.properties.install("x");
    this.properties.install("y");
    this.properties.install("w");
    this.properties.install("h");
    this.properties.install("H");
    this.properties.install("r");

    this.properties.install("b");
    this.properties.install("p");
    this.properties.install("s");

    this.properties.observe("scene", (scene) => {
      if (scene) this.scene.appendChild(this.g)
    })


    // this.properties.constrain("theme", { message: (v) => `theme with id "${v}" is not installed`, test: (v) => this.themes.map((o) => o.id).includes(v) });

    // once data is asigned, it should be monitored for changes
    this.properties.observe("data", (data) => {
      if(!data) return;
      // observers of data opbject copy relevant data properties to the container properties
      this.properties.disposable( data.properties.observe("x", x => this.x = x) );
      this.properties.disposable( data.properties.observe("y", y => this.y = y) );
      this.properties.disposable( data.properties.observe("w", w => this.w = w) );
      this.properties.disposable( data.properties.observe("h", h => this.h = h) );
      this.properties.disposable( data.properties.observe("r", r => this.r = r) );
      this.properties.disposable( data.properties.observe("b", b => this.b = b) );
      this.properties.disposable( data.properties.observe("p", p => this.p = p) );

    });
  }

  start() {
    Object.values(this.el).forEach(el => this.g.appendChild(el));
    this.started = true;
  }

  stop() {
    this.started = false;
    this.properties.stop();
    this.properties.status();
    Object.values(this.el).map(el=>el.remove());
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
