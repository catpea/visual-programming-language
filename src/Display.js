import oneOf from "oneof";
import { html, svg, text, list, update } from "domek";

import Widget from './Widget.js'; //TODO: Rename base to Renderer
import Window from "./Window.js";

export default class Display extends Widget {

  start({item, view}){

    const window1 = new Window(item.type, {_hMin:500, radius:4, gap:1});
    window1.data = item; // data will now be available under .root.data
    window1.view = view;
    view.add( window1 ); // adds the .g to the svg and .start()s the component


  }

}
