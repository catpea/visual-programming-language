import { v4 as uuid } from "uuid";

import { svg, html, mouse, click, update, text, clip, front } from "domek";

import Output from '#nodes/Output.js';
import Midjourney from '#nodes/Midjourney.js';
import Text from '#nodes/Text.js';
import Message from '#nodes/Message.js';
import Nostromo from '#themes/nostromo/index.js';
import Obsidian from '#themes/obsidian/index.js';

// import Canvas from './application/view/Canvas.js';


import Application from "./Application.js";
import Canvas from "./Canvas.js";
import Container from "./Container.js";
import { ManualLayout } from "./Layout.js";

export default class Workspace extends Container {

	constructor(jsonPath, ...arg) {
		super(...arg);
		this.layout = new ManualLayout(); // NOTE: a layout applies to children only, this will not set xywh of the root component

		// PART ONE
		this.application = new Application();
		this.application.start();

		this.application.Archetypes.create({id:'Output', class:Output});
		this.application.Archetypes.create({id:'Text', class:Text});
		this.application.Archetypes.create({id:'Midjourney', class:Midjourney});
		this.application.Archetypes.create({id:'Message', class:Message});

		this.application.Themes.create({}, {entity:Nostromo});
		this.application.Themes.create({}, {entity:Obsidian});
		this.application.Themes.select('nostromo');

	}

  createElements() {
    super.createElements();

		this.el.ClipPath = svg.clipPath({ id:uuid(), class: `clip-path`});
		this.el.Scene = svg.g();
		this.innerScene = svg.g();

		console.log('Add this.innerScene panning and zooming, and FULL-SCREEN');
		// this.innerScene needs panning
		// this.innerScene needs zooming

		this.el.Scene.appendChild(this.innerScene);

			this. clipRect = svg.rect({ class: `clip-rect`, stroke:'black', fill:'black', ...this.b});
			this.el.ClipPath.appendChild(this.clipRect);

		this.el.Maximize = svg.path( { class: `workspace-icon`, stroke: 'green',  style:`transform:translateX(${this.x + 10}px) translateY(${this.y + 10}px);`, d:`M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5` } );

		update(this.el.Scene, { 'clip-path': `url(#${this.el.ClipPath.id})` })

		// PART TWO
		// this.app.installScene();
    // this.app.installKeyboardShortcuts();
    // this.app.installPanZoom();

		this.application.Views.create({ id:'id-of-port', scene: this.innerScene }, {entity:Canvas});

		this.createSomeGraph(this.application.Api)

	}

  updateElements() {
    super.updateElements();

		this.monitor('x','y','w', (k,v)=>update(this.el.Maximize,{ style:`transform:translateX(${this.w - 10 - 16}px) translateY(${this.y + 10}px);` }));
		this.monitor('x','y','w', (k,v)=>update(this.innerScene, { style:`transform: translateX(${this.x}px) translateY(${this.y}px) scale(.3) ;` }));



		// this.monitor('x','y','w','h', (k,v)=>update(this.clipRect,{[k]:v}));
		// this.monitor('b', v=>update(this.clipRect,{...v}));
		this.monitor('b', x=>update(this.clipRect, {...this.b} ));

		// this.monitor('x','y','w','h', (k,v)=>update(this.el.TestClip,{[k]:v}));
		// this.monitor('x','y', (k,v)=>update(this.el.TestClip,{[k]:v}))
		// this.monitor('w','h', (k,v)=>update(this.el.TestClip,{[k]:v-10}));

		// PART THREE
		// this.app.connectables.observe('created', v=>this.displayConnectable(v), {autorun: false})
    // this.app.connectables.observe('removed', v=>this.disposeConnectable(v), {autorun: false})
    // this.app.connections.observe('created', v=>this.displayConnection(v), {autorun: false})
    // this.app.connections.observe('removed', v=>this.disposeConnection(v), {autorun: false})

  }





	createSomeGraph(api){

	  const somePrompt = new Text();
	  somePrompt.id = 'somePrompt';
	  somePrompt.text = `Feminine. Cinematic shot, photoshoot, wideshot, epic.`;
	  somePrompt.x = 30;
	  somePrompt.y = 10;

	  const highresPrompt1 = new Text();
	  highresPrompt1.id = 'highresPrompt1';
	  highresPrompt1.text = `By Enki Bilal with playlet transparent scaling elements, gold rivets, underneath we find strong zenith illumination from the right side of the shot j. scott campbell, rainbow silvertone, solarizing master, enamel, elfriede lohse-wächtler`;
	  highresPrompt1.x = 30;
	  highresPrompt1.y = 200;

	  const highresPrompt2 = new Text();
	  highresPrompt2.id = 'highresPrompt2';
	  highresPrompt2.text = `Vivid skin texture, glowing eyes and long strait pastel lite-white-pink hair, subtle nuances , white face paint, red lipstick, beam of sunlight, chiaroscuro shadows, in the style of detailed hyperrealism photoshoot, mouth slightly open, pouting her lips, cf`;
	  highresPrompt2.x = 30;
	  highresPrompt2.y = 400;

	  const highresPrompt3 = new Text();
	  highresPrompt3.id = 'highresPrompt3';
	  highresPrompt3.text = `Esoteric coded overlays.`;
	  highresPrompt3.x = 30;
	  highresPrompt3.y = 600;

	  const midjourneyPrompt = new Midjourney();
	  midjourneyPrompt.id = 'midjourneyPrompt';
	  midjourneyPrompt.x = 400;
	  midjourneyPrompt.y = 100;

	  const outputNode = new Output();
	  outputNode.id = 'outputNode';
	  outputNode.x = 700;
	  outputNode.y = 100;

	  const msg1 = new Message();
	  msg1.id = 'msg1';
	  msg1.radius = 0;
	  msg1.x = 0;
	  msg1.y = 0;
	  msg1.w = 360;
	  msg1.h = 666;

	  // setup relationships ---------------------------------------------------------------------------------------------------------------

	  api.add(somePrompt);
	  api.add(highresPrompt1);
	  api.add(highresPrompt2);
	  api.add(highresPrompt3);
	  api.add(midjourneyPrompt);
	  api.add(msg1);

	  api.add(outputNode);

	  api.connect(somePrompt.id, 'output',         midjourneyPrompt.id, 'prompt');
	  api.connect(highresPrompt1.id, 'output',     midjourneyPrompt.id, 'style');
	  const thirdPromptConnection = api.connect(highresPrompt2.id, 'emphasis',   midjourneyPrompt.id, 'style');
	  thirdPromptConnection.enabled = false;
	  api.connect(midjourneyPrompt.id, 'output',   outputNode.id, 'input');

	  // execute your program -------------------------------------------------------------------------------------------------------------
	  // const result = await api.run(outputNode.id);
	  // console.log('usage.js api.execute said: ', result);



	}



}
