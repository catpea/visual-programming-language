import { svg, update } from "domek";
const uuid = bundle['uuid'];

import Node from "/plug-ins/node/Node.js";
import {Instance} from "/plug-ins/object-oriented-programming/index.js";

export class Compatibility {}

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
        class: 'editor-anchor-line',
        style: {
          'pointer-events': 'none' /* required, otherwise the line will mousedrop on it self */
        },
        'vector-effect': 'non-scaling-stroke',

      });

      this.anchor.scene.appendChild(this.line);

      // Remember where mouse touched down
      this.startX = e.clientX;
      this.startY = e.clientY;

      // Sync line with cursor
      // this.startX = this.anchor.x;
      // this.startY = this.anchor.y;

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



      this.geometry = {
        // origin of th eindicator line is the port
        x1: this.anchor.x,
        y1: this.anchor.y,
        // target of the indicator line is where the cursor is dragging
        x2: dx,
        y2: dy,
      };

      update(this.line, this.geometry);

      // End
      dx = 0;
      dy = 0;

     };

    this.mouseUpHandler = (e) => {

      if (e.target == this.anchor) {
        console.log('SELF');
      }

      const isOverAnotherPort = this.dragging && e.target && e.target.classList.contains('editor-anchor');
			const isOverBackground = this.dragging && e.target && e.target.classList.contains('editor-background');


      if(isOverAnotherPort){
        const source = this.anchor.oo.name==='Anchor'?[this.anchor.name, this.anchor.root().node.id].join(':'):this.anchor.id;
        const target = e.target.dataset.target;
        if(source != target){
          globalThis.project.create({ meta: { id: uuid(), type: "Line", source, target }, data: {} });
          globalThis.project.pipe( source, target );

        }
      }

      if(isOverBackground){
        const junctionId = uuid();
        globalThis.project.create({ meta: { id: junctionId, type: "Junction", x: this.geometry.x2, y: this.geometry.y2, }, data: {} });
        const source = this.anchor.oo.name==='Anchor'?[this.anchor.name, this.anchor.root().node.id].join(':'):this.anchor.id;
        const target = junctionId;
        globalThis.project.create({ meta: { id: uuid(), type: "Line", source, target }, data: {} });
        globalThis.project.pipe( source, target );
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
