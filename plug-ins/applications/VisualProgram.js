import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import VisualEditor from "/plug-ins/visual-editor/VisualEditor.js";
import Control from "/plug-ins/windows/Control.js";

export default class VisualProgram {

  static extends = [Window];

  methods = {

    initialize(){
      if(!this.oo) throw new Error("VisualProgram oo Not Found")
      console.log(`%cVisualProgram.initialize!`, 'background: hsl(180, 70%, 60%); color: black;');
      // setInterval(x=>{
      //   this.data.x = this.data.x + this.getRandomIntInclusive(-1,1);
      //   this.data.y = this.data.y + this.getRandomIntInclusive(-1,1);
      //
      //   // console.log(  this.data.x);
      // }, 1_000/22);
    },

    mount(){

      const editor = new Instance(VisualEditor);
      this.add(editor); // Add Visual Editor To The Window

      // setInterval(x=>{
      //   editor.h = editor.h + this.getRandomIntInclusive(-3,3);
      //   if(editor.h<0)editor.h=100
      // }, 1_000/60);


    },

  }

}
