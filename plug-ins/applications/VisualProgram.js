import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import VisualEditor from "/plug-ins/visual-editor/VisualEditor.js";

export default class VisualProgram {

  static extends = [Window];

  methods = {

    initialize(){
    },

    mount(){
      const editor = new Instance(VisualEditor, {node:{id:uuid()}});
      this.createWindowComponent( editor ); // Add Visual Editor To The Window
    },

    stop(){
      console.log('Stopping...');
    },
    destroy(){
      console.log('Destroying...');
      console.log('Destroying... EL');
      console.log('Destroying... CHILDREN');
      console.log('Destroying... ANCHOR CONNECTIONS');
      console.log('Destroying... ANCHORS');
      this.dispose()
    },

  };


}
