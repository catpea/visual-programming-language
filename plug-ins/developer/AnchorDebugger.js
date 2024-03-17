import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import DeviceInfo from "/plug-ins/developer/controls/DeviceInfo.js";

export default class AnchorDebugger {

  static extends = [Window];

  methods = {

    initialize(){
      this.w = 400;
      this.h = 600;
    },

    mount(){

      globalThis.project.on("anchors.created", (anchor) => {
        // this.createWindowComponent( new Instance(DeviceInfo, {h: 32, caption: `${node.oo.name}: ${node.id.substr(0,8)}... ${node.type}`}) );

        const deviceInfo = new Instance(DeviceInfo, {h: 32, caption: `${anchor.oo.name}: ${anchor.id}... ${anchor.type}`});
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
