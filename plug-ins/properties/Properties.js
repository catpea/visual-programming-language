import Property from './Property.js';
import PropertyList from './PropertyList.js';

export default class Properties {


  properties = {};

  constructor(client){

    if(!client){
      throw new Error(`You must specify client in the constructor of Properties()`);
    }

    this.client = client;

    if(client.on){
      throw new Error(`Error .on Already Defined`);
    }

    client.on = (...a) => this.observe(...a);

    if(!client.defaults){
      console.warn('no client defaults on', client);
    }else{
      for (const [name, value] of Object.entries(client.defaults)) {
        this.install(name, value)
      }
    }

    if(!client.constraints){
      console.warn(`danger: no client constraints on ${client.constructor.name} class`);
    }else{
      for (const [name, constraints] of Object.entries(client.constraints)) {
        for (const message in constraints) {
          this.constrain(name, message, constraints[message])
        }
      }
    }








  }

  // installer with overloading
  install(name, value){

    if(this.properties[name]){
      throw new Error(`property "${name}" already defined`);
    }

    if (Array.isArray(value)){
      this.installArray(name, value);
    }else{
      this.installPrimitive(name, value);
    }
  }


  installPrimitive(name, value){
    this.properties[name] = new Property(name, value);
    // install over existing value
    Object.defineProperty(Object.getPrototypeOf(this.client), name, {
      get: () => this.properties[name].value,
      set: (value) => this.properties[name].value = value,
      configurable: true,
    });
  }

  installArray(name, value){
    this.properties[name] = new PropertyList(name, value);
    // install over existing value
    Object.defineProperty(Object.getPrototypeOf(this.client), name, {
      get: () => this.properties[name],
      set: (value) => {throw new Error(`observable array ${name} cannot be replaced`)},
      configurable: true,
    });
  }





  // Throw in a constraint system
  constrain(name, message, test){
    if(!this.properties[name]) throw new Error("property not defined");
    this.properties[name].constraints.push({message, test});
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
    // console.log( Object.entries( this.properties ).flatMap(([k,v])=>`${k} observers: ${v.status().observerCount}`) );
  }

}
