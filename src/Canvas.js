import panzoom from "panzoom";
import calculatePercent from 'calculate-percent';
import { html, svg, text, list, update, keyboard, click } from "domek";
import { v4 as uuid } from "uuid";

import Item from './model/Item.js';

// import Node from './canvas/Node.js';
// import Junction from './canvas/Junction.js';
// import Connection from './canvas/Connection.js';

import Display from './Display.js';

export default class Canvas extends Item {

  id;

  application;
  element;

  svg;
  defs;
  scene;
  bg;

  maxZoom = 10;
  minZoom = 0.05;

  renderers = new Map();

  constructor(properties, application){
    super();

    this.id = properties.id;
    this.application = application;
    this.scene = properties.scene;

    const transform = {x:0, y:0, scale:1};
    this.inherit({transform});


    // this.installKeyboardShortcuts();
    // this.installPanZoom();
    this.installDataMonitor();
    // console.log('Canvas Configured');
  }



  installPanZoom(){
    this.panzoom = panzoom(this.scene, {
			smoothScroll: false, // this is the sluggish post  scrolling effect
			// transformOrigin: { x: 0.5, y: 0.5 },
			maxZoom: this.maxZoom,
			minZoom: this.minZoom,

			initialX: 0,
			initialY: 0,
			// initialZoom: .5,
			filterKey: function(/* e, dx, dy, dz */) {
				 // don't let panzoom handle this event:
				 return true;
			},


			beforeMouseDown: function(e) {

				const DENY = true;
				if(!e.target.classList.contains('interface-background')) return DENY;
				if(e.target.classList.contains('user-interface')) return DENY;

			}
		});
		this.panzoom.on('transform', (e) => {
			const { x, y, scale } = this.panzoom.getTransform();
			this.transform = { x, y, scale };
		});
		this.cleanup(()=>this.panzoom.dispose());
  }

  installDataMonitor(){
    this.application.Connectables.observe('created', v=>this.displayConnectable(v), {autorun: false})
    this.application.Connectables.observe('removed', v=>this.disposeConnectable(v), {autorun: false})

    this.application.Connections.observe('created', v=>this.displayConnection(v), {autorun: false})
    this.application.Connections.observe('removed', v=>this.disposeConnection(v), {autorun: false})
  }

	displayConnectable({ item }) {
    // const types = [Node, Junction,  Display]; //NOTE: multiple component classes are supported, and new ones should be added
    const types = [Display]; //NOTE: multiple component classes are supported, and new ones should be added
    const Component = types.find(o=>o.name==item.type);
    if(!Component) return;
		const connectable = new Component();
		this.renderers.set(item.id, connectable);
		connectable.start({ item, view: this });
	}
  disposeConnectable({ item }) {
		this.renderers.get(item.id).stop();
	}

	displayConnection({ item }) {
    // const types = [Connection]; //NOTE: multiple component classes are supported, and new ones should be added
    const types = []; //NOTE: multiple component classes are supported, and new ones should be added
    const Component = types.find(o=>o.name==item.type);
    if(!Component) return;
		const connectable = new Component();
		this.renderers.set(item.id, connectable);
		connectable.start({ item, view: this });
	}
  disposeConnection({ item }) {
		this.renderers.get(item.id).stop();
	}

  add(component){
    this.scene.appendChild( component.g );
    component.start();
  }


}
