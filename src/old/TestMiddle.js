import {ObjectOrientedProgramming} from "#plug-ins/object-oriented-programming/index.js";
import TestBase from './TestBase.js';

export default class TestMiddle {

  oop = new ObjectOrientedProgramming();

  extends = [TestBase];


  properties = {
    name: null,

  };

  observables = {
    started: null,
  };

  constraints = {
  };

  constructor(){
    this.oop.initialize(this);
  }

  start(){

  }

  stop(){

  }

  destroy(){

  }



}
