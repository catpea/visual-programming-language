import Properties from "#plug-ins/properties/Properties.js";
import Tray from "#plug-ins/windows/Tray.js";

export default class Universe {

  defaults = {
    archetypes: [],
    worlds: [],
    connections: [],
    started: undefined,
    name: "Bork",
    svg: undefined,
    scene: undefined,
  }

  constraints = {
    started: { 'properties .svg and .scene are required to start the universe': (v) => v==true?!(this.svg===undefined||this.scene===undefined):Infinity }
  }

  trays = new Map();
  lines = new Map();

  ///

  #supportedTypes = [ Tray ]; // What can the universe create?

  constructor() {

    this.properties = new Properties(this);

    this.on('name', v=> {
      if(v) document.querySelector('title').innerText = v;
    });

    this.on("started", started=>{
      if(started === true){
        this.#onStart();
      }else if(started === false){
        this.#onStop()
      }
    });

  } // constructor


  #onStart(){

      console.log(`Universe onStart, world count: ${this.worlds.length}`, );

      this.on("worlds.created", (node) => {
        console.log('worlds.created', node);
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

      this.on("worlds.removed", ({id}) => {
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
