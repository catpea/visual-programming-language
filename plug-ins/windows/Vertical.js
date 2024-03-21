import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import { VerticalLayout } from "/plug-ins/layout-manager/index.js";

import Container from "/plug-ins/windows/Container.js";

export default class Vertical {
  static extends = [Container];
  methods = {
    initialize(){
      this.layout = new VerticalLayout(this);
    },
  };
}
