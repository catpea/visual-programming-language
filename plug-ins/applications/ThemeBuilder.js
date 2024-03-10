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

  methods = {

    initialize(){
      this.w = 200;
      this.h = 400;
      this.H = 400;
    },

    mount(){

      this.createControlAnchor({ name: 'primary', side: 0 });
      this.createControlAnchor({ name: 'secondary', side: 0 });
      this.createControlAnchor({ name: 'success', side: 0 });
      this.createControlAnchor({ name: 'info', side: 0 });
      this.createControlAnchor({ name: 'warning', side: 0 });
      this.createControlAnchor({ name: 'danger', side: 0 });
      this.createControlAnchor({ name: 'light', side: 0 });
      this.createControlAnchor({ name: 'dark', side: 0 });

      this.pipe('primary').on('data', (data)=> document.documentElement.style.setProperty('--editor-primary', data.color) )
      this.pipe('secondary').on('data', (data)=> document.documentElement.style.setProperty('--editor-secondary', data.color) )
      this.pipe('success').on('data', (data)=> document.documentElement.style.setProperty('--editor-success', data.color) )
      this.pipe('info').on('data', (data)=> document.documentElement.style.setProperty('--editor-info', data.color) )
      this.pipe('warning').on('data', (data)=> document.documentElement.style.setProperty('--editor-warning', data.color) )
      this.pipe('danger').on('data', (data)=> document.documentElement.style.setProperty('--editor-danger', data.color) )
      this.pipe('light').on('data', (data)=> document.documentElement.style.setProperty('--editor-light', data.color) )
      this.pipe('dark').on('data', (data)=> document.documentElement.style.setProperty('--editor-dark', data.color) )

    },


  };


}
