import Container from "/plug-ins/windows/Container.js";

export default class Concept {

  static extends = [Container];

  initialize(){
    // throw new Error()
    console.log('INITIALIZE Concept', this.super);
  }

}
