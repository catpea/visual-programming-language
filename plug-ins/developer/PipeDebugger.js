import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import Label from "/plug-ins/windows/Label.js";

export default class PipeDebugger {

  static extends = [Window];

  methods = {

    initialize(){
      this.w = 400;
      this.h = 600;
    },

    mount(){

      globalThis.project.on("pipes.created", (node) => {
        this.createWindowComponent( new Instance(Label, {h: 32, text: `Pipe: ${node.id}... | ${node.direction}`}) );
      }, {replay:true});

      globalThis.project.on("pipes.removed", ({id}) => {
        this.removeWindowComponent(id);
      });




      this.pipe('input').on('data', (data)=>{
        codeMirror.doc = data.doc;
      })

    },

  };


}
