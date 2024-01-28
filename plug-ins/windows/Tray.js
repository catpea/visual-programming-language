import Properties from "#plug-ins/properties/Properties.js";
import Container from "#plug-ins/windows/Container.js";
import Control from "#plug-ins/windows/Control.js";

import { svg, update } from "domek";


export default class Tray extends Container {

  constructor(...a) {
    super(...a);


    let caption = new Control();
    let toolbar = new Control();
    this.children.create(caption)
    this.children.create(toolbar)

    // this.properties.observe("started", started=>this.#onStart({started}));


    toolbar.h = 16; // forces redraw


  }

  // #onStart({started}){
  //
  //   if(started){
  //
  //
  //   }else{
  //
  //   }
  //
  // }

}
