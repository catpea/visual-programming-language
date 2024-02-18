import {ObjectOrientedProgramming} from "#plug-ins/object-oriented-programming/index.js";

import TestMiddle from './TestMiddle.js';

export default class Test {

  oop = new ObjectOrientedProgramming();

  extends = [TestMiddle];

  constructor(){
    this.oop.initialize(this);
  }

}
