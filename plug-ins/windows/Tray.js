import Properties from "#plug-ins/properties/Properties.js";
import Container from "#plug-ins/windows/Container.js";
import Control from "#plug-ins/windows/Control.js";

import { svg, update } from "domek";


export default class Tray extends Container {

  constructor(...a) {
    console.log('CREATING TRAY');
    super(...a);

    let caption = new Control();
    this.children.create(caption);

    let toolbar = new Control();
    this.children.create(toolbar);

    // toolbar.h = 16; // forces redraw
    console.log('TRAY CREATED');

  }




}
