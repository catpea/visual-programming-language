export default class PropertyList {
  name = null;
  #value = [];

  constraints = [];

  constructor(name, value) {
    this.name = name;
    this.#value.push(...value);
    this.constrain();
  }

  constrain() {
    for (const item of this.#value) {
      this.constraints.forEach(({ test, message }) => {
        if (!test(item)) {
          throw new Error(`🍔 constraint error: ${message} (attempted to set: ${value})`);
        }
      });
    }
  }







  // Install Observer Functionality

  #observers = {};
  observe(eventName, observerCallback, options = { autorun: true, replay: false }) {

    if (typeof observerCallback !== "function") throw new TypeError("observer must be a function.");
    if (!Array.isArray(this.#observers[eventName])) this.#observers[eventName] = []; // If there isn't an observers array for this key yet, create it

    // AUTORUN LOGIC
    if(options.autorun){
      if( eventName == this.name ){ // will not spew for xxx.created or xxx.deleted just xxx
        for (const item of this.#value) { observerCallback(item) }
      }
    }

    // REPLAY, applies to all events (autorun only applies to non-dot events)
    // if .created needs a feed to initialize
    if( options.replay ){
      for (const item of this.#value) { observerCallback(item) }
    }

    this.#observers[eventName].push(observerCallback);
    return () => {
      this.unobserve(eventName, observerCallback);
    };
  }

  unobserve(eventName, observerCallback) {
    this.#observers[eventName] = this.#observers[eventName].filter((obs) => obs !== observerCallback);
  }

  notify(eventName, eventData, ...extra) {
    if (Array.isArray(this.#observers[eventName])) this.#observers[eventName].forEach((observerCallback) => observerCallback(eventData, ...extra));
  }
  status(){
    return {
      observerCount: Object.values(this.#observers).flat().length,

    };
  }




  // Data Editing Functions

  create(...items) {

    for(const item of items) {
      this.constrain(item);
      // if(!((Container.prototype.isPrototypeOf(item)) || (Control.prototype.isPrototypeOf(item)))) throw new Error(`Must be a Container or Control.`);
      this.#value.push(item);
      this.notify("created", item);
      this.notify("changed", this);
    }
  }

  remove(item){
    this.#value = this.#value.filter(o => o.id !== item.id);
    this.notify("removed", item);
    this.notify("changed", this);
  }


  // Data Reading Functions



  	[Symbol.iterator]() {
  		return this.#value[Symbol.iterator]();
  	}
  	find(callback) {
  		if(typeof callback !== "function") throw new TypeError("Needs a function.");
  		return this.#value.find(callback);
  	}
  	map(callback) {
  		if(typeof callback !== "function") throw new TypeError("Needs a function.");
  		return this.#value.map(callback);
  	}
  	reduce(callback, initialValue) {
  		if(typeof callback !== "function") throw new TypeError("Needs a function.");
  		return this.#value.reduce(callback, initialValue);
  	}
  	filter(callback) {
  		if(typeof callback !== "function") throw new TypeError("Needs a function.");
  		return this.#value.filter(callback);
  	}
  	forEach(callback) {
  		if(typeof callback !== "function") throw new TypeError("Needs a function.");
  		return this.#value.forEach(callback);
  	}
  	indexOf(item) {
  		return this.#value.indexOf(item);
  	}
  	slice(...argv) {
  		return this.#value.slice(...argv);
  	}

  	get length(){
  		return this.#value.length
  	}
  	get raw(){
  		return this.#value;
  	}


}
