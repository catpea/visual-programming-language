import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Container from "/plug-ins/windows/Container.js";
import Control from "/plug-ins/windows/Control.js";
import Caption from "/plug-ins/windows/Caption.js";
import movable from "/plug-ins/movable/index.js";

export default class Window {

  static extends = [Container];

  methods = {

    initialize(){
      if(!this.oo) throw new Error("Window oo Not Found")
      console.log(`%cWindow.initialize!`, 'background: hsl(180, 70%, 60%); color: black;');
    },

    mount(){


      // ADD DRAGGABLE CAPTION
      let caption = new Instance(Caption);
      caption.scene = this.scene;
      caption.parent = this;
      caption.h = 24;
      this.children.create(caption);

      movable(this, {handle: caption});

      // ADD DRA-AND-DROP TOOLBAR
      let toolbar = new Instance(Control);
      toolbar.scene = this.scene;
      toolbar.parent = this;
      toolbar.h = 32;
      this.children.create(toolbar);

    },

    addWindowComponent(component){
      component.scene = this.scene;
      component.parent = this;
      this.children.create(component);
    },

    addToolbarComponent(component){
      component.scene = this.scene;
      component.parent = this;
      const toolbar = this.children.find(child=>child.oo.name==='Toolbar');
      toolbar.children.create(component);
    }

  };

  constraints = {

    // NOTE: TODO ITEM BELOW
    // TODO: add method constraints this will requre gathering all constraints from each chain item
    // addWindowComponent: {
    //   'object must be based on Component': function(v){
    //     console.log('YYY', v);
    //     // if(! Theme.prototype.isPrototypeOf(v) ) return {error:'must extend Theme'};
    //   }
    // }

  };

}
