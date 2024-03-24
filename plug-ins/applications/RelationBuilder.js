import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import VisualEditor from "/plug-ins/visual-editor/VisualEditor.js";

export default class RelationBuilder {

  static extends = [Window];

  methods = {

    initialize(){
      this.w = 800;
      this.h = 600;
    },

    mount(){

      // const editor = new Instance(VisualEditor);
      // this.createWindowComponent( editor ); // Add Visual Editor To The Window
      const visualEditor = new Instance(VisualEditor, {url: this.url});
      this.createWindowComponent( visualEditor ); // Add Visual Editor To The Window

      this.on("node", (node) => {
        node.on("url", url => imagePicker.url = url);
      });

    },

    stop(){
      console.log('Stopping...');
    },
    destroy(){
      console.log('Destroying...');
      this.dispose()
    },

  };


}
