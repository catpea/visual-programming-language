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

    data: undefined, // JSON data
  }

  constructor({meta, data}={}){

    this.properties = new Properties(this);

    for(const propertyName in this){
      // console.log('NODE', propertyName);
    }

    for (const propertyName in meta) {
      if(propertyName in this){
        console.log('NO Install', `Assign ${meta[propertyName]} to ${propertyName}=${this[propertyName]}`);
        this[propertyName] = meta[propertyName];
      }else{
        console.log('Install Meta Property', propertyName, meta[propertyName], (propertyName in this));
        this.properties.install(propertyName, meta[propertyName]);
      }
    }

    this.#load(data);

    this.on('data', data=>{
      //console.log('loaded', data);
    })
  }

  async #load(url){
    this.data = await (await fetch(url)).json();
  }

  // Read Only
  set id(v){this.#id = v;}
  set type(v){this.#type = v;}
  get id(){return this.#id;}
  get type(){return this.#type;}

}
