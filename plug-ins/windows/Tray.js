import Properties from "#plug-ins/properties/Properties.js";
import Container from "#plug-ins/windows/Container.js";
import Control from "#plug-ins/windows/Control.js";

import { svg, update } from "domek";


export default class Tray extends Container {

  extends = [Container];

  constructor(...a) {

    // oop(this);

    super(...a);

    let caption = new Control();
    this.children.create(caption);

    let toolbar = new Control();
    this.children.create(toolbar);

    toolbar.h = 16; // forces redraw

  }




}
