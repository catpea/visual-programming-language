import Properties from "#plug-ins/properties/Properties.js";
import Tray from "#plug-ins/windows/Tray.js";

export default class Universe {

  archetypes = [];
  worlds = [];
  connections = [];

  started = false;
  name = "";

  svg;
  g;

  trays = new Map();
  lines = new Map();


  constructor() {
    this.properties = new Properties(this);

    this.properties.install("archetypes");
    this.properties.install("worlds");
    this.properties.install("connections");

    this.properties.install("started");

    this.properties.install("name");

    this.properties.install("svg");
    this.properties.install("g");

    this.properties.observe("name", v=> {
      document.querySelector('title').innerText = v;
    });

    this.properties.observe("started", (started) => {

      if(started){
        // only interested in starting things
        console.log(`Universe started = ${started}`);
        this.properties.observe("worlds.created", (item) => {
          console.log(`creating a world of type ${item.type} (should be more specific like Vpl Tray or Design Area)`);
          // instantiates trays!
          const supportedTypes = [Tray];
          const Component = supportedTypes.find(o=>o.name==item.type);
          if(!Component) throw new Error('Unrecongnized type')
      		const component = new Component();
      		this.trays.set(item.id, component);
          component.g = this.g;
          component.container = this;
          component.data = item;
          component.start({view: this });
        }, {replay:true});
        this.properties.observe("worlds.removed", ({id}) => {
          // stops and removes trays
          this.trays.get(id).stop();
          this.trays.delete(id);
        });
      }else{
        // only interested in stopping things
        console.log(`There are ${this.trays.size} this.trays to remove`);
        for (const {id} of this.trays) {
          this.trays.get(id).stop();
          this.trays.delete(id);
        } // for every tray
      } // if started is false

    }); // observe started


  } // constructor


  start(){
    this.started = true;
  }

  stop() {
    this.started = false;
    this.properties.stop(); // shut down all properties...
    this.properties.status();
  }

}
