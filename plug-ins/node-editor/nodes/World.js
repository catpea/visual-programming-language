import Node from "./Node.js";

export default class World extends Node {
  type = 'World';
  text = 'Hello World';

  input = [];
  output(){
    return this.input;
  }
}
