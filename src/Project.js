import Properties from "/plug-ins/properties/Properties.js";
import Node from "/plug-ins/node/Node.js";

import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Pan from "/plug-ins/pan/index.js";
import Zoom from "/plug-ins/zoom/index.js";

import {log, error, warn, info, debug, seq} from "/plug-ins/log/index.js";

import VisualProgram from "/plug-ins/applications/VisualProgram.js";
import Junction from "/plug-ins/windows/Junction.js";
import RemoteApplication from "/plug-ins/applications/RemoteApplication.js";

export default class Project {

  // extends = [];

  state = {
    current: 'initial',

    initial: {
       run: 'initialize',
       can: 'start'
     },

     start: {
       run: 'mount',
       can: 'stop'
     },

     stop: {
       run: ['destroy'],
       can: 'start'
     },

  };

  properties = {
    types: [ VisualProgram, Junction, RemoteApplication ], // What can the project instantiate?
    ui: new Map(), // track all the ui
  };

  observables = {

    svg: undefined,
    scene: undefined,
    background: undefined,
    file: undefined,
    name: "Bork",

    archetypes: [],
    concepts: [],
    transports: [],

    panX: 0,
    panY: 0,
    zoom: 1,
    iframe: true, // controls if iframe content is visible, iframes interefere with dragging

  };

  constraints = {
    started: {
      '.svg is required to start the universe': function(){ if(!this.svg){return {error:'.svg not found'}} },
      '.scene is required to start the universe': function(){ if(!this.scene){return {error:'.scene not found'}} },
      '.background is required to start the universe': function(){ if(!this.background){return {error:'.background not found'}} },
      '.file is required to start the universe': function(){ if(!this.file){return {error:'file url required'}} },
    }
  }


methods = {

  initialize() {

    this.on('zoom', v=> requestAnimationFrame(() => { this.scene.style.scale = this.zoom }));
    this.on('panX', v=> requestAnimationFrame(() => { this.scene.style.transform = `translate(${this.panX/this.zoom}px, ${this.panY/this.zoom}px)` }));
    this.on('panY', v=> requestAnimationFrame(() => { this.scene.style.transform = `translate(${this.panX/this.zoom}px, ${this.panY/this.zoom}px)` }));

    this.on('name', v=> {
      if(v) document.querySelector('title').innerText = v;
    });

    this.on('file', async v=> {
    });

    this.on("concepts.created", (node) => {

      const Ui = this.types.find(o=>o.name==node.type); // concept as in conceptmap is a component as it is a GUI thing.
      // if(!Ui) throw new Error(`Unrecongnized type "${node.type}"`);
      if(!Ui) {
        console.warn(`Skipped Unrecongnized Component Type "${node.type}"`);
        return;
      }
      // console.log(`%cCreate UI component (${node.type}) based on data node ${node.id}`, 'background: hsl(0, 50%, 60%); color: white;');

  		const ui = new Instance(Ui);
      this.ui.set(node.id, ui);
      ui.scene = this.scene; // remember parent sets the scene
      ui.project = this.project; // remember parent sets the scene
      // console.log('ui.scene = this.scene',  this.scene);
      ui.data = node; // .............................................. -> Component.js / this.on("data", (data) => {...

      //
      // // component.container = this; // this may not be needed
      ui.start()

    }, {replay:true});

    this.on("concepts.removed", ({id}) => {
      this.ui.get(id).stop();
      this.ui.delete(id);
    });

  }, // initialize



  async mount (){

    // features that need to be installed after DOM nodes are created
    // pan(this);

    const zoom = new Zoom({
      component: this,
      element: this.scene,
      zone: this.background,
    }); this.destructable = ()=>zoom.destroy()

    const pan = new Pan({
      component: this,
      handle: this.background,
      zone: window,
    }); this.destructable = ()=>pan.destroy()



    // TODO: simplify code below with a rehydrator
    // const rehydrated = await rehydrator();

    const rehydrated = await (await fetch(this.file)).json();
    for (const raw of rehydrated.data) {
      if(raw.meta.url) raw.data = await (await fetch(raw.meta.url)).json();
    }
    for (const raw of rehydrated.data) {
      // console.log(`%cCreate data node based on JSON data ${raw.meta.id}`, 'background: hsl(0, 50%, 50%); color: white;');
      const node =  new Instance(Node);

      Object.assign(node, raw.meta);
      // console.log(node);

      node.data = raw.data;
      project.concepts.create( node ); // -> see project #onStart for creation.
    }
  },

  destroy(){
    for (const {id} of this.concepts) {
      this.ui.get(id).stop();
      this.ui.delete(id);
    } // for every tray
    // shut down all properties...
    this.dispose();
  }
  }

}
