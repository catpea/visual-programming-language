import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Container from "/plug-ins/windows/Container.js";
import Control from "/plug-ins/windows/Control.js";
import Caption from "/plug-ins/windows/Caption.js";

export default class Window {

  static extends = [Container];

  // methods = {
  //   initialize: true,
  // };

  methods = {

    initialize(){
      if(!this.oo) throw new Error("Window oo Not Found")
      console.log(`%cWindow.initialize!`, 'background: hsl(180, 70%, 60%); color: black;');
    },

    mount(){

      // ADD DRAGGABLE CAPTION
      let caption = new Instance(Caption);
      caption.scene = this.scene;
      caption.h = 24;
      this.children.create(caption);

      // ADD DRA-AND-DROP TOOLBAR
      let toolbar = new Instance(Control);
      toolbar.scene = this.scene;
      toolbar.h = 32;
      this.children.create(toolbar);

    },

    add(component){
      component.scene = this.scene;
      this.children.create(component);
    }

  }

}
