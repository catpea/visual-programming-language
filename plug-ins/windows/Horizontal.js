import {Instance} from "/plug-ins/object-oriented-programming/index.js";
import { HorizontalLayout } from "/plug-ins/layout-manager/index.js";

import Container from "/plug-ins/windows/Container.js";

export default class Horizontal {
  static extends = [Container];
  methods = {
    initialize(){
      this.layout = new HorizontalLayout(this);
    },
  };
}
