
//NOTE: Inheritance is instantiated at the top of instance
export class Inheritance {

  instance;

  constructor(Class, instance, specification){
    this.instance = instance;
    this.instance.oo.extends.push(Class)
    this.collectClasses(Class.extends);
    this.instance.oo.chain.push(specification);
    // this.instantiateSuperclasses()

  }

  collectClasses(list){
    if (!Array.isArray(list)) return;
    for (const Class of list) {
      this.instance.oo.extends.push(Class);
      this.collectClasses(Class.extends);
    }
  }

  instantiateSuperclasses(){
    for (const Class of this.extends) {
      const instance = new Instance( Class, data, {superclassMode:true} );
      this.instance.oo.chain.push( instance );
    }
  }


}

export class Instance {

  /*
    do not put anything in the properties section,
    Instance is the class that is returned to the user.
  */

  constructor(TypeClass, data, {}={superclassMode:false}){

    const specification = new TypeClass(); // specification is the class we are instantiating.

    this.oo = {}
    this.oo.name = specification.constructor.name;
    this.oo.class = TypeClass;
    this.oo.specification = specification;
    this.oo.extends = [];
    this.oo.chain = [];
    new Inheritance(TypeClass, this, specification);
    // this.Abstract.Subclass = specification;

    console.log(this.oo);


    // // Install Super
    // if(!dependency){
    //   const reverseStack = Array.from( this.oo.chain ).reverse();
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
    for (const inherited of this.oo.chain) {
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
    for (const inherited of this.oo.chain) {
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

    // Install Methods (bound to the original class where they are from)

    for (const inherited of this.oo.chain) {

      // begin at top, avoid properties that already exist.
      if(inherited.methods){
        for (const [methodName, methodFunction] of Object.entries(inherited.methods)) {
          if(methodName in this === false){
            Object.defineProperty(this, methodName, {
              value: methodFunction===true?inherited[methodName].bind(inherited):methodFunction.bind(inherited),
              writable: true,
              enumerable: true,
              configurable: false,
            });
          }
        } // for properties
      } // if

    }

    const observableData = {};
    // Install Observables
    for (const inherited of this.oo.chain) {
      // begin at top, avoid properties that already exist.
      if(inherited.observables){
        for (const [observableName, observableValue] of Object.entries(inherited.observables)) {
          const isArray = Array.isArray(observableValue)?true:false;
          if(observableName in this === false){

            if(isArray){
              observableData[observableName] = new List(observableName, observableValue);
              Object.defineProperty(this, observableName, {
                get: () => observableData[observableName].value,
                set: (value) => {throw new Error(`observable array oo{name} cannot be replaced`)},
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
        } // for properties
      } // if
    }


    // Install Cleaning System, to enable tracking observers
    const disposables = [];
    const disposable = function (...arg){
      disposables.push(...arg);
    }
    this.dispose = function(){
      disposables.map(f=>f());
    }

    // Enable Observing
    this.on = function(eventPath, observerCallback, options){
      const [name, path] = eventPath.split('.', 2);
      if(!observableData[name]) throw new Error(`property "oo{name}" not defined (oo{Object.keys(observableData).join(', ')})`);
      disposable( observableData[name].observe(path||name, observerCallback, options) );
    }


    // // Install State
    // for (const inherited of this.oo.chain) {
    //   if(inherited.state){
    //     for (const [stateName, stateValue] of Object.entries(inherited.state).filter(([stateName, stateValue])=>stateName!=='current')) {
    //       if(stateName in this === false){
    //         const stateFunction = function(){
    //           // check if in this state this function can run
    //           const from = inherited.state.current;
    //           const to = stateName;
    //           console.log({from, to,});
    //
    //           const transitionAllowed = isStateTransitionAllowed({
    //             from, to,
    //             state: inherited.state
    //           })
    //           if(!transitionAllowed){
    //               throw new Error(`Cannot transition state from oo{from} (current) to oo{to}, only oo{ensureArray(inherited.state[inherited.state.current].can).join(", ")} allowed.`)
    //           }
    //           if(transitionAllowed){
    //               console.log(`Transitioniong state from oo{from} ->  oo{to} `);
    //           }
    //           // execute methods specified in run
    //           for (const functionName in ensureArray(stateValue.run)) {
    //             this[functionName]();
    //           }
    //           // switch state
    //           inherited.state.current = stateName;
    //         }.bind(this);
    //
    //         console.log(`Creating state function oo{stateName}`);
    //         Object.defineProperty(this, stateName, {
    //           value: stateFunction,
    //           writable: true,
    //           enumerable: true,
    //           configurable: false,
    //         });
    //       }
    //     } // for properties
    //   } // if state
    // }

    // Install State (must come after methods as it may call come of them)
    const stateConstraints = {};
    const stateConstraint = function(constraints, constraintName){
      console.log('TESTING', constraintName, constraints[constraintName]);
      if(constraints[constraintName]){
      constraints[constraintName].forEach(({ test, message }) => {
        const verdict = test();
        if (verdict?.error) {
          throw new Error(`🍔 state constraint error: oo{message} - oo{verdict.error} (attempted to execute oo{constraintName})`);
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
              throw new Error(`Cannot transition state from oo{from} (current) to oo{to}, only oo{ensureArray(state[currentState].can).join(", ")} allowed.`)
          }
          if(transitionAllowed){
              console.log(`Transitioniong oo{specification.constructor.name} state from oo{from} -> oo{to} `);
          }
          // execute methods specified in run
          const stateFunctions = ensureArray(state[stateName].run);
          for (const functionName of stateFunctions) {
            const lookup = specification;
            if(!lookup || !lookup[functionName]) throw new Error(`State Change: Class oo{specification.constructor.name} has no function named oo{functionName}`)
            stateConstraint(stateConstraints, functionName);
            lookup[functionName].bind(this)();
          }
          // switch state
          state.current = stateName;
        }.bind(this);
        // console.log(`Creating state function oo{stateName}`);
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
            console.log(keyName, [constraintName, constraintValue] );
            if(!stateConstraints[keyName]) stateConstraints[keyName] = [];
              stateConstraints[keyName].push({message:constraintName, test:constraintValue.bind(this)});
          }
        }
      }
    }





    // Install Observable Constraints
    for (const inherited of this.oo.chain) {
      if(inherited.constraints){
        for (const [constraintName, constraintValue] of Object.entries(inherited.constraints).filter(([constraintName, constraintValue])=>inherited.observables[constraintName])) {
          if(constraintName in observableData === false) throw new Error(`Unable to observable constrain "oo{constraintName}" becasue it is not defined in oo{specification.constructor.name}`);
          for (const [message, test] of Object.entries(constraintValue)) {
            observableData[constraintName].constraints.push({message, test:test.bind(this)});
            observableData[constraintName].constrain(observableData[constraintName].value, true);
          }
        } // for constraints
      } // if constraints
    }





    // execute functions defined in initial state
    const stateName = state.current;
    const stateFunctions = ensureArray(state[stateName].run);
    for (const functionName of stateFunctions) {
      const lookup = [this, ...this.oo.chain].find(o=>functionName in o === true);
      if(!lookup || !lookup[functionName]) throw new Error(`Initialize: Class oo{specification.constructor.name} has no function named oo{functionName}`)
      stateConstraint(stateConstraints, functionName);
      lookup[functionName].bind(this)();

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
        throw new Error(`🍔 constraint error: oo{message} - oo{verdict.error} (attempted to set oo{this.name} to oo{data})`);
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
    if(data !== undefined) console.log(`Setting oo{this.name} to "oo{data}" was: `, this.#value);
    if(data !== undefined) this.notify(`oo{this.name}.before`, this.#value, previousValue);
    this.#value = data;
    if(data !== undefined) this.notify(this.name, this.#value, previousValue);

  }


  // Install Observer Functionality

  #observers = {};
  observe(eventName, observerCallback, options = { autorun: true }) {
    if (typeof observerCallback !== "function") throw new TypeError("observer must be a function.");
    if (!Array.isArray(this.#observers[eventName])) this.#observers[eventName] = []; // If there isn't an observers array for this key yet, create it
    this.#observers[eventName].push(observerCallback);
    // console.log(`this.#observers.oo{eventName}`, this.#observers[eventName]);
    if (options.autorun && this.#value !== undefined) observerCallback(this.#value);
    return () => {
      this.unobserve(eventName, observerCallback);
    };
  }
  unobserve(eventName, observerCallback) {
    this.#observers[eventName] = this.#observers[eventName].filter((obs) => obs !== observerCallback);
  }

  notify(eventName, eventData, ...extra) {
    if (Array.isArray(this.#observers[eventName])){
      // console.log(`Event oo{eventName} has oo{this.#observers[eventName].length} observer(s)`);
      this.#observers[eventName].forEach((observerCallback) => observerCallback(eventData, ...extra));
    }else{
      // console.log(`oo{eventName} has no observers`);
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
          throw new Error(`🍔 constraint error: oo{message} - oo{verdict.error} (attempted to set oo{this.name} to oo{data})`);
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
