import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import Control from "/plug-ins/windows/Control.js";
import Frame from "/plug-ins/windows/Frame.js";

export default class RemoteApplication {

  static extends = [Window];

  methods = {

    initialize(){
      if(!this.oo) throw new Error("VisualProgram oo Not Found")
    },

    mount(){
      const frame = new Instance(Frame);
      this.createWindowComponent(frame); // Add Visual Editor To The Window

      // once data is set, listen on src, and pass it to frame.
      this.on("node", (node) => {
        node.on("src", src => frame.src = src);
        node.on("h", h => frame.h = h);
        node.on("w", w => frame.w = w);
      });

    },

  }

}
