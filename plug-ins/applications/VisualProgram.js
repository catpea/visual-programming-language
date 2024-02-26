import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Concept from "/plug-ins/windows/Concept.js";
import Control from "/plug-ins/windows/Control.js";

export default class VisualProgram {

  static extends = [Concept];

  // methods = {
  //   initialize: true,
  // };

  methods = {

    initialize(){
      if(!this.oo) throw new Error("VisualProgram oo Not Found")
      console.log(`%cVisualProgram.initialize!`, 'background: hsl(180, 70%, 60%); color: black;');

      // this.on('scene', ()=>{ })

      setInterval(x=>{
        this.data.x = this.data.x + this.getRandomIntInclusive(-1,1);
        this.data.y = this.data.y + this.getRandomIntInclusive(-1,1);
        // console.log(  this.data.x);
      }, 1_000/32);

    },

    mount(){

      // ADD DRAGGABLE CAPTION
      let caption = new Instance(Control);
      caption.scene = this.scene;
      caption.h = 24;
      this.children.create(caption);

      // ADD DRA-AND-DROP TOOLBAR
      let toolbar = new Instance(Control);
      toolbar.scene = this.scene;
      toolbar.h = 32;
      this.children.create(toolbar);

      // ADD VPL ZONE
      let visualEditor = new Instance(Control);
      visualEditor.scene = this.scene;
      visualEditor.h = 200;
      this.children.create(visualEditor);

    },

  }

}
