import union from 'lodash/union.js';

import Properties from "#plug-ins/properties/Properties.js";

export default class Node {
  properties;
  constructor(object){
    this.properties = new Properties(this);

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

    const nodeProperties = union(Object.keys(baseProperties), Object.keys(object));

    for (const propertyName of nodeProperties) {
      this[propertyName] = object[propertyName];
      this.properties.install(propertyName);
    }

  }
}
