import { v4 as uuid } from "uuid";
const db = {}

export default class ReactiveObject {

  id = uuid();
  #observers = {};

  // Part 1: EVENTS

  observe(eventName, observerCallback, options={autorun:true}) {
    if(typeof observerCallback !== "function") throw new TypeError("observer must be a function.");
    if(!Array.isArray(this.#observers[eventName])) this.#observers[eventName] = []; // If there isn't an observers array for this key yet, create it
    this.#observers[ eventName ].push(observerCallback);
    if(options.autorun) observerCallback(this.#properties[eventName]); // NOTE: only returns data if it is a property, otherwise it will be undefined
    return () => {
      this.unobserve(eventName, observerCallback);
    };
  }

  unobserve(eventName, observerCallback){
    this.#observers[eventName] = this.#observers[eventName].filter((obs) => obs !== observerCallback);
  }

  notify(eventName, eventData, ...extra) {
    if(Array.isArray(this.#observers[eventName]))
      this.#observers[eventName].forEach((observerCallback) => observerCallback(eventData, ...extra));
  }

  // Part 2: PROPERTIES

  #properties = {};
  observable(key, val, parent) {
    // parent may contain applicaion object or context, that can be set here
    console.log('TODO: this is type sensitive, it behaves differently for arrays. The arry must become an observable list with creaded/removed events. Classes are instantiated late.');

    this.#properties[key] = val;
    Object.defineProperty(this, key, {
      get: () => this.#properties[key],
      set: (newValue) => {
        // const debug = ['height'];
        // if(debug.includes(key)) console.log(`${this.name}: SET ${key} to "${newValue}"`);
        const oldValue = this.#properties[key];
        if(newValue === oldValue) return; // IMPORTANT: this is on purpose we do nothing when the values are the sane (MEMOIZE/optimize)
        this.#properties[key] = newValue;
        this.notify(key, newValue, { newValue, oldValue });
      }
    });
  }

}
