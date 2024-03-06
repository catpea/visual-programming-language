import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import CodeMirror from "/plug-ins/codemirror/index.js";

export default class CodeEditor {

  static extends = [Window];

  methods = {

    initialize(){
    },

    mount(){
      const codeMirror = new Instance(CodeMirror);
      this.createWindowComponent( codeMirror ); // Add Visual Editor To The Window

    },

  };


}
