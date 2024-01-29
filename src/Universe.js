import Properties from "#plug-ins/properties/Properties.js";
import Tray from "#plug-ins/windows/Tray.js";

export default class Universe {

  archetypes = [];
  worlds = [];
  connections = [];

  started = false;
  name = "";

  svg;
  scene;

  trays = new Map();
  lines = new Map();

  ///

  #supportedTypes = [ Tray ]; // What can the universe create?

  constructor() {

    this.properties = new Properties(this);

    this.properties.install("archetypes");
    this.properties.install("worlds");
    this.properties.install("connections");

    this.properties.install("started");

    this.properties.install("name");

    this.properties.install("svg");
    this.properties.install("scene");

    this.properties.observe("name", v=> {
      document.querySelector('title').innerText = v;
    });

    // example of hoisting concepts from observable to event-like
    this.properties.observe("started", started=>started?this.#onStart():this.#onStop());

  } // constructor


  #onStart(){

      console.log(`Universe onStart, world count: ${this.worlds.length}`, );

      this.properties.observe("worlds.created", (node) => {

        const Component = this.#supportedTypes.find(o=>o.name==node.type);
        if(!Component) throw new Error('Unrecongnized type');
    		const component = new Component();
    		this.trays.set(node.id, component);
        this.scene.appendChild(component.g);

        component.container = this;
        console.log('SETTING DATA ON', component);
        component.data = node;

        console.log('STARTING', component);
        component.started = true;
      }, {replay:true});

      this.properties.observe("worlds.removed", ({id}) => {
        // stops and removes trays
        this.trays.get(id).started = false;
        this.trays.delete(id);
      });

  }


  #onStop(){

    // remove all trays
    console.log(`There are ${this.trays.size} this.trays to remove`);

    for (const {id} of this.trays) {
      this.trays.get(id).started = false;
      this.trays.delete(id);
    } // for every tray

    // shut down all properties...
    this.properties.stop();
    this.properties.status();
  }

}
