import Properties from "#plug-ins/properties/Properties.js";

export default class Node {
  properties;
  constructor(object){
    this.properties = new Properties(this);
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        this[key] = object[key];
        this.properties.install(key);
      }
    }
  }
}
