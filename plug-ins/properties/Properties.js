import Property from './Property.js';
import PropertyList from './PropertyList.js';

export default class Properties {

  client = null;
  properties = {};

  constructor(client){
    this.client = client;
  }

  // installer with overloading
  install(name){

    if(this.properties[name]){
      throw new Error(`property "${name}" already defined`);
    }

    const value = this.client[name];

    if (Array.isArray(value)){
      this.installArray(name, value);
    }else{
      this.installSimple(name, value);
    }
  }


  installSimple(name, value){
    this.properties[name] = new Property(name, value);
    // install over existing value
    Object.defineProperty(this.client, name, {
      get: () => this.properties[name].value,
      set: (value) => this.properties[name].value = value,
    });
  }

  installArray(name, value){
    this.properties[name] = new PropertyList(name, value);

    Object.defineProperty(this.client, name, {

      get: () => this.properties[name],

      set: (value) => {throw new Error(`observable array ${name} cannot be replaced`)},
    });
  }





  // Throw in a constraint system
  constrain(name, constraint){
    if(!this.properties[name]) throw new Error("property not defined");
    this.properties[name].constraints.push(constraint);
    this.properties[name].constrain();
  }

  // Install Cleaning System, to enable tracking observers
  #trash = [];
  disposable(...arg){
    this.#trash.push(...arg);
  }
  stop(){
    this.#trash.map(f=>f());
  }

  // Enable Observing
  observe(eventPath, observerCallback, options){
    const [name, path] = eventPath.split('.', 2);
    if(!this.properties[name]) throw new Error(`property "${name}" not defined`);
    this.disposable( this.properties[name].observe(path||name, observerCallback, options) );
  }




  //

  status(){
    // console.log(Object.keys(this.properties));
    console.log( Object.entries( this.properties ).flatMap(([k,v])=>`${k} observers: ${v.status().observerCount}`) );
  }

}
