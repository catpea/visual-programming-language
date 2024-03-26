(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value2) => __defProp(target, "name", { value: value2, configurable: true });

  // plug-ins/object-oriented-programming/index.js
  var Inheritance = class {
    static {
      __name(this, "Inheritance");
    }
    instance;
    root;
    constructor({ Class, instance, specification }) {
      this.instance = instance;
      this.instance.oo.extends.push(Class);
      this.collectClasses(Class.extends);
      this.instantiateSuperclasses();
    }
    collectClasses(list) {
      if (!Array.isArray(list))
        return;
      for (const Class of list) {
        this.instance.oo.extends.push(Class);
        this.collectClasses(Class.extends);
      }
    }
    instantiateSuperclasses() {
      let parent;
      for (const Class of this.instance.oo.extends) {
        const instance = new Class();
        this.instance.oo.specifications.push(instance);
        instance.parent = parent;
        parent = instance;
      }
    }
  };
  var Instance = class {
    static {
      __name(this, "Instance");
    }
    /*
      do not put anything in the properties section,
      Instance is the class that is returned to the user.
    */
    constructor(Class, data) {
      const specification = new Class();
      this.oo = {};
      this.oo.name = specification.constructor.name;
      this.oo.class = Class;
      this.oo.specification = specification;
      this.oo.newObservables = [];
      this.oo.extends = [];
      this.oo.disposables = [];
      this.oo.specifications = [];
      new Inheritance({ Class, instance: this, specification, root: this });
      const defaultState = {
        current: "initial",
        initial: {
          run: "initialize",
          can: "start"
        },
        start: {
          run: "mount",
          can: "stop"
        },
        stop: {
          run: "destroy",
          can: "start"
        }
      };
      const ensureArray = /* @__PURE__ */ __name(function(input) {
        if (Array.isArray(input))
          return input;
        return [input];
      }, "ensureArray");
      const isStateTransitionAllowed = /* @__PURE__ */ __name(function({ from, to, state: state2 }) {
        return ensureArray(state2[from].can).includes(to);
      }, "isStateTransitionAllowed");
      for (const inherited of this.oo.specifications) {
        if (inherited.properties) {
          for (const [propertyName, propertyValue] of Object.entries(inherited.properties)) {
            if (propertyName in this === false) {
              Object.defineProperty(this, propertyName, {
                value: propertyValue,
                writable: true,
                enumerable: true,
                configurable: false
              });
            }
          }
        }
      }
      for (const inherited of this.oo.specifications) {
        if (inherited.traits) {
          for (const [traitName, traitFunction] of Object.entries(inherited.traits)) {
            if (traitName in this === false) {
              Object.defineProperty(this, traitName, {
                value: traitFunction.bind(this),
                writable: true,
                enumerable: true,
                configurable: false
              });
            }
          }
        }
      }
      const composite = this;
      const methods = [];
      for (const inherited of this.oo.specifications) {
        if (inherited.methods) {
          for (const [methodName, methodFunction] of Object.entries(inherited.methods)) {
            methods.push(methodName);
          }
        }
      }
      function executeAll(name2, arg, list) {
        let response = null;
        const reversed = Array.from(list).reverse();
        for (const inherited of reversed) {
          if (inherited.methods && inherited.methods[name2]) {
            response = inherited.methods[name2].bind(composite)(...arg);
          }
        }
        return response;
      }
      __name(executeAll, "executeAll");
      for (const methodName of methods) {
        Object.defineProperty(this, methodName, {
          value: function(...arg) {
            return executeAll(methodName, arg, this.oo.specifications);
          },
          writable: true,
          enumerable: true,
          configurable: false
        });
      }
      const observableData = {};
      this.oo.createObservable = (observableName, observableValue = void 0, internal = false) => {
        if (!internal) {
          this.oo.newObservables.push(observableName);
        }
        const isArray = Array.isArray(observableValue) ? true : false;
        if (observableName in this === false) {
          if (isArray) {
            observableData[observableName] = new List(observableName, observableValue);
            Object.defineProperty(this, observableName, {
              get: () => observableData[observableName].value,
              set: (value2) => {
                throw new Error(`observable array ${name} cannot be replaced`);
              },
              configurable: false
            });
          } else {
            observableData[observableName] = new Primitive(observableName, observableValue);
            Object.defineProperty(this, observableName, {
              get: () => observableData[observableName].value,
              set: (value2) => observableData[observableName].value = value2,
              configurable: false
            });
          }
        }
      };
      for (const inherited of this.oo.specifications) {
        if (inherited.observables) {
          for (const [observableName, observableValue] of Object.entries(inherited.observables)) {
            this.oo.createObservable(observableName, observableValue, true);
          }
        }
      }
      const disposables = [];
      const disposable = /* @__PURE__ */ __name(function(...arg) {
        disposables.push(...arg);
      }, "disposable");
      Object.defineProperty(this, "disposable", {
        set: (value2) => this.oo.disposables.push(value2),
        configurable: false
      });
      this.dispose = () => {
        disposables.map((f) => f());
        this.oo.disposables.map((f) => f());
      };
      this.on = function(eventPath, observerCallback, options, control) {
        const [name2, path] = eventPath.split(".", 2);
        if (!observableData[name2])
          throw new Error(`property "${name2}" not defined (${Object.keys(observableData).join(", ")})`);
        if (control?.manualDispose) {
          return observableData[name2].observe(path || name2, observerCallback, options);
        } else {
          disposable(observableData[name2].observe(path || name2, observerCallback, options));
        }
      };
      this.any = function(observables, callback1) {
        const callback2 = /* @__PURE__ */ __name(() => {
          const entries = observables.map((key) => [key, this[key]]);
          const packet = Object.fromEntries(entries);
          callback1(packet);
        }, "callback2");
        return observables.map((event2) => this.on(event2, callback2, void 0, { manualDispose: true }));
      };
      this.all = function(observables, callback1) {
        const callback2 = /* @__PURE__ */ __name(() => {
          const entries = observables.map((key) => [key, this[key]]);
          const packet = Object.fromEntries(entries);
          const isReady = Object.values(packet).every((value2) => value2 !== void 0);
          if (isReady)
            callback1(packet);
        }, "callback2");
        return observables.map((event2) => this.on(event2, callback2, void 0, { manualDispose: true }));
      };
      const stateConstraints = {};
      const stateConstraint = /* @__PURE__ */ __name(function(constraints, constraintName) {
        if (constraints[constraintName]) {
          constraints[constraintName].forEach(({ test, message }) => {
            const verdict = test();
            if (verdict?.error) {
              throw new Error(`\u{1F354} state constraint error: ${message} - ${verdict.error} (attempted to execute ${constraintName})`);
            }
          });
        }
      }, "stateConstraint");
      const state = specification.state || defaultState;
      for (const [stateName2, stateValue] of Object.entries(state).filter(([stateName3, stateValue2]) => stateName3 !== "current")) {
        if (stateName2 in this === false) {
          const stateFunction = function() {
            const currentState = state.current;
            const from = currentState;
            const to = stateName2;
            const transitionAllowed = isStateTransitionAllowed({
              from,
              to,
              state
            });
            if (!transitionAllowed) {
              throw new Error(`Cannot transition state from ${from} (current) to ${to}, only ${ensureArray(state[currentState].can).join(", ")} allowed.`);
            }
            if (transitionAllowed) {
            }
            const stateFunctions2 = ensureArray(state[stateName2].run);
            for (const functionName of stateFunctions2) {
              if (functionName in this === false)
                throw new Error(`Initialize: Class ${specification.constructor.name} has no function named ${functionName}`);
              stateConstraint(stateConstraints, functionName);
              this[functionName]();
            }
            state.current = stateName2;
          }.bind(this);
          Object.defineProperty(this, stateName2, {
            value: stateFunction,
            writable: true,
            enumerable: true,
            configurable: false
          });
        }
      }
      for (const [stateName2, stateValue] of Object.entries(state).filter(([stateName3, stateValue2]) => stateName3 !== "current")) {
        for (const keyName of ensureArray(stateValue.run)) {
          if (specification.constraints && specification.constraints[keyName]) {
            for (const [constraintName, constraintValue] of Object.entries(specification.constraints[keyName])) {
              if (!stateConstraints[keyName])
                stateConstraints[keyName] = [];
              stateConstraints[keyName].push({ message: constraintName, test: constraintValue.bind(this) });
            }
          }
        }
      }
      for (const inherited of this.oo.specifications) {
        if (inherited.constraints && inherited.observables) {
          for (const [constraintName, constraintValue] of Object.entries(inherited.constraints).filter(([constraintName2, constraintValue2]) => inherited.observables[constraintName2])) {
            if (constraintName in observableData === false)
              throw new Error(`Unable to observable constrain "${constraintName}" becasue it is not defined in ${specification.constructor.name}`);
            for (const [message, test] of Object.entries(constraintValue)) {
              observableData[constraintName].constraints.push({ message, test: test.bind(this) });
              observableData[constraintName].constrain(observableData[constraintName].value, true);
            }
          }
        }
      }
      if (data) {
        for (const [name2, value2] of Object.entries(data)) {
          this[name2] = value2;
        }
      }
      const stateName = state.current;
      const stateFunctions = ensureArray(state[stateName].run);
      for (const functionName of stateFunctions) {
        if (functionName in this === false)
          throw new Error(`Initialize: Class ${specification.constructor.name} has no function named ${functionName}`);
        stateConstraint(stateConstraints, functionName);
        this[functionName]();
      }
    }
  };
  var Primitive = class {
    static {
      __name(this, "Primitive");
    }
    name = null;
    #value = null;
    constraints = [];
    constructor(name2, value2) {
      this.name = name2;
      this.#value = value2;
    }
    constrain(data, initialization) {
      if (initialization)
        return;
      this.constraints.forEach(({ test, message }) => {
        const verdict = test(data, this.#value);
        if (verdict?.error) {
          throw new Error(`\u{1F354} constraint error: ${message} - ${verdict.error} (attempted to set ${this.name} to ${data})`);
        }
      });
    }
    // Getter And Setter
    get value() {
      return this.#value;
    }
    set value(data) {
      if (this.#value == data)
        return;
      this.constrain(data);
      const previousValue = this.#value;
      if (data !== void 0)
        this.notify(`${this.name}.before`, this.#value, previousValue);
      this.#value = data;
      if (data !== void 0)
        this.notify(this.name, this.#value, previousValue);
    }
    // Install Observer Functionality
    #observers = {};
    observe(eventName, observerCallback, options = { autorun: true }) {
      if (typeof observerCallback !== "function")
        throw new TypeError("observer must be a function.");
      if (!Array.isArray(this.#observers[eventName]))
        this.#observers[eventName] = [];
      this.#observers[eventName].push(observerCallback);
      if (options.autorun && this.#value !== void 0)
        observerCallback(this.#value);
      return () => {
        console.log(`UNOBSERVING ${eventName}`);
        this.unobserve(eventName, observerCallback);
      };
    }
    unobserve(eventName, observerCallback) {
      this.#observers[eventName] = this.#observers[eventName].filter((obs) => obs !== observerCallback);
    }
    notify(eventName, eventData, ...extra) {
      if (Array.isArray(this.#observers[eventName])) {
        this.#observers[eventName].forEach((observerCallback) => observerCallback(eventData, ...extra));
      } else {
      }
    }
    status() {
      return {
        observerCount: Object.values(this.#observers).flat().length
      };
    }
  };
  var List = class {
    static {
      __name(this, "List");
    }
    name = null;
    #value = [];
    constraints = [];
    constructor(name2, value2) {
      this.name = name2;
      this.#value.push(...value2);
      this.constrain();
    }
    constrain(data, initialization) {
      if (initialization)
        return;
      for (const data2 of this.#value) {
        this.constraints.forEach(({ test, message }) => {
          const verdict = test(data2, this.#value);
          if (verdict?.error) {
            throw new Error(`\u{1F354} constraint error: ${message} - ${verdict.error} (attempted to set ${this.name} to ${data2})`);
          }
        });
      }
    }
    get value() {
      return this;
    }
    // Install Observer Functionality
    #observers = {};
    observe(eventName, observerCallback, options = { autorun: true, replay: false }) {
      if (typeof observerCallback !== "function")
        throw new TypeError("observer must be a function.");
      if (!Array.isArray(this.#observers[eventName]))
        this.#observers[eventName] = [];
      if (options.autorun) {
        if (eventName == this.name) {
          for (const item of this.#value) {
            observerCallback(item);
          }
        }
      }
      if (options.replay) {
        for (const item of this.#value) {
          observerCallback(item);
        }
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
      if (Array.isArray(this.#observers[eventName]))
        this.#observers[eventName].forEach((observerCallback) => observerCallback(eventData, ...extra));
    }
    status() {
      return {
        observerCount: Object.values(this.#observers).flat().length
      };
    }
    // Data Editing Functions
    create(...items) {
      for (const item of items) {
        this.constrain(item);
        this.#value.push(item);
        this.notify("created", item);
        this.notify("changed", this);
      }
    }
    remove(input) {
      let id2;
      if (typeof input === "string") {
        id2 = input;
      } else {
        if (!input.id)
          throw new Error("Only stingId and onbect with an id property is supported");
        id2 = input.id;
      }
      const item = this.#value.find((o) => o.id === id2);
      this.#value = this.#value.filter((o) => o !== item);
      this.notify("removed", item);
      this.notify("changed", this);
    }
    // Data Reading Functions
    [Symbol.iterator]() {
      return this.#value[Symbol.iterator]();
    }
    find(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.find(callback);
    }
    get(id2) {
      return this.#value.find((o) => o.id === id2);
    }
    map(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.map(callback);
    }
    reduce(callback, initialValue) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.reduce(callback, initialValue);
    }
    filter(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.filter(callback);
    }
    forEach(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.forEach(callback);
    }
    indexOf(item) {
      return this.#value.indexOf(item);
    }
    slice(...argv) {
      return this.#value.slice(...argv);
    }
    get length() {
      return this.#value.length;
    }
    get raw() {
      return this.#value;
    }
  };

  // abstract/Theme.js
  var Theme = class {
    static {
      __name(this, "Theme");
    }
    id = "theme-name";
  };

  // src/Themes.js
  var Themes = class {
    static {
      __name(this, "Themes");
    }
    observables = {
      theme: "obsidian",
      themes: [new themes.Nostromo({ subtle: true }), new themes.Obsidian({ subtle: true })]
    };
    constraints = {
      theme: {
        "all themes are lower-case": function(theme) {
          if (theme.match(/[A-Z]/)) {
            return { error: "theme name contains uppercase letters" };
          }
        },
        "specified theme does not exist": function(theme) {
          if (!this.themes.map((o) => o.id).includes(theme))
            return { error: "theme does not exist" };
        }
      },
      themes: {
        "theme is not a prototype of #abstract/Theme": function(v) {
          if (!Theme.prototype.isPrototypeOf(v))
            return { error: "must extend Theme" };
        }
      }
    };
    methods = {
      initialize() {
        this.on("theme.before", (id2) => {
        });
        this.on("theme", (id2, old) => {
          document.querySelector("html").dataset.uiTheme = id2;
        });
        this.on("themes.created", (list) => {
          p;
        });
        this.on("themes.removed", (list) => {
        });
        this.on("themes.changed", (list) => {
        });
      }
    };
  };

  // plug-ins/properties/PropertyList.js
  var PropertyList = class {
    static {
      __name(this, "PropertyList");
    }
    name = null;
    #value = [];
    constraints = [];
    constructor(name2, value2) {
      this.name = name2;
      this.#value.push(...value2);
      this.constrain();
    }
    constrain() {
      for (const item of this.#value) {
        this.constraints.forEach(({ test, message }) => {
          if (!test(item)) {
            throw new Error(`\u{1F354} constraint error: ${message} (attempted to set: ${value})`);
          }
        });
      }
    }
    // Install Observer Functionality
    #observers = {};
    observe(eventName, observerCallback, options = { autorun: true, replay: false }) {
      if (typeof observerCallback !== "function")
        throw new TypeError("observer must be a function.");
      if (!Array.isArray(this.#observers[eventName]))
        this.#observers[eventName] = [];
      if (options.autorun) {
        if (eventName == this.name) {
          for (const item of this.#value) {
            observerCallback(item);
          }
        }
      }
      if (options.replay) {
        for (const item of this.#value) {
          observerCallback(item);
        }
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
      if (Array.isArray(this.#observers[eventName]))
        this.#observers[eventName].forEach((observerCallback) => observerCallback(eventData, ...extra));
    }
    status() {
      return {
        observerCount: Object.values(this.#observers).flat().length
      };
    }
    // Data Editing Functions
    create(...items) {
      for (const item of items) {
        this.constrain(item);
        this.#value.push(item);
        this.notify("created", item);
        this.notify("changed", this);
      }
    }
    remove(item) {
      this.#value = this.#value.filter((o) => o.id !== item.id);
      this.notify("removed", item);
      this.notify("changed", this);
    }
    // Data Reading Functions
    [Symbol.iterator]() {
      return this.#value[Symbol.iterator]();
    }
    find(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.find(callback);
    }
    map(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.map(callback);
    }
    reduce(callback, initialValue) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.reduce(callback, initialValue);
    }
    filter(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.filter(callback);
    }
    forEach(callback) {
      if (typeof callback !== "function")
        throw new TypeError("Needs a function.");
      return this.#value.forEach(callback);
    }
    indexOf(item) {
      return this.#value.indexOf(item);
    }
    slice(...argv) {
      return this.#value.slice(...argv);
    }
    get length() {
      return this.#value.length;
    }
    get raw() {
      return this.#value;
    }
  };

  // plug-ins/boolean/index.js
  function intersection(a, b) {
    const response = /* @__PURE__ */ new Set();
    for (const item of a) {
      if (b.has(item))
        response.add(item);
    }
    return response;
  }
  __name(intersection, "intersection");
  function difference(a, b) {
    const response = /* @__PURE__ */ new Set();
    for (const item of a) {
      if (!b.has(item))
        response.add(item);
    }
    return response;
  }
  __name(difference, "difference");

  // plug-ins/node/Node.js
  var Node = class {
    static {
      __name(this, "Node");
    }
    state = {
      current: "initial",
      initial: {
        run: "initialize"
      }
    };
    constraints = {
      initialize: {
        "node origin is requred": function() {
          if (this.origin === void 0) {
            return { error: "node is missing origin" };
          }
          if (!(typeof this.origin !== "string" || typeof this.origin !== "number")) {
            return { error: "node origin must be a string" };
          }
        }
      }
    };
    properties = {
      id: null,
      type: null
    };
    observables = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      H: 0,
      r: 0,
      b: 0,
      p: 0,
      s: 0,
      selected: false,
      source: void 0,
      target: void 0,
      url: void 0,
      // JSON url
      src: void 0,
      // JSON url
      data: void 0
      // JSON data
    };
    methods = {
      assign(meta, data) {
        const nodeKeys = /* @__PURE__ */ new Set([...Object.keys(this.oo.specification.properties), ...Object.keys(this.oo.specification.observables)]);
        const metaKeys = /* @__PURE__ */ new Set([...Object.keys(meta)]);
        const commonProperties = intersection(nodeKeys, metaKeys);
        const newProperties = difference(metaKeys, commonProperties);
        for (const newProperty of newProperties) {
          this.oo.createObservable(newProperty, meta[newProperty]);
        }
        Object.assign(this, meta, { data });
      },
      toObject() {
        const meta = {};
        const data = this.data;
        const object = { meta, data };
        for (const [name2, value2] of Object.entries(this.oo.specification.properties)) {
          console.log(this[name2], name2, value2);
          if (this[name2] !== value2)
            meta[name2] = this[name2];
        }
        for (const [name2, value2] of Object.entries(this.oo.specification.observables).filter(([name3]) => !["data"].includes(name3))) {
          if (this[name2] !== value2)
            meta[name2] = this[name2];
        }
        for (const name2 of this.oo.newObservables) {
          meta[name2] = this[name2];
        }
        return object;
      },
      initialize() {
      },
      stop() {
      },
      destroy() {
        this.dispose();
      }
    };
  };

  // plug-ins/domek/index.js
  var update = /* @__PURE__ */ __name(function(elements, properties) {
    const els = Array.isArray(elements) ? elements : [elements];
    for (const el of els) {
      for (const key in properties) {
        let value2 = properties[key];
        if (key == "style" && typeof value2 == "object") {
          for (const name2 in value2) {
            el.style[name2] = value2[name2];
          }
          continue;
        } else if (typeof value2 == "object") {
          value2 = Object.entries(value2).map(([k, v]) => `${k}: ${v};`).join(" ");
        }
        if (el.namespaceURI == "http://www.w3.org/2000/svg") {
          el.setAttributeNS(null, key, value2);
        } else {
          el.setAttribute(key, value2);
        }
      }
    }
  }, "update");
  var svg = new Proxy({}, {
    get: function(target, property) {
      return function(properties, text2) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", property);
        update(el, properties);
        if (text2)
          el.appendChild(document.createTextNode(text2));
        return el;
      };
    }
  });
  var xhtml = new Proxy({}, {
    get: function(target, property) {
      return function(properties, text2) {
        const el = document.createElementNS("http://www.w3.org/1999/xhtml", property);
        update(el, properties);
        if (text2)
          el.appendChild(document.createTextNode(text2));
        return el;
      };
    }
  });
  var html = new Proxy({}, {
    get: function(target, property) {
      return function(properties, text2) {
        const el = document.createElement(property);
        update(el, properties);
        if (text2)
          el.appendChild(document.createTextNode(text2));
        return el;
      };
    }
  });
  var text = /* @__PURE__ */ __name(function(text2) {
    return document.createTextNode(text2);
  }, "text");
  function front(element) {
    const parentElement = element.parentNode;
    parentElement.removeChild(element);
    parentElement.appendChild(element);
  }
  __name(front, "front");
  function click(element, callback) {
    element.addEventListener("mouseup", handler);
    function handler(event2) {
      callback(event2);
    }
    __name(handler, "handler");
    return () => element.removeEventListener("mouseup", handler);
  }
  __name(click, "click");

  // plug-ins/keyboard/index.js
  var Keyboard = class {
    static {
      __name(this, "Keyboard");
    }
    component;
    handle;
    // handlers
    keyDownHandler;
    mouseUpHandler;
    constructor({ component, handle }) {
      if (!component)
        throw new Error("component is required");
      if (!handle)
        throw new Error("handle is required");
      this.component = component;
      this.handle = handle;
      this.mount();
    }
    mount() {
      this.keyDownHandler = (e) => {
        if (event.isComposing || event.keyCode === 229) {
          return;
        }
        console.log("plug-ins/keyboard/index.js", e.code);
        if (e.code === "Delete")
          globalThis.project.removeSelected();
        if (e.code === "Enter")
          globalThis.project.save();
      };
      this.handle.addEventListener("keydown", this.keyDownHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.keyDownHandler);
    }
  };

  // plug-ins/pan/index.js
  var Pan = class {
    static {
      __name(this, "Pan");
    }
    component;
    handle;
    mouseDownHandler;
    mouseMoveHandler;
    mouseUpHandler;
    startX = 0;
    startY = 0;
    dragging = false;
    constructor({ component, handle, zone }) {
      this.component = component;
      this.handle = handle;
      this.zone = zone;
      this.mount();
    }
    mount() {
      this.mouseDownHandler = (e) => {
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.dragging = true;
        this.component.iframe = false;
        this.zone.addEventListener("mousemove", this.mouseMoveHandler);
      };
      this.mouseMoveHandler = (e) => {
        let dx = 0;
        let dy = 0;
        dx = e.clientX - this.startX;
        dy = e.clientY - this.startY;
        dx = dx + this.component.panX;
        dy = dy + this.component.panY;
        this.component.panX = dx;
        this.component.panY = dy;
        dx = 0;
        dy = 0;
        this.startX = e.clientX;
        this.startY = e.clientY;
      };
      this.mouseUpHandler = (e) => {
        this.dragging = false;
        this.component.iframe = true;
        this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      };
      this.handle.addEventListener("mousedown", this.mouseDownHandler);
      this.zone.addEventListener("mouseup", this.mouseUpHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.mouseDownHandler);
      this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      this.zone.removeEventListener("mouseup", this.mouseUpHandler);
    }
  };

  // plug-ins/zoom/index.js
  var Zoom = class {
    static {
      __name(this, "Zoom");
    }
    component;
    element;
    zone;
    magnitude = 1e-3;
    min = 0.1;
    max = 10;
    constructor({ component, element, zone }) {
      this.component = component;
      this.element = element;
      this.zone = zone;
      this.mount();
    }
    mount() {
      this.wheelHandler = (e) => {
        const zoom0 = this.component.zoom;
        const panX0 = this.component.panX;
        const panY0 = this.component.panY;
        const cursorX = e.x;
        const cursorY = e.y;
        let zoom1;
        zoom1 = zoom0 + -e.deltaY * (this.magnitude * zoom0);
        zoom1 = Math.min(Math.max(this.min, zoom1), this.max);
        let panX1;
        let panY1;
        panX1 = cursorX - zoom1 / zoom0 * (cursorX - panX0);
        panY1 = cursorY - zoom1 / zoom0 * (cursorY - panY0);
        this.component.zoom = zoom1;
        this.component.panX = panX1;
        this.component.panY = panY1;
      };
      this.zone.addEventListener("wheel", this.wheelHandler, { passive: true });
      this.element.addEventListener("wheel", this.wheelHandler, { passive: true });
    }
    destroy() {
      this.removeStartedObserver();
      this.zone.removeEventListener("wheel", this.wheelHandler);
      this.element.removeEventListener("wheel", this.wheelHandler);
    }
  };

  // plug-ins/layout-manager/index.js
  var BOTH_SIDES = 2;
  var Layout = class {
    static {
      __name(this, "Layout");
    }
    parent;
    source;
    constructor(parent, { source } = { source: "children" }) {
      this.parent = parent;
      this.source = source;
    }
    manage(child) {
    }
    calculateChildW() {
      return 320 * Math.random();
    }
    calculateH() {
      return 200 * Math.random();
    }
    calculateChildX(parent, child) {
      return 800 * Math.random();
    }
    calculateChildY(parent, child) {
      return 600 * Math.random();
    }
    above(parent, child) {
      return parent[this.source].slice(0, parent[this.source].indexOf(child));
    }
    #cleanup = [];
    cleanup(...arg) {
      this.#cleanup.push(...arg);
    }
  };
  var VerticalLayout = class extends Layout {
    static {
      __name(this, "VerticalLayout");
    }
    manage(child) {
      child.x = this.calculateChildX(child);
      child.y = this.calculateChildY(child);
      child.w = this.calculateChildW(child);
      this.parent.on("x", () => child.x = this.calculateChildX(child));
      this.parent.on("y", () => child.y = this.calculateChildY(child));
      this.parent.on("w", () => child.w = this.calculateChildW(child));
      child.on("h", () => this.parent.h = this.calculateH());
      this.parent.on("h", () => child.y = this.calculateChildY(child));
    }
    calculateChildW(child) {
      const response = this.parent.w - (this.parent.b + this.parent.p) * BOTH_SIDES;
      return response;
    }
    calculateH() {
      let heightOfChildren = 0;
      const children = this.parent[this.source];
      heightOfChildren = children.reduce((total, c) => total + c.h, 0) + this.parent.s * 2 * (children.length > 0 ? children.length - 1 : 0);
      let response = this.parent.b + this.parent.p + // this.parent.H + // NOT A MISTAKE design can hold a base h that is used in calculations
      heightOfChildren + this.parent.p + this.parent.b;
      if (response < this.parent.H)
        response = this.parent.H;
      return response;
    }
    calculateChildX() {
      const response = this.parent.x + // use my own x
      this.parent.b + // add border
      this.parent.p;
      return response;
    }
    calculateChildY(child) {
      const response = this.parent.y + this.parent.b + this.parent.p + this.above(this.parent, child).reduce((total, child2) => total + child2.h, 0) + this.parent.s * 2 * this.above(this.parent, child).length;
      return response;
    }
  };
  var HorizontalLayout = class extends Layout {
    static {
      __name(this, "HorizontalLayout");
    }
    manage(child) {
      const children = this.parent[this.source];
      const childCount = children.length;
      const siblingCount = this.above(this.parent, child).length;
      child.x = this.calculateChildX(child);
      child.y = this.calculateChildY(child);
      child.w = this.calculateChildW(child);
      this.parent.on("x", () => child.x = this.calculateChildX(child));
      this.parent.on("y", () => child.y = this.calculateChildY(child));
      this.parent.on("h", () => child.y = this.calculateChildY(child));
      this.parent.on("children.changed", (list) => list.forEach((child2) => {
        child2.w = this.calculateChildW(child2);
        child2.x = this.calculateChildX(child2);
      }));
      this.parent.on("w", () => {
        child.w = this.calculateChildW(child);
        child.x = this.calculateChildX(child);
      });
      child.on("h", () => this.parent.h = this.calculateH());
    }
    calculateChildX(child) {
      const response = this.parent.x + this.parent.b + this.parent.p + this.above(this.parent, child).reduce((total, child2) => total + child2.w, 0) + this.parent.s * 2 * this.above(this.parent, child).length;
      return response;
    }
    calculateChildW1(child) {
      const children = this.parent[this.source];
      const childCount = children.length;
      const siblingCount = this.above(this.parent, child).length;
      let response = this.parent.w / childCount;
      return response;
    }
    calculateChildW(child) {
      if (!(child.W === void 0))
        return child.W < 1 ? this.parent.w * child.W : child.W;
      const children = this.parent[this.source];
      let softElements = children.filter((child2) => child2.W === void 0);
      let hardElements = children.filter((child2) => !(child2.W === void 0));
      let hardSpace = hardElements.reduce((total, child2) => total + (child2.W < 1 ? this.parent.w * child2.W : child2.W), 0);
      let availableSoftSpace = this.parent.w - hardSpace;
      let softUnit = availableSoftSpace / (softElements.length || 1);
      return softUnit;
    }
    calculateChildY(child) {
      const response = this.parent.y + this.parent.b + this.parent.p;
      return response;
    }
    calculateH() {
      let heightOfChildren = 0;
      const children = this.parent[this.source];
      heightOfChildren = children.reduce((max, c) => c.h > max ? c.h : max, 0);
      let response = this.parent.b + this.parent.p + // this.parent.H + // NOT A MISTAKE design can hold a base h that is used in calculations
      heightOfChildren + this.parent.p + this.parent.b;
      if (response < this.parent.H)
        response = this.parent.H;
      return response;
    }
  };
  var RelativeLayout = class extends Layout {
    static {
      __name(this, "RelativeLayout");
    }
    children = /* @__PURE__ */ new WeakMap();
    manage(child) {
      if (!child.node)
        throw new Error("RelativeLayout requires that all children have a valid .node attached.");
      this.parent.on("x", () => child.x = this.calculateChildX(child));
      this.parent.on("y", () => child.y = this.calculateChildY(child));
      child.node.on("x", () => child.x = this.calculateChildX(child));
      child.node.on("y", () => child.y = this.calculateChildY(child));
    }
    calculateChildX(child) {
      return this.parent.x + child.node.x;
    }
    calculateChildY(child) {
      return this.parent.y + child.node.y;
    }
  };
  var AnchorLayout = class extends Layout {
    static {
      __name(this, "AnchorLayout");
    }
    manage(child) {
      child.x = this.calculateChildX(child);
      child.y = this.calculateChildY(child);
      this.parent.on("x", () => child.x = this.calculateChildX(child));
      this.parent.on("y", () => child.y = this.calculateChildY(child));
      this.parent.on("w", () => child.x = this.calculateChildX(child));
      this.parent.on("h", () => child.y = this.calculateChildY(child));
    }
    calculateChildX(child) {
      if (!child.side) {
        return this.parent.x - child.r - child.s;
      } else {
        return this.parent.x + this.parent.w + child.r + child.s;
      }
      this.parent.b + this.parent.p;
    }
    calculateChildY(child) {
      const response = this.parent.y + this.parent.b + this.parent.p + child.r + this.above(this.parent, child).filter((o) => o.side == child.side).reduce((total, child2) => total + child2.h, 0) + this.parent.s * 2 * this.above(this.parent, child).length;
      return response;
    }
    calculateChildW(child) {
    }
  };

  // plug-ins/windows/Component.js
  var Component = class {
    static {
      __name(this, "Component");
    }
    properties = {
      id: uuid(),
      el: {}
      // bag of elements
    };
    observables = {
      parent: void 0,
      // it may be needed to access parent from a control
      scene: void 0,
      // remember parent sets the scene, this child must adds its own .g to it, then its own g becomes the scene for children
      node: void 0,
      // data node
      // node has data, we keep it here at the root of component
      data: void 0,
      // the data that is in the node
      selected: false,
      // selection manager feature
      name: "un-named",
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      H: 0,
      // min h
      r: 0,
      // border radius
      b: 0,
      // border
      p: 0,
      // padding
      s: 0
      // spacer/gap
    };
    constraints = {
      scene: {
        ".scene must be an instance of HTMLElement": function() {
          if (!(obj instanceof HTMLElement))
            return { error: "Not an HTMLElement" };
        }
      },
      mount: {
        ".scene is required to start": function() {
          if (!this.data) {
            return { error: "data missing" };
          }
        },
        ".node is required to start": function() {
          if (!this.node) {
            return { error: "node missing" };
          }
        },
        ".node must be an observable object": function() {
          if (!this.node.on) {
            return { error: ".on missing on .node" };
          }
        }
      }
    };
    traits = {
      //
      // appendMain(){
      //   Object.values(this.el).forEach(el => this.scene.appendChild(el));
      // },
      allAnchors(parent, list = []) {
        if (parent?.children) {
          for (const child of parent.children) {
            if (child.anchors?.length) {
              for (const anchor of child.anchors) {
                list.push(anchor);
              }
            }
            this.allAnchors(child, list);
          }
        }
        return list;
      },
      appendElements() {
        Object.values(this.el).forEach((el) => this.scene.appendChild(el));
      },
      removeElements() {
        Object.values(this.el).forEach((el) => el.remove());
      },
      getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
      },
      pipe(name2) {
        const id2 = [name2, this.getRootContainer().id].join(":");
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        const pipe = origin.root.pipes.get(id2);
        return pipe;
      },
      getRootContainer() {
        let response = null;
        if (!this.parent) {
          response = this;
        } else if (!this.parent.getRootContainer) {
          response = this;
        } else if (this.contain) {
          response = this;
        } else {
          response = this.parent.getRootContainer();
        }
        return response;
      },
      getAbsoluteRoot() {
        let response = null;
        if (!this.parent) {
          response = this;
        } else {
          response = this.parent.getAbsoluteRoot();
        }
        return response;
      }
    };
    methods = {
      initialize() {
        this.on("node", (node) => {
          node.on("x", (x) => this.x = x);
          node.on("y", (y) => this.y = y);
          node.on("w", (w) => this.w = w);
          node.on("h", (h) => this.h = h);
          node.on("H", (H) => this.H = H);
          node.on("r", (r) => this.r = r);
          node.on("b", (b) => this.b = b);
          node.on("p", (p2) => this.p = p2);
          node.on("s", (s) => this.s = s);
          node.on("data", (data) => this.data = data);
        });
      }
    };
  };

  // plug-ins/windows/Container.js
  var Container = class {
    static {
      __name(this, "Container");
    }
    static extends = [Component];
    properties = {
      layout: null
    };
    observables = {
      children: []
    };
    traits = {
      draw() {
        this.el.Container = svg.rect({
          name: this.name,
          class: "editor-container",
          ry: this.r,
          "stroke-width": 2,
          "vector-effect": "non-scaling-stroke",
          // set initial values
          // these are special, handeled by the layout manager
          // NOTE: these are observables, getter returns a value, setter notifies listeners, and you can ```this.observe('x', v=>{...})```
          width: this.w,
          height: this.h,
          x: this.x,
          y: this.y
        });
        this.on("name", (name2) => update(this.el.Container, { name: name2 }));
        this.on("w", (width) => update(this.el.Container, { width }));
        this.on("h", (height) => update(this.el.Container, { height }));
        this.on("x", (x) => update(this.el.Container, { x }));
        this.on("y", (y) => update(this.el.Container, { y }));
        this.on("r", (ry) => update(this.el.Container, { ry }));
        this.appendElements();
      }
    };
    methods = {
      initialize() {
        this.on("children.created", (child) => {
          child.scene = this.scene;
          child.start();
          this.layout.manage(child);
        }, { replay: true });
        this.on("children.removed", (child) => {
          child.stop();
          this.layout.forget(child);
        });
      },
      mount() {
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/windows/Vertical.js
  var Vertical = class {
    static {
      __name(this, "Vertical");
    }
    static extends = [Container];
    methods = {
      initialize() {
        this.layout = new VerticalLayout(this);
      }
    };
  };

  // plug-ins/select/index.js
  var Select = class {
    static {
      __name(this, "Select");
    }
    component;
    handle;
    // handlers
    mouseDownHandler;
    mouseUpHandler;
    constructor({ component, handle }) {
      if (!component)
        throw new Error("component is required");
      if (!handle)
        throw new Error("handle is required");
      this.component = component;
      this.handle = handle;
      this.mount();
    }
    mount() {
      this.mouseDownHandler = (e) => {
        const multiSelect = e.ctrlKey;
        this.component.selected = !this.component.selected;
        if (multiSelect) {
        } else {
          if (this.component.selected) {
            for (const item of globalThis.project.applications) {
              if (this.component.id !== item.id) {
                item.selected = false;
              }
            }
            for (const item of globalThis.project.anchors) {
              if (this.component.id !== item.id) {
                item.selected = false;
              }
            }
          }
        }
      };
      this.handle.addEventListener("mousedown", this.mouseDownHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.mouseDownHandler);
    }
  };

  // plug-ins/connect/index.js
  var uuid2 = bundle["uuid"];
  var Connect = class {
    static {
      __name(this, "Connect");
    }
    parent;
    anchor;
    zone;
    mouseDownHandler;
    mouseMoveHandler;
    mouseUpHandler;
    startX = 0;
    startY = 0;
    dragging = false;
    constructor({ parent, anchor, zone }) {
      if (!parent)
        throw new Error("parent is required");
      if (!anchor)
        throw new Error("anchor is required");
      if (!zone)
        throw new Error("zone is required");
      this.parent = parent;
      this.anchor = anchor;
      this.zone = zone;
      this.mount();
    }
    mount() {
      this.mouseDownHandler = (e) => {
        this.line = svg.line({
          class: "editor-anchor-line",
          style: {
            "pointer-events": "none"
            /* required, otherwise the line will mousedrop on it self */
          },
          "vector-effect": "non-scaling-stroke"
        });
        this.anchor.scene.appendChild(this.line);
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.dragging = true;
        globalThis.project.iframe = false;
        this.zone.addEventListener("mousemove", this.mouseMoveHandler);
      };
      this.mouseMoveHandler = (e) => {
        let dx = 0;
        let dy = 0;
        dx = e.clientX - this.startX;
        dy = e.clientY - this.startY;
        dx = dx + this.anchor.x * globalThis.project.zoom;
        dy = dy + this.anchor.y * globalThis.project.zoom;
        dx = dx / globalThis.project.zoom;
        dy = dy / globalThis.project.zoom;
        this.geometry = {
          // origin of th eindicator line is the port
          x1: this.anchor.x,
          y1: this.anchor.y,
          // target of the indicator line is where the cursor is dragging
          x2: dx,
          y2: dy
        };
        update(this.line, this.geometry);
        dx = 0;
        dy = 0;
      };
      this.mouseUpHandler = (e) => {
        if (e.target == this.anchor) {
          console.log("SELF");
        }
        const isOverAnotherPort = this.dragging && e?.target?.classList?.contains("editor-anchor");
        const isOverBackground = this.dragging && e?.target?.classList?.contains("editor-background");
        const origin = this.anchor.getRootContainer().node.origin;
        if (isOverAnotherPort) {
          const source = [this.anchor.name, this.anchor.getRootContainer().node.id].join(":");
          const target = e.target.dataset.target;
          if (source != target) {
            globalThis.project.createNode({ meta: { id: uuid2(), type: "Line", source, target, origin }, data: {} });
          }
        }
        if (isOverBackground) {
          const junctionId = uuid2();
          globalThis.project.createNode({ meta: { id: junctionId, type: "Junction", x: this.geometry.x2, y: this.geometry.y2, origin }, data: {} });
          const source = [this.anchor.name, this.anchor.getRootContainer().node.id].join(":");
          const target = ["input", junctionId].join(":");
          globalThis.project.createNode({ meta: { id: uuid2(), type: "Line", source, target, origin }, data: {} });
        }
        if (this.line)
          this.line.remove();
        this.dragging = false;
        globalThis.project.iframe = true;
        this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      };
      this.anchor.pad.addEventListener("mousedown", this.mouseDownHandler);
      this.zone.addEventListener("mouseup", this.mouseUpHandler);
    }
    destroy() {
      this.anchor.pad.removeEventListener("mousedown", this.mouseDownHandler);
      this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      this.zone.removeEventListener("mouseup", this.mouseUpHandler);
    }
  };

  // plug-ins/windows/Anchor.js
  var Anchor = class {
    static {
      __name(this, "Anchor");
    }
    static extends = [Component];
    properties = {
      pad: null
    };
    observables = {
      side: 0,
      color: "transparent"
    };
    constraints = {
      mount: {
        ".scene is required": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
        this.r = 8;
        this.s = 4;
        this.w = this.r * 2;
        this.h = this.r * 2 + this.s;
        this.x = 0;
        this.y = 0;
      },
      mount() {
        this.el.Primary = svg.circle({
          name: this.name,
          class: "editor-anchor",
          "vector-effect": "non-scaling-stroke",
          r: this.r,
          cx: this.x,
          cy: this.y
        });
        this.on("selected", (selected) => selected ? this.el.Primary.classList.add("selected") : this.el.Primary.classList.remove("selected"));
        const select = new Select({
          component: this,
          handle: this.el.Primary
        });
        this.destructable = () => select.destroy();
        this.el.Primary.dataset.target = [this.name, this.getRootContainer().id].join(":");
        this.pad = this.el.Primary;
        this.on("name", (name2) => update(this.el.Primary, { name: name2 }));
        this.on("x", (cx) => update(this.el.Primary, { cx }));
        this.on("y", (cy) => update(this.el.Primary, { cy }));
        this.on("r", (r) => update(this.el.Primary, { r }));
        this.appendElements();
        const connect = new Connect({
          anchor: this,
          zone: window,
          parent: this
        });
        this.destructable = () => connect.destroy();
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/pipe/Pipe.js
  var EventEmitter = bundle["events"];
  var Pipe = class extends EventEmitter {
    static {
      __name(this, "Pipe");
    }
    id;
    direction;
    constructor(id2, direction) {
      super();
      this.id = id2;
      this.direction = direction;
    }
    input(data) {
      console.log("pipe got input", data);
    }
  };

  // plug-ins/windows/Control.js
  var Control = class {
    static {
      __name(this, "Control");
    }
    static extends = [Component];
    properties = {
      anchorage: null
    };
    observables = {
      anchors: []
    };
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
      },
      mount() {
        this.anchorage = new AnchorLayout(this, { source: "anchors" });
        this.on("anchors.created", (anchor) => {
          anchor.start();
          this.createPipe(anchor.name, anchor.side);
          this.anchorage.manage(anchor);
        }, { replay: true });
        this.on("anchors.removed", (anchor) => {
          anchor.stop();
          this.removePipe(anchor.name);
          this.removeControlAnchor(anchor.id);
          this.anchorage.forget(anchor);
        });
        this.appendElements();
      },
      createPipe(name2, direction) {
        const id2 = [name2, this.getRootContainer().id].join(":");
        const pipe = new Pipe(id2, direction);
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        origin.root.pipes.create(pipe);
      },
      removePipe(name2) {
        const id2 = [name2, this.getRootContainer().id].join(":");
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        origin.root.pipes.get(id2).stop();
        origin.root.pipes.remove(id2);
      },
      createControlAnchor({ name: name2, side }) {
        if (!name2)
          throw new Error(`It is not possible to create an anchor without an anchor name.`);
        if (!side === void 0)
          throw new Error(`It is not possible to create an anchor without specifying a side, 0 or 1.`);
        const id2 = [name2, this.getRootContainer().id].join(":");
        const anchor = new Instance(Anchor, { id: id2, name: name2, side, parent: this, scene: this.scene });
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        origin.root.anchors.create(anchor);
        this.anchors.create(anchor);
      },
      removeControlAnchor(id2) {
        this.anchors.remove(id2);
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
        origin.root.anchors.remove(id2);
      },
      destroy() {
        console.warn("TODO: DESTROY ALL ANCHORS");
        console.warn("TODO: STOP ANCHORAGE");
        this.removeElements();
      }
    };
  };

  // plug-ins/windows/Horizontal.js
  var Horizontal = class {
    static {
      __name(this, "Horizontal");
    }
    static extends = [Container];
    methods = {
      initialize() {
        this.layout = new HorizontalLayout(this);
      }
    };
  };

  // plug-ins/windows/Label.js
  var Label = class {
    static {
      __name(this, "Label");
    }
    static extends = [Control];
    properties = {
      handle: null
    };
    observables = {
      text: ""
    };
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
        this.s = 3;
      },
      mount() {
        this.el.Container = svg.rect({
          name: this.name,
          class: "editor-label",
          "vector-effect": "non-scaling-stroke",
          ry: this.r,
          // set initial values
          // these are special, handeled by the layout manager
          // NOTE: these are observables, getter returns a value, setter notifies listeners, and you can ```this.observe('x', v=>{...})```
          width: this.w,
          height: this.h,
          x: this.x,
          y: this.y
        });
        this.handle = this.el.Container;
        this.el.ClipPath = svg.clipPath({
          id: `clip-path-${this.id}`
        });
        const clipPathRect = svg.rect({
          x: this.x,
          y: this.y,
          width: this.w,
          height: this.h
        });
        this.el.ClipPath.appendChild(clipPathRect);
        this.el.Caption = svg.text({
          name: this.name,
          class: "editor-label-text",
          "dominant-baseline": "hanging",
          "clip-path": `url(#clip-path-${this.id})`,
          x: this.x,
          y: this.y
        });
        const updateZUI = /* @__PURE__ */ __name(function(el, zuiAttributes, standardAttributes) {
          if (globalThis.project.zoom > 1) {
            update(el, zuiAttributes);
          } else {
            update(el, standardAttributes);
          }
        }, "updateZUI");
        globalThis.project.on("zoom", (v) => requestAnimationFrame(() => {
          updateZUI(this.el.Caption, { style: { scale: 1 / globalThis.project.zoom }, x: (this.x + this.s) * globalThis.project.zoom, y: (this.y + this.s) * globalThis.project.zoom }, { style: { scale: 1 }, x: this.x + this.s, y: this.y + this.s });
          updateZUI(clipPathRect, { x: this.x * globalThis.project.zoom, y: this.y * globalThis.project.zoom, width: this.w * globalThis.project.zoom, height: this.h * globalThis.project.zoom }, { x: this.x, y: this.y, width: this.w, height: this.h });
        }));
        const captionText = text(this.text);
        this.el.Caption.appendChild(captionText);
        this.on("selected", (selected) => selected ? this.el.Container.classList.add("selected") : this.el.Container.classList.remove("selected"));
        this.on("name", (name2) => update(this.el.Container, { name: name2 }));
        this.on("w", (width) => update(this.el.Container, { width }));
        this.on("h", (height) => update(this.el.Container, { height }));
        this.on("x", (x) => update(this.el.Container, { x }));
        this.on("y", (y) => update(this.el.Container, { y }));
        this.on("r", (ry) => update(this.el.Container, { ry }));
        this.on("text", (text2) => captionText.nodeValue = text2);
        this.any(["x", "y"], ({ x, y }) => updateZUI(this.el.Caption, { x: (x + this.s) * globalThis.project.zoom, y: (y + this.s) * globalThis.project.zoom }, { style: { scale: 1 }, x: x + this.s, y: y + this.s }));
        this.any(["x", "y", "w", "h"], ({ x, y, w: width, h: height }) => updateZUI(clipPathRect, { x: x * globalThis.project.zoom, y: y * globalThis.project.zoom, width: width * globalThis.project.zoom, height: this.h * globalThis.project.zoom }, { x, y, width, height }));
        this.appendElements();
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/nest/index.js
  var typeOf = /* @__PURE__ */ __name(function(variable) {
    if (Array.isArray(variable))
      return "Array";
    if (typeof variable === "function")
      return "Function";
    if (Object(variable) === variable)
      return "Object";
  }, "typeOf");
  var byType = /* @__PURE__ */ __name(function(input) {
    const response = {};
    for (const variable of input) {
      response[typeOf(variable)] = variable;
    }
    return response;
  }, "byType");
  function nest(Type, ...input) {
    if (!Type)
      return;
    const { Object: attr, Array: children, Function: init } = byType(input);
    const instance = new Instance(Type, attr);
    if (init)
      init(instance, this ? this.parent : null);
    return [instance, children?.map((child) => nest.bind({ parent: instance })(...child)).map(([ins, chi]) => chi ? [ins, chi] : ins)];
  }
  __name(nest, "nest");

  // plug-ins/windows/Caption.js
  var Caption = class {
    static {
      __name(this, "Caption");
    }
    static extends = [Control];
    properties = {
      handle: null
    };
    observables = {
      text: ""
    };
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
      },
      mount() {
        this.createControlAnchor({ name: "input", side: 0 });
        this.createControlAnchor({ name: "output", side: 1 });
        const [horizontal, [info1, info2]] = nest(Horizontal, { parent: this, scene: this.scene }, [
          [Label, { h: 24, text: this.text, parent: this }, (c, p2) => p2.children.create(c)],
          [Label, { h: 24, W: 24, text: "^", parent: this }, (c, p2) => p2.children.create(c)]
        ], (c) => {
          this.destructable = () => {
            c.stop();
            c.destroy();
          };
        });
        this.handle = info1.el.Container;
        horizontal.start();
        this.on("selected", (selected) => selected ? info1.el.Container.classList.add("selected") : info1.el.Container.classList.remove("selected"));
        this.on("text", (text2) => info1.text = text2);
        this.any(["x", "y", "w", "h"], ({ x, y, w, h }) => Object.assign(horizontal, { x, y, w, h }));
        let maximizer;
        let maximized = false;
        let restoreWindow = {};
        let restoreZoomPan = {};
        this.disposable = click(info2.handle, (e) => {
          console.log("maximized", maximized);
          if (maximized) {
            console.log("MINIMIZE", maximizer);
            maximizer.map((a) => a());
            maximized = false;
            Object.assign(this.getRootContainer(), restoreWindow);
            Object.assign(globalThis.project, restoreZoomPan);
          } else {
            console.log("MAXIMIZE!");
            restoreWindow = {
              x: this.getRootContainer().x,
              y: this.getRootContainer().y,
              w: this.getRootContainer().w,
              h: this.getRootContainer().h
            };
            restoreZoomPan = {
              panX: globalThis.project.panX,
              panY: globalThis.project.panY,
              zoom: globalThis.project.zoom
            };
            const handler = /* @__PURE__ */ __name(() => {
              this.getRootContainer().x = 0 - globalThis.project.panX / globalThis.project.zoom;
              this.getRootContainer().y = 0 - globalThis.project.panY / globalThis.project.zoom;
              this.getRootContainer().w = globalThis.project.w / globalThis.project.zoom;
              this.getRootContainer().h = globalThis.project.h / globalThis.project.zoom;
            }, "handler");
            maximizer = globalThis.project.any(["zoom", "panX", "panY", "w", "h"], handler);
            handler();
            console.log("maximizer", maximizer);
            maximized = true;
          }
          console.log({
            x: this.getRootContainer().x,
            y: this.getRootContainer().y,
            w: this.getRootContainer().w,
            h: this.getRootContainer().h
          });
        });
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/move/index.js
  var Move = class {
    static {
      __name(this, "Move");
    }
    component;
    window;
    handle;
    zone;
    mouseDownHandler;
    mouseMoveHandler;
    mouseUpHandler;
    previousX = 0;
    previousY = 0;
    dragging = false;
    constructor({ component, window: window2, handle, zone }) {
      if (!component)
        throw new Error("component is required");
      if (!handle)
        throw new Error("handle is required");
      if (!window2)
        throw new Error("window is required");
      if (!zone)
        throw new Error("zone is required");
      this.component = component;
      this.handle = handle;
      this.window = window2;
      this.zone = zone;
      this.mount();
    }
    mount() {
      this.mouseDownHandler = (e) => {
        this.previousX = e.screenX;
        this.previousY = e.screenY;
        this.dragging = true;
        globalThis.project.iframe = false;
        this.zone.addEventListener("mousemove", this.mouseMoveHandler);
      };
      this.mouseMoveHandler = (e) => {
        const movementX = this.previousX - e.screenX;
        const movementY = this.previousY - e.screenY;
        this.component.node.x = this.component.node.x - movementX / globalThis.project.zoom;
        this.component.node.y = this.component.node.y - movementY / globalThis.project.zoom;
        this.previousX = e.screenX;
        this.previousY = e.screenY;
      };
      this.mouseUpHandler = (e) => {
        this.dragging = false;
        globalThis.project.iframe = true;
        this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      };
      this.handle.addEventListener("mousedown", this.mouseDownHandler);
      this.zone.addEventListener("mouseup", this.mouseUpHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.mouseDownHandler);
      this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      this.zone.removeEventListener("mouseup", this.mouseUpHandler);
    }
  };

  // plug-ins/focus/index.js
  var Focus = class {
    static {
      __name(this, "Focus");
    }
    component;
    handle;
    // handlers
    mouseDownHandler;
    mouseUpHandler;
    constructor({ component, handle }) {
      if (!component)
        throw new Error("component is required");
      if (!handle)
        throw new Error("handle is required");
      this.component = component;
      this.handle = handle;
      this.mount();
    }
    mount() {
      this.mouseDownHandler = (e) => {
        front(this.component.scene);
      };
      this.handle.addEventListener("mousedown", this.mouseDownHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.mouseDownHandler);
    }
  };

  // plug-ins/windows/Window.js
  var Window = class {
    static {
      __name(this, "Window");
    }
    static extends = [Vertical];
    observables = {
      caption: "Untitled"
    };
    properties = {
      streams: /* @__PURE__ */ new Map(),
      contain: true
    };
    methods = {
      initialize() {
        if (!this.oo)
          throw new Error("Window oo Not Found");
      },
      mount() {
        this.draw();
        let caption = new Instance(Caption, { h: 24, text: this.caption });
        this.on("caption", (v) => caption.text = v);
        this.createWindowComponent(caption);
        this.on("node", (node) => {
          node.on("caption", (caption2) => this.caption = caption2);
        });
        const move = new Move({
          component: this,
          handle: caption.handle,
          window: this,
          zone: window
        });
        this.destructable = () => move.destroy();
        const focus2 = new Focus({
          component: this,
          handle: this.scene
          // set to caption above to react to window captions only
        });
        this.destructable = () => focus2.destroy();
        const select = new Select({
          component: this,
          handle: caption.handle
        });
        this.destructable = () => focus2.destroy();
        this.on("selected", (selected) => caption.selected = selected);
      },
      createWindowComponent(component) {
        component.parent = this;
        this.children.create(component);
      }
    };
    constraints = {
      // NOTE: TODO ITEM BELOW
      // TODO: add method constraints this will requre gathering all constraints from each chain item
      // createWindowComponent: {
      //   'object must be based on Component': function(v){
      //     console.log('YYY', v);
      //     // if(! Theme.prototype.isPrototypeOf(v) ) return {error:'must extend Theme'};
      //   }
      // }
    };
  };

  // plug-ins/windows/Junction.js
  var Junction = class {
    static {
      __name(this, "Junction");
    }
    static extends = [Control];
    properties = {
      handle: null
    };
    observables = {};
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
        this.w = 0;
        this.h = 0;
        this.r = 12;
      },
      mount() {
        this.el.Primary = svg.circle({
          name: this.name,
          class: "editor-junction",
          "vector-effect": "non-scaling-stroke",
          r: this.r,
          width: this.w,
          height: this.h,
          cx: this.x,
          cy: this.y
        });
        this.on("selected", (selected) => selected ? this.el.Primary.classList.add("selected") : this.el.Primary.classList.remove("selected"));
        const move = new Move({
          component: this,
          handle: this.el.Primary,
          window: this,
          zone: window
        });
        this.destructable = () => move.destroy();
        const focus2 = new Focus({
          component: this,
          handle: this.scene
          // set to caption above to react to window captions only
        });
        this.destructable = () => focus2.destroy();
        const select = new Select({
          component: this,
          handle: this.el.Primary
        });
        this.destructable = () => select.destroy();
        this.appendElements();
        const inputAnchor = this.createControlAnchor({ name: "input", side: 0, r: 4 });
        const outputAnchor = this.createControlAnchor({ name: "output", side: 1, r: 4 });
        this.pipe("input").on("data", (data) => this.pipe("output").emit("data", data));
        this.on("name", (name2) => update(this.el.Primary, { name: name2 }));
        this.on("x", (cx) => update(this.el.Primary, { cx }));
        this.on("y", (cy) => update(this.el.Primary, { cy }));
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/geometrique/midpoint.js
  function midpoint({ x1, y1, x2, y2 }) {
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    return { cx, cy };
  }
  __name(midpoint, "midpoint");

  // plug-ins/geometrique/edgepoint.js
  function edgepoint(cx, cy, r, x1, y1, x2, y2) {
    const angleRadians = Math.atan2(y2 - y1, x2 - x1);
    const x = cx + r * Math.cos(angleRadians);
    const y = cy + r * Math.sin(angleRadians);
    return [x, y];
  }
  __name(edgepoint, "edgepoint");

  // plug-ins/windows/Line.js
  var Line = class {
    static {
      __name(this, "Line");
    }
    static extends = [Component];
    properties = {};
    observables = {
      source: null,
      target: null,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
    };
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
      },
      mount() {
        this.el.Primary = svg.line({
          name: this.name,
          class: "editor-line",
          "vector-effect": "non-scaling-stroke"
        });
        this.el.Midpoint = svg.circle({
          name: this.name,
          class: "editor-line-midpoint",
          "vector-effect": "non-scaling-stroke",
          r: 4
        });
        this.on("selected", (selected) => selected ? this.el.Primary.classList.add("selected") : this.el.Primary.classList.remove("selected"));
        this.on("selected", (selected) => selected ? this.el.Midpoint.classList.add("selected") : this.el.Midpoint.classList.remove("selected"));
        const select = new Select({
          component: this,
          handle: this.el.Primary
        });
        this.destructable = () => focus.destroy();
        this.on("name", (name2) => update(this.el.Primary, { name: name2 }));
        this.on("node", (node) => {
          node.on("source", (source) => this.source = source);
          node.on("target", (target) => this.target = target);
        });
        this.on("source", (id2) => {
          if (!id2)
            throw new Error(`Primary requires source id`);
          if (!id2.includes(":"))
            throw new Error(`Id must contain ":".`);
          const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
          const component = origin.root.anchors.get(id2);
          component.on("x", (x) => this.x1 = x);
          component.on("y", (y) => this.y1 = y);
        });
        this.on("target", (id2) => {
          if (!id2)
            throw new Error(`Primary requires target id`);
          if (!id2.includes(":"))
            throw new Error(`Id must contain ":".`);
          const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
          const component = origin.root.anchors.get(id2);
          component.on("x", (x) => this.x2 = x);
          component.on("y", (y) => this.y2 = y);
        });
        this.all(["source", "target"], ({ source, target }) => {
          const origin = globalThis.project.origins.get(this.getRootContainer().node.origin);
          globalThis.project.pipe(origin, source, target);
        });
        this.any(["x1", "y1", "x2", "y2"], (packet) => update(this.el.Midpoint, midpoint(packet)));
        this.any(["x1", "y1", "x2", "y2"], ({ x1, y1, x2, y2 }) => {
          const [x3, y3] = edgepoint(x1, y1, 12, x1, y1, x2, y2);
          const [x4, y4] = edgepoint(x2, y2, -12, x1, y1, x2, y2);
          update(this.el.Primary, { x1: x3, y1: y3, x2: x4, y2: y4 });
        });
        this.appendElements();
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/visual-editor/VisualEditor.js
  var uuid3 = bundle["uuid"];
  var VisualEditor = class {
    static {
      __name(this, "VisualEditor");
    }
    static extends = [Vertical];
    properties = {
      contain: true
    };
    observables = {
      applications: [],
      elements: [],
      anchors: [],
      pipes: [],
      types: [Junction, Line]
    };
    methods = {
      initialize() {
        console.info("Line must detect the g it should be placed into");
        this.h = 400;
        this.subLayout = new RelativeLayout(this);
        this.el.Group = svg.g();
        globalThis.project.origins.create({ id: this.getRootContainer().id, root: this, scene: this.el.Group });
        this.on("elements.created", (node) => {
          const Ui = this.types.find((o) => o.name == node.type);
          if (!Ui)
            return console.warn(`Skipped Unrecongnized Component Type "${node.type}"`);
          const ui = new Instance(Ui, { id: node.id, node, scene: this.el.Group });
          this.applications.create(ui);
          ui.start();
          this.subLayout.manage(ui);
        }, { replay: true });
        this.on("elements.removed", ({ id: id2 }) => {
          this.applications.get(id2).stop();
          this.applications.get(id2).destroy();
          this.applications.remove(id2);
        });
      },
      mount() {
        const [horizontal, [addButton, delButton, vplCanvas]] = nest(Horizontal, [
          [Label, { h: 32, W: 32, text: "Add", parent: this }, (c, p2) => p2.children.create(c)],
          [Label, { h: 32, W: 32, text: "Del", parent: this }, (c, p2) => p2.children.create(c)]
        ], (c) => this.children.create(c));
        const area = new Instance(Container, { h: 600, parent: this });
        this.children.create(area);
        this.el.ClipPath = svg.clipPath({
          id: `clip-path-${this.id}`
        });
        const clipPathRect = svg.rect({
          // this gets synchronized with the control that is actually registered to the layout manager
          x: this.parent.x,
          y: this.parent.y,
          width: this.parent.w,
          height: this.parent.h
        });
        area.any(["x", "y", "w", "h"], ({ x, y, w: width, h: height }) => {
          update(clipPathRect, { x, y, width, height });
        });
        this.el.ClipPath.appendChild(clipPathRect);
        update(this.el.Group, { "clip-path": `url(#clip-path-${this.id})` });
        this.appendElements();
        this.disposable = click(addButton.handle, (e) => {
          const id2 = uuid3();
          const node = new Instance(Node, { id: id2, origin: this.getRootContainer().id, type: "Junction", x: 50, y: 50, data: {} });
          this.elements.create(node);
        });
      }
    };
  };

  // plug-ins/applications/RelationBuilder.js
  var RelationBuilder = class {
    static {
      __name(this, "RelationBuilder");
    }
    static extends = [Window];
    methods = {
      initialize() {
        this.w = 800;
        this.h = 600;
      },
      mount() {
        const visualEditor = new Instance(VisualEditor, { url: this.url });
        this.createWindowComponent(visualEditor);
        this.on("node", (node) => {
          node.on("url", (url) => imagePicker.url = url);
        });
      },
      stop() {
        console.log("Stopping...");
      },
      destroy() {
        console.log("Destroying...");
        this.dispose();
      }
    };
  };

  // plug-ins/image-picker/ImagePicker.js
  function range(n) {
    return Array(n).fill().map((_, i) => i);
  }
  __name(range, "range");
  var ImagePicker = class {
    static {
      __name(this, "ImagePicker");
    }
    static extends = [Control];
    observables = {
      url: void 0
    };
    methods = {
      initialize() {
      },
      mount() {
        this.el.Primary = svg.foreignObject({
          name: this.name,
          width: this.w,
          height: this.h,
          x: this.x,
          y: this.y
        });
        this.getRootContainer().node.on("colorAnchors", (count) => {
          for (const number of range(count)) {
            const name2 = `color${number}`;
            this.createControlAnchor({ name: name2, side: 1 });
            this.oo.createObservable(`color${number}`);
          }
          for (const number of range(count)) {
            const name2 = `color${number}`;
          }
        });
        const canvas = html.canvas({
          class: "editor-image-picker-canvas w-100",
          width: this.w,
          height: this.h
        });
        const pick = new Pick({
          component: this,
          handle: canvas,
          zone: window,
          onData: (data) => {
            for (const name2 of this.anchors.filter((anchor) => anchor.selected).map((anchor) => anchor.name)) {
              this[name2] = data;
              this.pipe(name2).emit("data", data);
            }
          }
        });
        this.destructable = () => pick.destroy();
        this.el.Primary.appendChild(canvas);
        this.on("url", (url) => {
          const img = new Image();
          img.addEventListener("load", function() {
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
          });
          img.setAttribute("src", url);
        });
        this.on("w", (width) => update(this.el.Primary, { width }));
        this.on("h", (height) => update(this.el.Primary, { height }));
        this.on("x", (x) => update(this.el.Primary, { x }));
        this.on("y", (y) => update(this.el.Primary, { y }));
        this.on("w", (width) => update(canvas, { style: { width: width + "px" } }));
        this.on("h", (height) => update(canvas, { style: { height: height + "px" } }));
        this.appendElements();
      }
    };
  };
  var Pick = class {
    static {
      __name(this, "Pick");
    }
    component;
    handle;
    zone;
    onData;
    mouseDownHandler;
    mouseMoveHandler;
    mouseUpHandler;
    dragging = false;
    constructor({ component, handle, zone, onData }) {
      if (!component)
        throw new Error("component is required");
      if (!handle)
        throw new Error("handle is required");
      if (!zone)
        throw new Error("zone is required");
      if (!onData)
        throw new Error("onData is required");
      this.component = component;
      this.handle = handle;
      this.zone = zone;
      this.onData = onData;
      this.mount();
    }
    mount() {
      this.mouseMoveHandler = (e) => {
        const context = this.handle.getContext("2d");
        const rect = this.handle.getBoundingClientRect();
        let imageRatio = Math.min(
          this.handle.width / (this.handle.getBoundingClientRect().width / globalThis.project.zoom),
          this.handle.height / (this.handle.getBoundingClientRect().height / globalThis.project.zoom)
        );
        const trueX = e.clientX - rect.left;
        const trueY = e.clientY - rect.top;
        const zoomedX = trueX / globalThis.project.zoom;
        const zoomedY = trueY / globalThis.project.zoom;
        const ratiodX = zoomedX * imageRatio;
        const ratiodY = zoomedY * imageRatio;
        const position = { x: ratiodX, y: ratiodY };
        const data = context.getImageData(position.x, position.y, 1, 1).data;
        const rgba = [data[0], data[1], data[2], data[3]];
        const packet = {
          color: `rgba(${rgba.join(", ")})`,
          rgba,
          ...position
        };
        this.onData(packet);
      };
      this.mouseDownHandler = (e) => {
        this.dragging = true;
        this.mouseMoveHandler(e);
        this.zone.addEventListener("mousemove", this.mouseMoveHandler);
      };
      this.mouseUpHandler = (e) => {
        this.dragging = false;
        this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      };
      this.handle.addEventListener("mousedown", this.mouseDownHandler);
      this.zone.addEventListener("mouseup", this.mouseUpHandler);
    }
    destroy() {
      this.handle.removeEventListener("mousedown", this.mouseDownHandler);
      this.zone.removeEventListener("mousemove", this.mouseMoveHandler);
      this.zone.removeEventListener("mouseup", this.mouseUpHandler);
    }
  };

  // plug-ins/applications/ColorPicker.js
  var ColorPicker = class {
    static {
      __name(this, "ColorPicker");
    }
    static extends = [Window];
    methods = {
      initialize() {
      },
      mount() {
        const imagePicker2 = new Instance(ImagePicker, { url: this.url });
        this.createWindowComponent(imagePicker2);
        this.on("node", (node) => {
          node.on("url", (url) => imagePicker2.url = url);
          node.on("h", (h) => imagePicker2.h = h);
          node.on("w", (w) => imagePicker2.w = w);
        });
      },
      stop() {
        console.log("Stopping...");
      },
      destroy() {
        console.log("Destroying...");
        console.log("Destroying... EL");
        console.log("Destroying... CHILDREN");
        console.log("Destroying... ANCHOR CONNECTIONS");
        console.log("Destroying... ANCHORS");
        this.dispose();
      }
    };
  };

  // plug-ins/applications/ThemeBuilder.js
  var ThemeBuilder = class {
    static {
      __name(this, "ThemeBuilder");
    }
    static extends = [Window];
    methods = {
      initialize() {
        this.w = 200;
      },
      mount() {
        const themeColors = new Instance(ThemeColors);
        this.createWindowComponent(themeColors);
      }
    };
  };
  var ThemeColors = class {
    static {
      __name(this, "ThemeColors");
    }
    static extends = [Control];
    properties = {
      colors: ["primary", "secondary", "success", "info", "warning", "danger", "light", "dark"]
    };
    methods = {
      initialize() {
        this.w = 200;
        this.h = 400;
        this.H = 400;
      },
      mount() {
        for (const color of this.colors) {
          this.createControlAnchor({ name: color, side: 0 });
        }
        for (const color of this.colors) {
          this.oo.createObservable(color, "magenta");
        }
        for (const color of this.colors) {
          this.pipe(color).on("data", (data) => document.documentElement.style.setProperty(`--editor-${color}`, data.color));
          this.pipe(color).on("data", (data) => this[color] = data.color);
        }
        this.any(this.colors, (colors) => {
          let vars = [];
          for (const color of this.colors) {
            vars.push(`  --editor-${color}: ${this[color]};`);
          }
          const doc = `:root, [data-ui-theme=nostromo] {
${vars.join("\n")}
}
`;
          this.pipe("output").emit("data", { format: "css", doc });
        });
      }
      // end mount
    };
  };

  // plug-ins/applications/VisualProgram.js
  var VisualProgram = class {
    static {
      __name(this, "VisualProgram");
    }
    static extends = [Window];
    methods = {
      initialize() {
      },
      mount() {
        const editor = new Instance(VisualEditor, { node: { id: uuid() } });
        this.createWindowComponent(editor);
      },
      stop() {
        console.log("Stopping...");
      },
      destroy() {
        console.log("Destroying...");
        console.log("Destroying... EL");
        console.log("Destroying... CHILDREN");
        console.log("Destroying... ANCHOR CONNECTIONS");
        console.log("Destroying... ANCHORS");
        this.dispose();
      }
    };
  };

  // plug-ins/codemirror/index.js
  var { basicSetup, EditorView } = bundle["codemirror"];
  var { javascript } = bundle["@codemirror/lang-javascript"];
  var { keymap } = bundle["@codemirror/view"];
  var { indentWithTab } = bundle["@codemirror/commands"];
  var { EditorState } = bundle["@codemirror/state"];
  var { oneDark } = bundle["@codemirror/theme-one-dark"];
  var CodeMirror = class {
    static {
      __name(this, "CodeMirror");
    }
    static extends = [Component];
    observables = {
      doc: void 0
    };
    methods = {
      initialize() {
        this.h = 600;
      },
      mount() {
        this.el.ForeignObject = svg.foreignObject({
          name: this.name,
          width: this.w,
          height: this.h,
          x: this.x,
          y: this.y
        });
        const div = html.div({
          class: "editor-codemirror"
        });
        this.on("name", (name2) => update(this.el.ForeignObject, { name: name2 }));
        this.on("w", (width) => update(this.el.ForeignObject, { width }));
        this.on("h", (height) => update(this.el.ForeignObject, { height }));
        this.on("x", (x) => update(this.el.ForeignObject, { x }));
        this.on("y", (y) => update(this.el.ForeignObject, { y }));
        this.on("w", (width) => update(div, { style: { width: width + "px" } }));
        this.on("h", (height) => update(div, { style: { "height": height + "px" } }));
        this.el.ForeignObject.appendChild(div);
        this.appendElements();
        const extensions = [
          basicSetup,
          javascript(),
          EditorView.lineWrapping,
          //NOTE: EditorView.lineWrapping does/did not honor code indents
          keymap.of([indentWithTab]),
          // EditorView.updateListener.of((update) => {if (update.docChanged) value = update.state.doc.toString(); }),
          oneDark,
          EditorView.theme({
            "&": { maxHeight: this.h + "px" },
            ".cm-gutter,.cm-content": { minHeight: "100px" },
            ".cm-scroller": {
              overflow: "auto",
              borderTopLeftRadius: "0px",
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: "0px"
            }
          })
        ];
        this.editorView = new EditorView({
          doc: this.parent.data.doc || "",
          extensions,
          parent: div
        });
        this.destructable = click(div, () => this.editorView.focus());
        this.on("doc", (value2) => {
          const doc = String(value2);
          const editorState = EditorState.create({ doc, extensions });
          this.editorView.setState(editorState);
        });
      }
    };
  };

  // plug-ins/applications/CodeEditor.js
  var CodeEditor = class {
    static {
      __name(this, "CodeEditor");
    }
    static extends = [Window];
    methods = {
      initialize() {
        this.w = 800;
        this.h = 600;
      },
      mount() {
        const codeMirror2 = new Instance(CodeMirror);
        this.createWindowComponent(codeMirror2);
        this.pipe("input").on("data", (data) => {
          codeMirror2.doc = data.doc;
        });
      }
    };
  };

  // plug-ins/windows/Frame.js
  var Frame = class {
    static {
      __name(this, "Frame");
    }
    static extends = [Control];
    observables = {
      src: ""
    };
    constraints = {
      mount: {
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".svg not found" };
          }
        }
      }
    };
    methods = {
      initialize() {
      },
      mount() {
        this.createControlAnchor({ name: "src", side: 0 });
        this.el.ForeignObject = svg.foreignObject({
          name: this.name,
          width: this.w,
          height: this.h,
          x: this.x,
          y: this.y
        });
        const iframe = html.iframe({
          class: "editor-frame",
          src: this.src
        });
        let origin = null;
        this.on("src", (src) => {
          try {
            origin = new URL(src).origin;
          } catch (e) {
          }
        });
        window.addEventListener("message", (msg) => {
          const isSameOrigin = origin === msg.origin;
          const isSameSource = this.src === msg.source.location.href;
          if (!isSameOrigin)
            return;
          if (!isSameSource)
            return;
          const { name: name2, data } = msg.data;
          let anchor = this.anchors.find((anchor2) => anchor2.name === name2);
          let color;
          if (data.color)
            color = `rgba(${data.color.join(", ")})`;
          if (!anchor) {
            this.anchors.create(new Instance(Anchor, { name: name2, parent: this, scene: this.scene, side: 1, color }));
          } else {
            anchor.color = color;
          }
        }, false);
        this.el.ForeignObject.appendChild(iframe);
        globalThis.project.on("iframe", (visibility) => {
          this.el.ForeignObject.style.display = visibility ? "block" : "none";
        });
        this.on("name", (name2) => update(this.el.ForeignObject, { name: name2 }));
        this.on("src", (src) => update(iframe, { src }));
        this.on("w", (width) => update(this.el.ForeignObject, { width }));
        this.on("h", (height) => update(this.el.ForeignObject, { height }));
        this.on("x", (x) => update(this.el.ForeignObject, { x }));
        this.on("y", (y) => update(this.el.ForeignObject, { y }));
        this.on("w", (width) => update(iframe, { style: { width: width + "px" } }));
        this.on("h", (height) => update(iframe, { style: { height: height + "px" } }));
        this.appendElements();
      },
      destroy() {
        this.removeElements();
      }
    };
  };

  // plug-ins/applications/RemoteApplication.js
  var RemoteApplication = class {
    static {
      __name(this, "RemoteApplication");
    }
    static extends = [Window];
    methods = {
      initialize() {
        if (!this.oo)
          throw new Error("VisualProgram oo Not Found");
      },
      mount() {
        const frame = new Instance(Frame);
        this.createWindowComponent(frame);
        this.on("node", (node) => {
          node.on("src", (src) => frame.src = src);
          node.on("h", (h) => frame.h = h);
          node.on("w", (w) => frame.w = w);
        });
      }
    };
  };

  // plug-ins/developer/ElementDebugger.js
  var ElementDebugger = class {
    static {
      __name(this, "ElementDebugger");
    }
    static extends = [Window];
    methods = {
      initialize() {
        this.w = 400;
        this.h = 600;
      },
      mount() {
        globalThis.project.on("elements.created", (node) => {
          const [box, [type, kind, id2]] = nest(Horizontal, { id: node.id }, [
            [Label, { h: 32, W: 0.1, text: node.oo.name, parent: this }, (chid, parent) => parent.children.create(chid)],
            [Label, { h: 32, text: node.type, parent: this }, (chid, parent) => parent.children.create(chid)],
            [Label, { h: 32, W: 0.5, text: node.id, parent: this }, (chid, parent) => parent.children.create(chid)]
          ], (c) => this.createWindowComponent(c));
        }, { replay: true });
        globalThis.project.on("elements.removed", ({ id: id2 }) => {
          this.removeWindowComponent(id2);
        });
        this.pipe("input").on("data", (data) => {
          codeMirror.doc = data.doc;
        });
      }
    };
  };

  // plug-ins/developer/ApplicationDebugger.js
  var ApplicationDebugger = class {
    static {
      __name(this, "ApplicationDebugger");
    }
    static extends = [Window];
    methods = {
      initialize() {
        this.w = 400;
        this.h = 600;
      },
      mount() {
        globalThis.project.on("applications.created", (application) => {
          const deviceInfo = new Instance(Label, { h: 32, text: `${application.oo.name}: ${application.caption || "--"} ${application.id}` });
          this.createWindowComponent(deviceInfo);
          application.on("selected", (selected) => deviceInfo.selected = selected);
        }, { replay: true });
        globalThis.project.on("applications.removed", ({ id: id2 }) => {
          this.removeWindowComponent(id2);
        });
        this.pipe("input").on("data", (data) => {
          codeMirror.doc = data.doc;
        });
      }
    };
  };

  // plug-ins/developer/AnchorDebugger.js
  var AnchorDebugger = class {
    static {
      __name(this, "AnchorDebugger");
    }
    static extends = [Window];
    methods = {
      initialize() {
        this.w = 400;
        this.h = 600;
      },
      mount() {
        globalThis.project.on("anchors.created", (anchor) => {
          const deviceInfo = new Instance(Label, { h: 32, text: `${anchor.oo.name}: ${anchor.id}... ${anchor.type}` });
          this.createWindowComponent(deviceInfo);
          anchor.on("selected", (selected) => deviceInfo.selected = selected);
        }, { replay: true });
        globalThis.project.on("anchors.removed", ({ id: id2 }) => {
          this.removeWindowComponent(id2);
        });
        this.pipe("input").on("data", (data) => {
          codeMirror.doc = data.doc;
        });
      }
    };
  };

  // plug-ins/developer/PipeDebugger.js
  var PipeDebugger = class {
    static {
      __name(this, "PipeDebugger");
    }
    static extends = [Window];
    methods = {
      initialize() {
        this.w = 400;
        this.h = 600;
      },
      mount() {
        globalThis.project.on("pipes.created", (node) => {
          this.createWindowComponent(new Instance(Label, { h: 32, text: `Pipe: ${node.id}... | ${node.direction}` }));
        }, { replay: true });
        globalThis.project.on("pipes.removed", ({ id: id2 }) => {
          this.removeWindowComponent(id2);
        });
        this.pipe("input").on("data", (data) => {
          codeMirror.doc = data.doc;
        });
      }
    };
  };

  // plug-ins/developer/ZoomPanDebugger.js
  var ZoomPanDebugger = class {
    static {
      __name(this, "ZoomPanDebugger");
    }
    static extends = [Window];
    observables = {
      text: ""
    };
    methods = {
      initialize() {
        this.w = 400;
        this.h = 600;
      },
      mount() {
        const [horizontal, [info1, info2]] = nest(Horizontal, [
          [Label, { h: 32, W: 100, text: "Hello", parent: this }, (c, p2) => p2.children.create(c)],
          [Label, { h: 32, text: "World", parent: this }, (c, p2) => p2.children.create(c)]
        ], (c) => this.createWindowComponent(c));
        globalThis.project.any(["panX", "panY"], ({ panX, panY }) => info1.text = `${panX}x${panY}`);
        globalThis.project.on("zoom", (zoom) => info2.text = `@${zoom}`);
        const displayText = new Instance(Label, { h: 32, text: this.text });
        this.createWindowComponent(displayText);
        globalThis.project.any(["panX", "panY", "zoom"], ({ panX, panY, zoom }) => this.text = `Pan & Zoom
 ${panX}x${panY} @${zoom}`);
        this.on("text", (text2) => displayText.text = text2);
        this.pipe("input").on("data", (data) => {
          codeMirror.doc = data.doc;
        });
      }
    };
  };

  // src/Project.js
  var debounce = /* @__PURE__ */ __name((func, wait) => {
    let timeout;
    return /* @__PURE__ */ __name(function executedFunction(...args) {
      const later = /* @__PURE__ */ __name(() => {
        clearTimeout(timeout);
        func(...args);
      }, "later");
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }, "executedFunction");
  }, "debounce");
  var Project = class {
    static {
      __name(this, "Project");
    }
    // extends = [];
    state = {
      current: "initial",
      initial: {
        run: "initialize",
        can: "start"
      },
      start: {
        run: "mount",
        can: "stop"
      },
      stop: {
        run: ["destroy"],
        can: "start"
      }
    };
    properties = {
      meta: {},
      types: [
        RelationBuilder,
        ColorPicker,
        ThemeBuilder,
        VisualProgram,
        Junction,
        Line,
        RemoteApplication,
        CodeEditor,
        ElementDebugger,
        ApplicationDebugger,
        AnchorDebugger,
        PipeDebugger,
        ZoomPanDebugger
      ]
      // What can the project instantiate?
    };
    observables = {
      svg: void 0,
      scene: void 0,
      background: void 0,
      file: void 0,
      name: "Bork",
      origins: [],
      archetypes: [],
      // PRIMARY DATA, note Line component represents edges, these must come second, forst take care of non-Line, then Line
      elements: [],
      // use instead of old .nodes
      // SECONDATY LOOKUP DATA - registry for fast lookup purposes
      applications: [],
      // NOTE: root windowID
      anchors: [],
      // NOTE: format is portName:rootID (not component id, but the root window)
      pipes: [],
      //
      w: 0,
      h: 0,
      panX: 0,
      panY: 0,
      zoom: 0.5,
      iframe: true
      // controls if iframe content is visible, iframes interefere with dragging
    };
    constraints = {
      started: {
        ".svg is required to start the universe": function() {
          if (!this.svg) {
            return { error: ".svg not found" };
          }
        },
        ".scene is required to start the universe": function() {
          if (!this.scene) {
            return { error: ".scene not found" };
          }
        },
        ".background is required to start the universe": function() {
          if (!this.background) {
            return { error: ".background not found" };
          }
        },
        ".file is required to start the universe": function() {
          if (!this.file) {
            return { error: "file url required" };
          }
        }
      }
    };
    methods = {
      initialize() {
        this.origins.create({ id: 0, root: this, scene: this.scene });
        this.on("zoom", (v) => requestAnimationFrame(() => {
          this.scene.style.scale = this.zoom;
        }));
        this.on("panX", (v) => requestAnimationFrame(() => {
          this.scene.style.transform = `translate(${this.panX / this.zoom}px, ${this.panY / this.zoom}px)`;
        }));
        this.on("panY", (v) => requestAnimationFrame(() => {
          this.scene.style.transform = `translate(${this.panX / this.zoom}px, ${this.panY / this.zoom}px)`;
        }));
        this.on("name", (v) => {
          if (v)
            document.querySelector("title").innerText = v;
        });
        this.on("file", async (v) => {
        });
        this.on("elements.created", (node) => {
          const Ui = this.types.find((o) => o.name == node.type);
          if (!Ui) {
            console.warn(`Skipped Unrecongnized Component Type "${node.type}"`);
            return;
          }
          let scene = this.scene;
          if (node.scene)
            scene = node.scene;
          const g = svg.g({ id: node.id, class: "component" });
          scene.appendChild(g);
          const ui = new Instance(Ui, { id: node.id, node, scene: g });
          this.applications.create(ui);
          ui.start();
        }, { replay: true });
        this.on("elements.removed", ({ id: id2 }) => {
          this.applications.get(id2).stop();
          this.applications.get(id2).destroy();
          this.applications.remove(id2);
        });
      },
      // initialize
      pipe(origin, sourceId, targetId) {
        if (!origin)
          throw new Error("origin is required");
        if (!sourceId)
          throw new Error("sourceId is required");
        if (!targetId)
          throw new Error("targetId is required");
        const source = origin.root.pipes.get(sourceId);
        const target = origin.root.pipes.get(targetId);
        source.on("data", (data) => target.emit("data", data));
      },
      createNode({ meta, data }) {
        const node = new Instance(Node, { ...meta, data });
        const origin = this.origins.get(node.origin);
        origin.root.elements.create(node);
      },
      remove(id2) {
        const node = this.nodes.get(id2);
        project.elements.remove(node);
        node.stop();
        node.destroy();
      },
      removeSelected() {
        for (const application of this.applications) {
          if (application.selected) {
            this.remove(id);
          }
        }
      },
      async mount() {
        const onResize = /* @__PURE__ */ __name(() => {
          this.w = this.svg.clientWidth;
          this.h = this.svg.clientHeight;
        }, "onResize");
        const debouncedOnResize = debounce(onResize, 69);
        window.addEventListener("resize", debouncedOnResize);
        onResize();
        this.any(["zoom", "panX", "panY"], () => {
          onResize();
        });
        const keyboard = new Keyboard({
          component: this,
          handle: window
          // set to caption above to react to window captions only
        });
        this.destructable = () => keyboard.destroy();
        const zoom = new Zoom({
          component: this,
          element: this.scene,
          zone: this.background
        });
        this.destructable = () => zoom.destroy();
        const pan = new Pan({
          component: this,
          handle: this.background,
          zone: window
        });
        this.destructable = () => pan.destroy();
        const rehydrated = await (await fetch(this.file)).json();
        this.meta = rehydrated.meta;
        for (const { meta, data } of rehydrated.data) {
          const node = new Instance(Node, { origin: 0 });
          node.assign(meta, data);
          project.elements.create(node);
        }
      },
      async save(filename = "project.json", meta = {}) {
        const packageJson = await (await fetch("package.json")).json();
        const { version: compatibility } = packageJson;
        let objects = {
          meta: Object.assign(this.meta, meta, { compatibility }),
          data: []
        };
        for (const concept of project.elements) {
          const object = concept.toObject();
          objects.data.push(object);
        }
        const str = JSON.stringify(objects, null, 2);
        console.log(str);
      },
      destroy() {
        for (const { id: id2 } of this.elements) {
          this.applications.get(id2).stop();
          this.applications.remove(id2);
        }
        this.dispose();
      }
    };
  };

  // src/index.js
  var themes2 = new Instance(Themes);
  themes2.theme = "nostromo";
  var project2 = new Instance(Project);
  globalThis.project = project2;
  project2.name = "Hello World Project";
  project2.svg = document.querySelector("#editor-svg");
  project2.scene = document.querySelector("#editor-scene");
  project2.background = document.querySelector("#editor-background");
  project2.file = "templates/hello-project.json";
  project2.start();
})();
