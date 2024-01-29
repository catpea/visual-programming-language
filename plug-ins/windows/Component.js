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

  // scene; // svg group node to contain everything
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
  s=0; // spacer/gap

  container = null; // the visual parent container holding the child
  data = 0; // raw object that described the initial configuration of the component

  constructor() {

    this.properties = new Properties();


    this.properties.install(this, "started");
    this.properties.install(this, "name");
    this.properties.install(this, "scene");
    this.properties.install(this, "data");


    this.properties.install(this, "x");
    this.properties.install(this, "y");
    this.properties.install(this, "w");
    this.properties.install(this, "h");
    this.properties.install(this, "H");
    this.properties.install(this, "r");

    this.properties.install(this, "b");
    this.properties.install(this, "p");
    this.properties.install(this, "s");

    // this.properties.observe("scene", (scene) => {
    //   console.log('SCENE', {scene});
    //   if (scene) this.scene.appendChild(this.g)
    // },{autorun: false})


    // this.properties.constrain("theme", { message: (v) => `theme with id "${v}" is not installethis, d`, test: (v) => this.themes.map((o) => o.id).includes(v) });

    // once data is asigned, it should be monitored for changes


    console.log(this.id, 'this.properties.observe("data"...');
    this.properties.observe("data", (data) => {

      console.log('############### DATA OBSERVING ##########################', data);
      if(!data) return;
      // observers of data opbject copy relevant data properties to the container properties
      data.properties.observe("x", x => this.x = x);
      data.properties.observe("y", y => this.y = y);
      data.properties.observe("w", w => this.w = w);
      data.properties.observe("h", h => this.h = h);
      data.properties.observe("r", r => this.r = r);
      data.properties.observe("b", b => this.b = b);
      data.properties.observe("p", p => this.p = p);

      // this.properties.disposable( data.properties.observe("x", x => this.x = x) );
      // this.properties.disposable( data.properties.observe("y", y => this.y = y) );
      // this.properties.disposable( data.properties.observe("w", w => this.w = w) );
      // this.properties.disposable( data.properties.observe("h", h => this.h = h) );
      // this.properties.disposable( data.properties.observe("r", r => this.r = r) );
      // this.properties.disposable( data.properties.observe("b", b => this.b = b) );
      // this.properties.disposable( data.properties.observe("p", p => this.p = p) );

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
