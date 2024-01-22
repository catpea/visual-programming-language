import Properties from "#plug-ins/properties/Properties.js";
import { v4 as uuid } from "uuid";


export default class Component {
  properties; // property management

  id = uuid();

  started = false;

  g; // svg group node to contain everything
  el = {}; // bag of elements

  x=0;
  y=0;
  w=10;
  h=10;
  r=0;

  box;

  container; // the visual parent container holding the child
  data; // raw object that described the initial configuration of the component

  constructor() {
    this.properties = new Properties(this);

    this.properties.install("started");
    this.properties.install("data");

    this.properties.install("x");
    this.properties.install("y");
    this.properties.install("w");
    this.properties.install("h");
    this.properties.install("r");

    this.properties.install("b");


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

    });
  }

  start() {
    this.started = true;
    Object.values(this.el).forEach(el => this.g.appendChild(el));
  }

  stop() {

    this.started = false;
    this.properties.stop();
    this.properties.status();
    Object.values(this.el).map(el=>el.remove());
  }

}
