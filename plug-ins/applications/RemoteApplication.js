import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import Control from "/plug-ins/windows/Control.js";
import Frame from "/plug-ins/windows/Frame.js";

export default class RemoteApplication {

  static extends = [Window];

  methods = {

    initialize(){
      if(!this.oo) throw new Error("VisualProgram oo Not Found")
      //console.log(`%cVisualProgram.initialize!`, 'background: hsl(180, 70%, 60%); color: black;');
      // setInterval(x=>{
      //   this.data.x = this.data.x + this.getRandomIntInclusive(-1,1);
      //   this.data.y = this.data.y + this.getRandomIntInclusive(-1,1);
      //   this.data.h = this.data.h + this.getRandomIntInclusive(-1,1);
      //   // console.log(  this.data.x);
      // }, 1_000/22);
    },

    mount(){
      const frame = new Instance(Frame);
      this.addWindowComponent(frame); // Add Visual Editor To The Window

      // once data is set, listen on src, and pass it to frame.
      this.on("data", (data) => {
        data.on("src", src => frame.src = src);
        data.on("h", h => frame.h = h);
        data.on("w", w => frame.w = w);
      });

    },

  }

}
