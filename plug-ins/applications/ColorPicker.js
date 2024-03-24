import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Window from "/plug-ins/windows/Window.js";
import VisualEditor from "/plug-ins/visual-editor/VisualEditor.js";
import ImagePicker from "/plug-ins/image-picker/ImagePicker.js";

export default class ColorPicker {

  static extends = [Window];

  methods = {

    initialize(){
    },

    mount(){

      // const editor = new Instance(VisualEditor);
      // this.createWindowComponent( editor ); // Add Visual Editor To The Window
      const imagePicker = new Instance(ImagePicker, {url: this.url});
      this.createWindowComponent( imagePicker ); // Add Visual Editor To The Window

      this.on("node", (node) => {

        node.on("url", url => imagePicker.url = url);
        node.on("h", h => imagePicker.h = h);
        node.on("w", w => imagePicker.w = w);
      });

    },

    stop(){
      console.log('Stopping...');
    },
    destroy(){
      console.log('Destroying...');
      console.log('Destroying... EL');
      console.log('Destroying... CHILDREN');
      console.log('Destroying... ANCHOR CONNECTIONS');
      console.log('Destroying... ANCHORS');
      this.dispose()
    },

  };


}
