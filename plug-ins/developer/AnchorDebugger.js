import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import Label from "/plug-ins/windows/Label.js";

export default class AnchorDebugger {

  static extends = [Window];

  methods = {

    initialize(){
      this.w = 400;
      this.h = 600;
    },

    mount(){

      globalThis.project.on("anchors.created", (anchor) => {
        // this.createWindowComponent( new Instance(Label, {h: 32, text: `${node.oo.name}: ${node.id.substr(0,8)}... ${node.type}`}) );

        const deviceInfo = new Instance(Label, {h: 32, text: `${anchor.oo.name}: ${anchor.id}... ${anchor.type}`});
        this.createWindowComponent( deviceInfo );
        anchor.on('selected', selected=>deviceInfo.selected=selected)

      }, {replay:true});

      globalThis.project.on("anchors.removed", ({id}) => {
        this.removeWindowComponent(id);
      });




      this.pipe('input').on('data', (data)=>{
        codeMirror.doc = data.doc;
      })

    },

  };


}
