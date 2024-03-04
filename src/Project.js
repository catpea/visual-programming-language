import Properties from "/plug-ins/properties/Properties.js";
import Node from "/plug-ins/node/Node.js";

import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Pan from "/plug-ins/pan/index.js";
import Zoom from "/plug-ins/zoom/index.js";

import {svg} from "/plug-ins/domek/index.js";

import VisualProgram from "/plug-ins/applications/VisualProgram.js";
import CodeEditor from "/plug-ins/applications/CodeEditor.js";
import Junction from "/plug-ins/windows/Junction.js";
import Line from "/plug-ins/windows/Line.js";
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
    meta: {},
    types: [ VisualProgram, Junction, Line, RemoteApplication, CodeEditor ], // What can the project instantiate?
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

      const g = svg.g({id:node.id, class:'component'});
      this.scene.appendChild(g)

      //NOTE: do not set ui.parent here, a project is not a parent of a window.
  		const ui = new Instance(Ui, {node, scene:g});
      this.ui.set(node.id, ui);
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
    // for (const raw of rehydrated.data) {
    //   if(raw.meta.url) raw.data = await (await fetch(raw.meta.url)).json();
    // }
    this.meta = rehydrated.meta;
    for (const {meta, data} of rehydrated.data) {
      const node = new Instance(Node, {...meta, data});
      project.concepts.create( node ); // -> see project #onStart for creation.
    }

  },

  async save(filename="project.json", meta={}){
    const packageJson = await (await fetch('package.json')).json();
    const {version:compatibility } = packageJson;
    let objects = {
      meta: Object.assign(this.meta, meta, {compatibility }),
      data:[],
    }
    for (const concept of project.concepts) {
      const object = concept.toObject();
      objects.data.push( object );
    }
    const str = JSON.stringify(objects, null, 2);
    console.log(str);
  },

  destroy(){
    for (const {id} of this.concepts) {
      this.ui.get(id).stop();
      this.ui.delete(id);
    } // for every tray
    // shut down all properties...
    this.dispose();
  },

  }

}
