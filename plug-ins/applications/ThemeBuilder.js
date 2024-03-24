import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import Control from "/plug-ins/windows/Control.js";

export default class ThemeBuilder {

  static extends = [Window];

  methods = {

    initialize(){
      this.w = 200;
    },

    mount(){
    

      const themeColors = new Instance(ThemeColors);
      this.createWindowComponent( themeColors ); // Add Visual Editor To The Window
    },


  };


}

class ThemeColors {

  static extends = [Control];

  properties = {
    colors: [ 'primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark' ],
  };

  methods = {

    initialize(){
      this.w = 200;
      this.h = 400;
      this.H = 400;
    },

    mount(){

      for (const color of this.colors) {
        this.createControlAnchor({ name: color, side: 0 });
      }

      for (const color of this.colors) {
        this.oo.createObservable(color, 'magenta')
      }

      for (const color of this.colors) {
        this.pipe(color).on('data', (data)=> document.documentElement.style.setProperty(`--editor-${color}`, data.color) )
        this.pipe(color).on('data', (data)=> this[color] = data.color )
      }

      this.any(this.colors, colors=>{
        let vars = [];
        for (const color of this.colors) {
          vars.push(`  --editor-${color}: ${this[color]};`);
        }
        const doc = `:root, [data-ui-theme=nostromo] {\n${vars.join('\n')}\n}\n`;
        this.pipe('output').emit('data', {format:'css', doc})
      })

    }, // end mount


  };


}
