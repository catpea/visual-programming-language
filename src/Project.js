import Properties from "/plug-ins/properties/Properties.js";
import Node from "/plug-ins/node/Node.js";

import {Instance} from "/plug-ins/object-oriented-programming/index.js";


import Keyboard from "/plug-ins/keyboard/index.js";
import Pan from "/plug-ins/pan/index.js";
import Zoom from "/plug-ins/zoom/index.js";

import {svg} from "/plug-ins/domek/index.js";

// Begin UI

// User
import ColorPicker from "/plug-ins/applications/ColorPicker.js";
import ThemeBuilder from "/plug-ins/applications/ThemeBuilder.js";
import VisualProgram from "/plug-ins/applications/VisualProgram.js";
import CodeEditor from "/plug-ins/applications/CodeEditor.js";
import Junction from "/plug-ins/windows/Junction.js";
import Line from "/plug-ins/windows/Line.js";
import RemoteApplication from "/plug-ins/applications/RemoteApplication.js";

// Developer
import ElementDebugger from "/plug-ins/developer/ElementDebugger.js";
import ApplicationDebugger from "/plug-ins/developer/ApplicationDebugger.js";
import AnchorDebugger from "/plug-ins/developer/AnchorDebugger.js";
import PipeDebugger from "/plug-ins/developer/PipeDebugger.js";

// End UI

function intersection(a,b){
  const response = new Set();
  for (const item of a) {
    if(b.has(item)) response.add(item)
  }
  return response;
}
function difference(a,b){
  const response = new Set();
  for (const item of a) {
    if(!b.has(item)) response.add(item)
  }
  return response;
}

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
    types: [
      ColorPicker, ThemeBuilder, VisualProgram, Junction, Line, RemoteApplication, CodeEditor,
      ElementDebugger, ApplicationDebugger, AnchorDebugger, PipeDebugger,
    ], // What can the project instantiate?


  };

  observables = {

    svg: undefined,
    scene: undefined,
    background: undefined,
    file: undefined,
    name: "Bork",

    archetypes: [],

    // PRIMARY DATA, note Line component represents edges, these must come second, forst take care of non-Line, then Line
    elements: [], // use instead of old .nodes

    // SECONDATY LOOKUP DATA - registry for fast lookup purposes
    applications: [], // NOTE: root windowID

    anchors: [], // NOTE: format is portName:rootID (not component id, but the root window)
    pipes: [],
    //



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

    this.on("elements.created", (node) => {

      const Ui = this.types.find(o=>o.name==node.type); // concept as in conceptmap is a component as it is a GUI thing.
      // if(!Ui) throw new Error(`Unrecongnized type "${node.type}"`);
      if(!Ui) {
        console.warn(`Skipped Unrecongnized Component Type "${node.type}"`);
        return;
      }

      const g = svg.g({id:node.id, class:'component'});
      this.scene.appendChild(g)

      //NOTE: do not set ui.parent here, a project is not a parent of a window.
  		const ui = new Instance(Ui, {id:node.id, node, scene:g});
      this.applications.create(ui);
      ui.start()

    }, {replay:true});

    this.on("elements.removed", ({id}) => {
      this.applications.get(id).stop();
      this.applications.get(id).destroy();
      this.applications.remove(id);
    });

  }, // initialize

  pipe(sourceId, targetId){

    if(!sourceId) throw new Error('sourceId is required');
    if(!targetId) throw new Error('targetId is required');
    const source = this.pipes.get(sourceId);
    const target = this.pipes.get(targetId);
    source.on('data', (data)=>target.emit('data', data));
  },

  create({meta, data}){
    const node = new Instance(Node, {...meta, data});
    this.elements.create(node);
  },

  remove(id){
    const node = this.nodes.get(id);
    project.elements.remove( node );
    node.stop();
    node.destroy();
  },

  removeSelected(){
    for (const application of this.applications) {
      if(application.selected){
        this.remove(id);
      }
    }
  },

  async mount (){

    // features that need to be installed after DOM nodes are created
    // pan(this);
    const keyboard = new Keyboard({
      component: this,
      handle: window, // set to caption above to react to window captions only
    }); this.destructable = ()=>keyboard.destroy()

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

      const node = new Instance(Node);
      const nodeKeys = new Set([...Object.keys(node.oo.specification.properties), ...Object.keys(node.oo.specification.observables)]);
      const metaKeys = new Set([...Object.keys(meta)]);
      const commonProperties = intersection(nodeKeys, metaKeys);
      const newProperties = difference(metaKeys, commonProperties);
      for (const newProperty of newProperties) {
        node.oo.addObservable(newProperty, meta[newProperty])
      }
      Object.assign(node, meta, {data})

      // this is where all nodes and edges are kept, simple reactive array
      project.elements.create( node ); // -> see project #onStart for creation.



    }

  },

  async save(filename="project.json", meta={}){
    const packageJson = await (await fetch('package.json')).json();
    const {version:compatibility } = packageJson;
    let objects = {
      meta: Object.assign(this.meta, meta, {compatibility }),
      data:[],
    }
    for (const concept of project.elements) {
      const object = concept.toObject();
      objects.data.push( object );
    }
    const str = JSON.stringify(objects, null, 2);
    console.log(str);
  },

  destroy(){
    for (const {id} of this.elements) {
      this.applications.get(id).stop();
      this.applications.remove(id);
    } // for every tray
    // shut down all properties...
    this.dispose();
  },

  }

}
