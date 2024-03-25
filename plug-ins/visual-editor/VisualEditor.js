import { svg, update, click } from "/plug-ins/domek/index.js"
import {nest} from "/plug-ins/nest/index.js";

import Node from "/plug-ins/node/Node.js";
import {Instance} from "/plug-ins/object-oriented-programming/index.js";


import Container from "/plug-ins/windows/Container.js";
import Vertical from "/plug-ins/windows/Vertical.js";
import Horizontal from "/plug-ins/windows/Horizontal.js";

import Junction from "/plug-ins/windows/Junction.js";
import Line from "/plug-ins/windows/Line.js";

import Label from "/plug-ins/windows/Label.js";
import { RelativeLayout } from "/plug-ins/layout-manager/index.js";

const uuid = bundle['uuid'];

export default class VisualEditor {

  static extends = [Vertical];

  properties = {
    contain:true,
  };

  observables = {
    applications: [],
    elements: [],
    types: [ Junction, Line ],
  };

  methods = {

    initialize(){
      console.info('Line must detect the g it should be placed into');

      this.h = 400;
      this.subLayout = new RelativeLayout(this);


      this.on("elements.created", (node) => {
        const Ui = this.types.find(o=>o.name==node.type); // concept as in conceptmap is a component as it is a GUI thing.
        if(!Ui) return console.warn(`Skipped Unrecongnized Component Type "${node.type}"`);
        const ui = new Instance(Ui, {id:node.id, node, domain:this, scene:this.clipped  });
        this.applications.create(ui);
        ui.start()
        this.subLayout.manage(ui);
      }, {replay:true});

      this.on("elements.removed", ({id}) => {
        this.applications.get(id).stop();
        this.applications.get(id).destroy();
        this.applications.remove(id);
      });

    },

    mount(){

      this.clipped = svg.g();
      this.scene.appendChild(this.clipped)

      const [horizontal, [ addButton, delButton, vplCanvas ]] = nest(Horizontal, [
        [Label, {h: 32, W:32, text: 'Add', parent:this}, (c,p)=>p.children.create(c)],
        [Label, {h: 32, W:32, text: 'Del', parent:this}, (c,p)=>p.children.create(c)],
      ], (c)=>this.children.create(c))





      // [Container, {h: 600, parent:this}, (c,p)=>p.children.create(c)],
      this.realm = new Instance(Container, {h: 600, parent: this});
      // this.any(['x','y','w', 'h'], ({x,y,w:width,h:height})=>{
      //   Object.assign(zone, {x,y, width,height} );
      // })
      this.children.create( this.realm );


        this.el.ClipPath = svg.clipPath({
          id: `clip-path-${this.id}`,
        });
        const clipPathRect = svg.rect({
          x: this.parent.x,
          y: this.parent.y,
          width: this.parent.w,
          height: this.parent.h,
        });
        this.realm.any(['x','y','w', 'h'], ({x,y,w:width,h:height})=>{
          update(clipPathRect, {x,y,width,height} );
        })
        this.el.ClipPath.appendChild(clipPathRect);
        update(this.clipped, {'clip-path': `url(#clip-path-${this.id})`} );

        this.appendElements();



      this.disposable = click(addButton.handle, e=>{
        const id = uuid();
        const node = new Instance( Node, {id, type: "Junction", x: 50, y: 50, data:{}} );
        this.elements.create(node);
      })



    }
  }

}
