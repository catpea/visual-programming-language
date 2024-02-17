export default class Property {
  name = null;
  #value = null;

  constraints = [];

  constructor(name, value) {
    this.name = name;
    this.#value = value;
  }

  constrain(data) {
    const value = data || this.#value;
    this.constraints.forEach(({ test, message }) => {
      if (!test(value)) {
        throw new Error(`🍔 constraint error: ${message} (attempted to set: ${value})`);
      }
    });
  }

  // Getter And Setter

  get value() {
    return this.#value;
  }

  set value(data) {
    // console.log(`Setting ${this.name} to "${data}"`, this.#value);
    if (this.#value == data) return;
    this.constrain(data);
    const previousValue = this.#value;
    this.notify(`${this.name}.before`, this.#value, previousValue);
    this.#value = data;
    this.notify(this.name, this.#value, previousValue);

  }


  // Install Observer Functionality

  #observers = {};
  observe(eventName, observerCallback, options = { autorun: true }) {
    if (typeof observerCallback !== "function") throw new TypeError("observer must be a function.");
    if (!Array.isArray(this.#observers[eventName])) this.#observers[eventName] = []; // If there isn't an observers array for this key yet, create it
    this.#observers[eventName].push(observerCallback);
    // console.log(`this.#observers.${eventName}`, this.#observers[eventName]);
    if (options.autorun) observerCallback(this.#value); // NOTE: only returns data if it is a property, otherwise it will be undefined
    return () => {
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
