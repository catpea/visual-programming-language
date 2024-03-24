
//NOTE: Inheritance is instantiated at the top of instance
export class Inheritance {

  instance;
  root;

  constructor({Class, instance, specification}){
    this.instance = instance;
    this.instance.oo.extends.push(Class)
    this.collectClasses(Class.extends);
    //??? this.instance.oo.specifications.push(specification);
    this.instantiateSuperclasses()
    // console.log(this.instance);
  }

  collectClasses(list){
    if (!Array.isArray(list)) return;
    for (const Class of list) {
      this.instance.oo.extends.push(Class);
      this.collectClasses(Class.extends);
    }
  }

  instantiateSuperclasses(){
    let parent;
    for (const Class of this.instance.oo.extends) {
      // THIS IS WRONG: we are creating instconst instance = new Instance( Class, data, {superInstantiation:true, root:this.instance} );
      const instance = new Class(); // NOTE: this is standard instantiation as we only need the specification
      this.instance.oo.specifications.push( instance );
      instance.parent = parent;
      parent = instance;
    }
  }


}

export class Instance {

  /*
    do not put anything in the properties section,
    Instance is the class that is returned to the user.
  */

  constructor(Class, data){

    const specification = new Class(); // specification is the class we are instantiating.
    // console.log(`%cCreate Class (${specification.constructor.name})`, 'background: hsl(124, 50%, 60%); color: black;');

    this.oo = {}
    this.oo.name = specification.constructor.name;
    this.oo.class = Class;
    this.oo.specification = specification;
    this.oo.newObservables = [];

    this.oo.extends = [];
    this.oo.disposables = [];
    this.oo.specifications = [];

    new Inheritance({Class, instance:this, specification, root:this});

    // // Install Super
    // if(!dependency){
    //   const reverseStack = Array.from( this.oo.specifications ).reverse();
    //   // reverseStack.pop()
    //   console.log('reverseStack',reverseStack);
    //   let previous = undefined;
    //   for (const inherited of reverseStack ) {
    //     inherited.Superclass = previous;
    //     console.log('EE', inherited.Parent, inherited);
    //     previous = inherited;
    //   }
    //   this.Superclass = previous
    // }

    const defaultState = {
        current: 'initial',

        initial: {
           run: 'initialize',
           can: 'start'
         },

         start: {
           run: 'mount',
           can: 'stop'
         },

         stop: {
           run: 'destroy',
           can: 'start'
         },

      };




    const ensureArray = function(input){ // convert string to array, and if it is array leave it alone
      if( Array.isArray(input) ) return input;
      return [input];
    }
    const isStateTransitionAllowed = function({from, to, state}){
      return ensureArray(state[from].can).includes(to);
    }



    // Install Properties
    for (const inherited of this.oo.specifications) {
      // begin at top, avoid properties that already exist.
      if(inherited.properties){
        for (const [propertyName, propertyValue] of Object.entries(inherited.properties)) {
          if(propertyName in this === false){
            Object.defineProperty(this, propertyName, {
              value: propertyValue,
              writable: true,
              enumerable: true,
              configurable: false,
            });
          }
        } // for properties
      } // if
    }

    // Install Traits (a trait is bound to the nice object)
    for (const inherited of this.oo.specifications) {
      // begin at top, avoid properties that already exist.
      if(inherited.traits){
        for (const [traitName, traitFunction] of Object.entries(inherited.traits)) {
          if(traitName in this === false){
            Object.defineProperty(this, traitName, {
              value: traitFunction.bind( this ),
              writable: true,
              enumerable: true,
              configurable: false,
            });
          }
        } // for properties
      } // if
    }

    // Install Methods (sensitive to method chains)

    // for (const inherited of this.oo.specifications) {
    //   if(inherited.methods){ // if methods property
    //     for (const [methodName, methodFunction] of Object.entries(inherited.methods)) {
    //
    //       if(methodName in this === true) continue; // method exists
    //
    //       Object.defineProperty(this, methodName, {
    //         value: methodFunction.bind(this),
    //         writable: true,
    //         enumerable: true,
    //         configurable: false,
    //       });
    //
    //       console.log(`DEFINED ${methodName} on ${this.constructor.name}`);
    //     console.log(methodName, this[methodName]);
    //
    //     } // for properties
    //   } // if
    // }



    // Gather All Methods
    const composite = this;
    const methods = [];
    for (const inherited of this.oo.specifications) {
      if(inherited.methods){ // if methods property
        for (const [methodName, methodFunction] of Object.entries(inherited.methods)) {
          methods.push(methodName);
        } // for properties
      } // if
    }
    function executeAll(name, arg, list){
      let response = null;
      const reversed = Array.from( list ).reverse();
      for (const inherited of reversed) {
        if(inherited.methods && inherited.methods[name]){
          response = inherited.methods[name].bind(composite)(...arg)
        }
      }
      return response;
    }
    for (const methodName of methods) {
      Object.defineProperty(this, methodName, {
        value: function(...arg){ return executeAll(methodName, arg, this.oo.specifications) },
        writable: true,
        enumerable: true,
        configurable: false,
      });
    }




    const observableData = {};
    this.oo.createObservable = (observableName, observableValue=undefined, internal=false) => {

      if(!internal){
        // this is a user defined observable
        this.oo.newObservables.push(observableName);
      }

      // TODO: inherited.observables[observableName] = observableValue; // (for serialization)

      const isArray = Array.isArray(observableValue)?true:false;
      if(observableName in this === false){

        if(isArray){
          observableData[observableName] = new List(observableName, observableValue);
          Object.defineProperty(this, observableName, {
            get: () => observableData[observableName].value,
            set: (value) => {throw new Error(`observable array ${name} cannot be replaced`)},
            configurable: false,
          });
        }else{ // primitive
          observableData[observableName] = new Primitive(observableName, observableValue);
          Object.defineProperty(this, observableName, {
            get: () => observableData[observableName].value,
            set: (value) => observableData[observableName].value = value,
            configurable: false,
          });
        }

      }
    }


    // Install Observables
    for (const inherited of this.oo.specifications) {
      // begin at top, avoid properties that already exist.
      if(inherited.observables){
        for (const [observableName, observableValue] of Object.entries(inherited.observables)) {
          this.oo.createObservable(observableName, observableValue, true);
        } // for properties
      } // if
    }

    // DISPOSABLES
    // Install Cleaning System, to enable tracking observers
    // INTERNAL VERSION
    const disposables = [];
    const disposable = function (...arg){
      disposables.push(...arg);
    }
    // EXTERNAL (USER) VERSION
    Object.defineProperty(this, 'disposable', {
      set: (value) => this.oo.disposables.push(value),
      configurable: false,
    });

    // FLUSH ALL
    this.dispose = ()=>{
      disposables.map(f=>f()); // for here
      this.oo.disposables.map(f=>f()); // for user
    }






    // Enable Observing
    this.on = function(eventPath, observerCallback, options, control){
      const [name, path] = eventPath.split('.', 2);
      if(!observableData[name]) throw new Error(`property "${name}" not defined (${Object.keys(observableData).join(', ')})`);


      if(control?.manualDispose){
        return observableData[name].observe(path||name, observerCallback, options);
      }else{
        disposable( observableData[name].observe(path||name, observerCallback, options) );
      }
    }

    this.any = function(observables, callback1){
      const callback2 = ()=>{
        const entries = observables.map(key => [key, this[key]])
        const packet = Object.fromEntries(entries);
        callback1(packet);
      }
      return observables.map(event=>this.on(event, callback2, undefined, {manualDispose: true}));
    }

    this.all = function(observables, callback1){
      const callback2 = ()=>{
        const entries = observables.map(key => [key, this[key]])
        const packet = Object.fromEntries(entries);
        const isReady = Object.values(packet).every(value=>value!==undefined)
        if(isReady) callback1(packet);
      }
      return observables.map(event=>this.on(event, callback2, undefined, {manualDispose: true}));
    }

    // Install State (must come after methods as it may call come of them)
    const stateConstraints = {};
    const stateConstraint = function(constraints, constraintName){
      // console.log('TESTING', constraintName, constraints[constraintName]);
      if(constraints[constraintName]){
      constraints[constraintName].forEach(({ test, message }) => {
        const verdict = test();
        if (verdict?.error) {
          throw new Error(`🍔 state constraint error: ${message} - ${verdict.error} (attempted to execute ${constraintName})`);
        }
      });
      }
    }

    const state = specification.state || defaultState;
    for (const [stateName, stateValue] of Object.entries(state).filter(([stateName, stateValue])=>stateName!=='current')) {
      if(stateName in this === false){
        const stateFunction = function(){
          // check if in this state this function can run
          const currentState = state.current;
          const from = currentState;
          const to = stateName;
          // console.log({from, to,});

          const transitionAllowed = isStateTransitionAllowed({
            from, to, state
          })
          if(!transitionAllowed){
              throw new Error(`Cannot transition state from ${from} (current) to ${to}, only ${ensureArray(state[currentState].can).join(", ")} allowed.`)
          }
          if(transitionAllowed){
              // console.log(`Transitioniong ${specification.constructor.name} state from ${from} -> ${to} `);
          }
          // execute methods specified in run
          const stateFunctions = ensureArray(state[stateName].run);
          for (const functionName of stateFunctions) {
            // const lookup = specification;
            // if(!lookup || !lookup[functionName]) throw new Error(`State Change: Class ${specification.constructor.name} has no function named ${functionName}`)
            // stateConstraint(stateConstraints, functionName);
            // lookup[functionName].bind(this)();
            //
            if(functionName in this === false) throw new Error(`Initialize: Class ${specification.constructor.name} has no function named ${functionName}`)
            stateConstraint(stateConstraints, functionName);
            this[functionName]();

          }
          // switch state
          state.current = stateName;
        }.bind(this);
        // console.log(`Creating state function ${stateName}`);
        Object.defineProperty(this, stateName, {
          value: stateFunction,
          writable: true,
          enumerable: true,
          configurable: false,
        });
      }
    } // for properties




    // Install State Constraints
    for (const [stateName, stateValue] of Object.entries(state).filter(([stateName, stateValue])=>stateName!=='current')) {
      for (const keyName of ensureArray(stateValue.run)) {
        if(specification.constraints && specification.constraints[keyName]){
          for (const [constraintName, constraintValue] of Object.entries(specification.constraints[keyName])) {
            //console.log(keyName, [constraintName, constraintValue] );
            if(!stateConstraints[keyName]) stateConstraints[keyName] = [];
              stateConstraints[keyName].push({message:constraintName, test:constraintValue.bind(this)});
          }
        }
      }
    }







    // Install Observable Constraints
    for (const inherited of this.oo.specifications) {
      if(inherited.constraints && inherited.observables){
        for (const [constraintName, constraintValue] of Object.entries(inherited.constraints).filter(([constraintName, constraintValue])=>inherited.observables[constraintName])) {
          if(constraintName in observableData === false) throw new Error(`Unable to observable constrain "${constraintName}" becasue it is not defined in ${specification.constructor.name}`);
          for (const [message, test] of Object.entries(constraintValue)) {
            observableData[constraintName].constraints.push({message, test:test.bind(this)});
            observableData[constraintName].constrain(observableData[constraintName].value, true);
          }
        } // for constraints
      } // if constraints
    }


    // appply constructor data
    if(data){
      for (const [name, value] of Object.entries(data)) {
        // console.log(`CONSTRUCTOR DATA setting ${name} to`, value);
          this[name] = value;
      }
    }

    // execute functions defined in initial state
    const stateName = state.current;
    const stateFunctions = ensureArray(state[stateName].run);

    for (const functionName of stateFunctions) {
      if(functionName in this === false) throw new Error(`Initialize: Class ${specification.constructor.name} has no function named ${functionName}`)
      stateConstraint(stateConstraints, functionName);
      this[functionName]();
    }
  }






}



export class Primitive {
  name = null;
  #value = null;

  constraints = [];

  constructor(name, value) {
    this.name = name;
    this.#value = value;
  }

  constrain(data, initialization) {
    if(initialization) return;
    this.constraints.forEach(({ test, message }) => {
      const verdict = test(data, this.#value);
      if (verdict?.error) {
        throw new Error(`🍔 constraint error: ${message} - ${verdict.error} (attempted to set ${this.name} to ${data})`);
      }
    });
  }

  // Getter And Setter

  get value() {
    return this.#value;
  }

  set value(data) {
    if (this.#value == data) return;
    this.constrain(data);
    const previousValue = this.#value;
    // if(data !== undefined) console.log(`Setting ${this.name} to "${data}" was: `, this.#value);
    if(data !== undefined) this.notify(`${this.name}.before`, this.#value, previousValue);
    this.#value = data;
    if(data !== undefined) this.notify(this.name, this.#value, previousValue);

  }


  // Install Observer Functionality

  #observers = {};
  observe(eventName, observerCallback, options = { autorun: true }) {
    if (typeof observerCallback !== "function") throw new TypeError("observer must be a function.");
    if (!Array.isArray(this.#observers[eventName])) this.#observers[eventName] = []; // If there isn't an observers array for this key yet, create it
    this.#observers[eventName].push(observerCallback);
    // console.log(`this.#observers.${eventName}`, this.#observers[eventName]);
    if (options.autorun && this.#value !== undefined) observerCallback(this.#value);
    return () => {
      console.log(`UNOBSERVING ${eventName}`);
      this.unobserve(eventName, observerCallback);
    };
  }
  unobserve(eventName, observerCallback) {
    this.#observers[eventName] = this.#observers[eventName].filter((obs) => obs !== observerCallback);
  }

  notify(eventName, eventData, ...extra) {
    if (Array.isArray(this.#observers[eventName])){
      // console.log(`Event ${eventName} has ${this.#observers[eventName].length} observer(s)`);
      this.#observers[eventName].forEach((observerCallback) => observerCallback(eventData, ...extra));
    }else{
      // console.log(`${eventName} has no observers`);
    }
  }
  status(){

    return {
      observerCount: Object.values(this.#observers).flat().length,
    }
  }
}

export class List {
  name = null;
  #value = [];

  constraints = [];

  constructor(name, value) {
    this.name = name;
    this.#value.push(...value);
    this.constrain();
  }

  constrain(data, initialization) {
    if(initialization) return;
    for (const data of this.#value) {
      this.constraints.forEach(({ test, message }) => {
        const verdict = test(data, this.#value);
        if (verdict?.error) {
          throw new Error(`🍔 constraint error: ${message} - ${verdict.error} (attempted to set ${this.name} to ${data})`);
        }
      });
    }
  }


  get value() {
    return this; // NOTE: returning PropertyList as it is the array that wraps the simple array
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

  remove(input){
    let id;

    if(typeof input === 'string'){
      id = input;
    }else{
      if(!input.id) throw new Error('Only stingId and onbect with an id property is supported');
      id = input.id;
    }

    const item = this.#value.find(o => o.id === id);
    this.#value = this.#value.filter(o => o !== item);
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
  	get(id) {
  		return this.#value.find(o=>o.id===id);
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
