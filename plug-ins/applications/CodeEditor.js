import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import CodeMirror from "/plug-ins/codemirror/index.js";

export default class CodeEditor {

  static extends = [Window];

  methods = {

    initialize(){
      this.w = 800;
      this.h = 600;
    },

    mount(){
      const codeMirror = new Instance(CodeMirror);
      this.createWindowComponent( codeMirror ); // Add Visual Editor To The Window

      const id = ['input', this.id].join(':');
      const input = globalThis.project.pipes.get(id);
      input.on('data', (data)=>{
        codeMirror.doc = JSON.stringify(data, null, 2);
      })

    },

  };


}
