import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import Horizontal from "/plug-ins/windows/Horizontal.js";
import Label from "/plug-ins/windows/Label.js";

export default class ZoomPanDebugger {

  static extends = [Window];

  observables = {
    text: '',
  };

  methods = {

    initialize(){
      this.w = 400;
      this.h = 600;
    },

    mount(){

      const horizontal = new Instance(Horizontal);
      this.createWindowComponent( horizontal );

      const info1 = new Instance(Label, {h: 32, text: 'Hello'});
      info1.parent = this;
      horizontal.children.create(info1);
      globalThis.project.any(['panX','panY'], ({panX, panY})=>info1.text=`${panX}x${panY}`  )


      const info2 = new Instance(Label, {h: 32, text: 'World'});
      info2.parent = this;
      horizontal.children.create(info2);
      globalThis.project.on('zoom', zoom=>info2.text=`@${zoom}`  )




      const displayText = new Instance(Label, {h: 32, text: this.text});
      this.createWindowComponent( displayText );

      globalThis.project.any(['panX','panY', 'zoom'], ({panX, panY, zoom})=>this.text=`Pan & Zoom\n ${panX}x${panY} @${zoom}`  )
      this.on('text', text=>displayText.text=text)

      // globalThis.project.on('panX', panX=>{} )
      // globalThis.project.on('panY', panY=>{} )
      // globalThis.project.on('zoom', zoom=>{} )
      //
      // globalThis.project.on("pipes.created", (node) => {
      // }, {replay:true});
      //
      // globalThis.project.on("pipes.removed", ({id}) => {
      //   this.removeWindowComponent(id);
      // });




      this.pipe('input').on('data', (data)=>{
        codeMirror.doc = data.doc;
      })

    },

  };


}
