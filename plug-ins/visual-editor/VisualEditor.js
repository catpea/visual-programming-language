import { svg, update } from "domek";
import Container from "/plug-ins/windows/Container.js";

export default class VisualEditor {

  static extends = [Container];

  methods = {
    initialize(){
      // throw new Error()
      console.log(`%cVisualEdior.initialize!`, 'background: hsl(222, 30%, 80%); color: black;');
      this.h = 200;

    },

    mount(){
      // throw new Error()
      console.log(`%cVisualEdior.MOUNT!`, 'background: hsl(222, 30%, 80%); color: black;');

      // update( this.el.Container,{ class: 'xxx', fill: 'red' });

    }
  }

}
