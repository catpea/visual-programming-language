import union from 'lodash/union.js';

import Properties from "#plug-ins/properties/Properties.js";

export default class Node {
  properties;

  #id;
  #type;

  defaults = {
    x:0,
    y:0,
    w:32,
    h:32,
    H:0,
    r:0,
    b:0,
    p:0,
    s:0,
  }

  constructor(object={}){
    this.properties = new Properties(this);
    for (const propertyName in object) {
      if(propertyName in this){
        this[propertyName] = object[propertyName];
      }else{
        console.log('Install', propertyName, object[propertyName]);
        this.properties.install(propertyName, object[propertyName]);
      }
    }

  }

  // Read Only
  set id(v){this.#id = v;}
  set type(v){this.#type = v;}
  get id(){return this.#id;}
  get type(){return this.#type;}

}
