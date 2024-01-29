import union from 'lodash/union.js';

import Properties from "#plug-ins/properties/Properties.js";

export default class Node {
  properties;

  constructor(object={}){

    this.properties = new Properties(this);

    for (const propertyName in object) {
      this[propertyName] = object[propertyName];
      this.properties.install(propertyName);
    }

    const baseProperties = {
      x:0,
      y:0,
      w:32,
      h:32,
      H:0,
      r:0,
      b:0,
      p:0,
      s:0,
    }; // required by the system

    for (const propertyName in baseProperties) {
      if(!this[propertyName]){
        this[propertyName] = baseProperties[propertyName];
        this.properties.install(propertyName);
      }
    }

    ///

  }
}
