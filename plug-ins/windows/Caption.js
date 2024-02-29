import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import Anchor from "/plug-ins/windows/Anchor.js";

import Control from "/plug-ins/windows/Control.js";
import { svg, html, update } from "domek";

export default class Caption {

  static extends = [Control];


  constraints = {
    mount: {
      '.scene is required to start the universe': function(){ if(!this.scene){return {error:'.svg not found'}} },
    }
  }

  methods = {

    initialize(){
      console.log(`%cControl.initialize!`, 'background: hsl(180, 80%, 60%); color: black;', this);
    },

    mount(){
      this.anchors.create(new Instance(Anchor, { scene: this.scene, side: 0 }))
      this.anchors.create(new Instance(Anchor, { scene: this.scene, side: 1 }))
    },

  }

}
