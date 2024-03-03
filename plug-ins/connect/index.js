import { svg, update } from "domek";

import Node from "/plug-ins/node/Node.js";
import {Instance} from "/plug-ins/object-oriented-programming/index.js";

export default class Connect {

  anchor;
  zone;

  mouseDownHandler;
  mouseMoveHandler;
  mouseUpHandler;

  startX = 0;
  startY = 0;
  dragging = false;

  constructor({anchor, zone}){
    if(!anchor) throw new Error('anchor is required')
    if(!zone) throw new Error('zone is required')

    this.anchor = anchor;
    this.zone = zone;
    this.mount();
  }

  mount(){

    this.mouseDownHandler = (e) => {
      // Create line

      this.line = svg.line({
        class: 'cable-line-indicator line-ant-trail',
        'vector-effect': 'non-scaling-stroke',
      });

      this.anchor.scene.appendChild(this.line);

      // Remember where mouse touched down
      this.startX = e.clientX;
      this.startY = e.clientY;
      // Enable dragging
      this.dragging = true;
      globalThis.project.iframe = false;
      this.zone.addEventListener('mousemove', this.mouseMoveHandler);
    };

    this.mouseMoveHandler = (e) => {
      // if(this.scale == undefined) console.error('you must correctly configure scale',this.scale );
      // NOTE: this code has been tested and it works. //
      // Start from beginning, using "" to have dx available throughout
      let dx = 0;
      let dy = 0;
      // Substract initial position from current cursor position to get relative motion, motion relative to initial touchdown
      dx = e.clientX - this.startX;
      dy = e.clientY - this.startY;

      // Add a scaled version of the node
      dx = dx + (this.anchor.x * globalThis.project.zoom);
      dy = dy + (this.anchor.y * globalThis.project.zoom);

      //

      // // Apply Scale Transformation To Everything
      dx = dx / globalThis.project.zoom;
      dy = dy / globalThis.project.zoom;



      const geometry = {
        // origin of th eindicator line is the port
        x1: this.anchor.x,
        y1: this.anchor.y,
        // target of the indicator line is where the cursor is dragging
        x2: dx,
        y2: dy,
      };

      update(this.line, geometry);

      // End
      dx = 0;
      dy = 0;

     };

    this.mouseUpHandler = (e) => {

      const isOverAnotherPort = this.dragging && e.target && e.target.classList.contains('anchor-container');
			const isOverBackground = this.dragging && e.target && e.target.classList.contains('interface-background');

      if(isOverAnotherPort){
        const node =  new Instance(Node);
        node.id = uuid();
        node.type = 'Line',
        node.source = [this.anchor.name, this.anchor.root().data.id].join(':'),
        node.target = e.target.dataset.target;
        console.log(`%cCreate data node ${node.id}`, 'background: hsl(0, 50%, 50%); color: white;');
        globalThis.project.concepts.create( node ); // -> see project #onStart for creation.
      }

      if(this.line) this.line.remove();
      this.dragging = false;
      globalThis.project.iframe = true;
      this.zone.removeEventListener('mousemove', this.mouseMoveHandler);

    };

    this.anchor.pad.addEventListener('mousedown', this.mouseDownHandler);
    this.zone.addEventListener('mouseup', this.mouseUpHandler);

  }

  destroy(){

    this.anchor.pad.removeEventListener('mousedown', this.mouseDownHandler);
    this.zone.removeEventListener('mousemove', this.mouseMoveHandler);
    this.zone.removeEventListener('mouseup', this.mouseUpHandler);

  }

}
