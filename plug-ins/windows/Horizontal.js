import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import { VerticalLayout } from "/plug-ins/layout-manager/index.js";

import Container from "/plug-ins/windows/Container.js";


export default class Horizontal {

  static extends = [Container];

  methods = {

    initialize(){

      // console.log(`%cContainer.initialize!`, 'background: hsl(180, 80%, 60%); color: black;');
      this.layout = new HorizontalLayout(this);

      this.on("children.created", (child) => {
        // console.log(`About to start ${child.oo.name}`, child, );
        child.scene = this.scene;
        child.start();
        this.layout.manage(child);
      }, {replay: true});

      this.on("children.removed", (item) => {
        // log('children.removed');
        item.stop();
        this.layout.forget(item);
      });

    },



  };

  constraints = {


  };

}
