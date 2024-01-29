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
        let text;
        if (typeof message === "string") {
          text = message;
        } else {
          text = message(value);
        }
        throw new Error(`🍔 constraint error: ${text}`);
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
    this.#value = data;
    console.log('>>>>>>>>>>>>>>>>>NOTIFY', this.name, this.#value);
    this.notify(this.name, this.#value);
  }


  // Install Observer Functionality

  #observers = {};
  observe(eventName, observerCallback, options = { autorun: true }) {
    if (typeof observerCallback !== "function") throw new TypeError("observer must be a function.");
    if (!Array.isArray(this.#observers[eventName])) this.#observers[eventName] = []; // If there isn't an observers array for this key yet, create it
    this.#observers[eventName].push(observerCallback);
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
      console.log('>>>>>>>>>>>>> NOTOFY '+eventName,this.#observers[eventName]);
      this.#observers[eventName].forEach((observerCallback) => observerCallback(eventData, ...extra));
    }
  }
  status(){

    return {
      observerCount: Object.values(this.#observers).flat().length,
    }
  }
}
