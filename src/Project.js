import Properties from "#plug-ins/properties/Properties.js";
import VisualProgram from "#plug-ins/applications/VisualProgram.js";
import Node from "#plug-ins/node/Node.js";

import {Instance} from "#plug-ins/object-oriented-programming/index.js";

import {log, error, warn, info, debug, seq} from "#plug-ins/log/index.js";

export default class Project {

  // extends = [];

  state = {
    current: 'initial',

    initial: {
       run: 'initialize',
       can: 'start'
     },

     start: {
       run: 'started',
       can: 'stop'
     },

     stop: {
       run: ['stopped', 'destroy'],
       can: 'start'
     },

  };
  properties = {
    types: [ VisualProgram ], // What can the project instantiate?
    ui: new Map(), // track all the ui
  };

  observables = {
    svg: undefined,
    scene: undefined,
    file: undefined,
    name: "Bork",

    archetypes: [],
    concepts: [],
    transports: [],

  };

  constraints = {
    started: {
      '.svg is required to start the universe': function(){ if(!this.svg){return {error:'.svg not found'}} },
      '.scene is required to start the universe': function(){ if(!this.scene){return {error:'.svg not found'}} },
      '.file is required to start the universe': function(){ if(!this.file){return {error:'file url required'}} },
    }
  }



  initialize() {

    this.on('name', v=> {
      if(v) document.querySelector('title').innerText = v;
    });

    this.on('file', async v=> {
    });

    this.on("concepts.created", (node) => {

      const Ui = this.types.find(o=>o.name==node.type); // concept as in conceptmap is a component as it is a GUI thing.
      if(!Ui) throw new Error(`Unrecongnized type "${node.type}"`);
      console.log(`%cCreate UI component (${node.type}) based on data node ${node.id}`, 'background: hsl(0, 50%, 60%); color: white;');

  		const ui = new Instance(Ui);
      this.ui.set(node.id, ui);
      ui.scene = this.scene; // remember parent sets the scene
      ui.data = node; // .............................................. -> Component.js / this.on("data", (data) => {...

      //
      // // component.container = this; // this may not be needed
      // ui.start()

    }, {replay:true});

    this.on("concepts.removed", ({id}) => {
      this.ui.get(id).stop();
      this.ui.delete(id);
    });

  } // initialize


  async started (){

    // const rehydrated = await rehydrator();

    const rehydrated = await (await fetch(this.file)).json();
    for (const raw of rehydrated.data) {
      raw.data = await (await fetch(raw.meta.url)).json();
    }
    for (const raw of rehydrated.data) {
      console.log(`%cCreate data node based on JSON data ${raw.meta.id}`, 'background: hsl(0, 50%, 50%); color: white;');
      const node =  new Instance(Node);
      Object.assign(node, raw.meta);
      node.data = raw.data;
      project.concepts.create( node ); // -> see project #onStart for creation.
    }
  }

  stopped(){
    for (const {id} of this.concepts) {
      this.ui.get(id).stop();
      this.ui.delete(id);
    } // for every tray
    // shut down all properties...
    this.dispose();
  }

}
