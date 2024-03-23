import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import {nest} from "/plug-ins/nest/index.js";

import Window from "/plug-ins/windows/Window.js";
import Horizontal from "/plug-ins/windows/Horizontal.js";
import Label from "/plug-ins/windows/Label.js";


export default class ElementDebugger {

  static extends = [Window];

  methods = {

    initialize(){
      this.w = 400;
      this.h = 600;
    },

    mount(){

      globalThis.project.on("elements.created", (node) => {

        const [box, [ type, kind, id ]] = nest(Horizontal, {id: node.id}, [
          [Label, {h: 32, W:.1, text: node.oo.name, parent:this}, (chid, parent)=> parent.children.create(chid)],
          [Label, {h: 32,  text: node.type, parent:this}, (chid, parent)=> parent.children.create(chid)],
          [Label, {h: 32, W:.5,  text: node.id, parent:this}, (chid, parent)=> parent.children.create(chid)]
        ], (c)=>this.createWindowComponent(c))

      }, {replay:true});

      globalThis.project.on("elements.removed", ({id}) => {
        this.removeWindowComponent(id);
      });




      this.pipe('input').on('data', (data)=>{
        codeMirror.doc = data.doc;
      })

    },

  };


}
