import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import VisualEditor from "/plug-ins/visual-editor/VisualEditor.js";

export default class VisualProgram {

  static extends = [Window];

  methods = {

    initialize(){
    },

    mount(){
      const editor = new Instance(VisualEditor);
      this.addWindowComponent( editor ); // Add Visual Editor To The Window
    },

  };


}
