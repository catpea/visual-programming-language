import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import DeviceInfo from "/plug-ins/developer/controls/DeviceInfo.js";

export default class ApplicationDebugger {

  static extends = [Window];

  methods = {

    initialize(){
      this.w = 400;
      this.h = 600;
    },

    mount(){
      //
      // globalThis.project.on('applications.created', concept=>{
      //   // for (const [id, application] of globalThis.project.applications) {
      //     this.createWindowComponent( new Instance(DeviceInfo, {h: 32, caption: `${application.oo.name}: ${application.id.substr(0,8)}... ${application.type}`}) );
      //   // }
      // })


      globalThis.project.on("applications.created", (node) => {
        this.createWindowComponent( new Instance(DeviceInfo, {h: 32, caption: `${node.oo.name}: ${node.id.substr(0,8)}... ${node.type}`}) );
      }, {replay:true});

      globalThis.project.on("applications.removed", ({id}) => {
        this.removeWindowComponent(id);
      });


      this.pipe('input').on('data', (data)=>{
        codeMirror.doc = data.doc;
      })

    },

  };


}
