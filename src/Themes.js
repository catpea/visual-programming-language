// import ReactiveObject from '#plug-ins/reactive-object/ReactiveObject.js';
import Properties from "#plug-ins/properties/Properties.js";

import Theme from "#abstract/Theme.js";
import Nostromo from "#plug-ins/nostromo-theme/index.js";
import Obsidian from "#plug-ins/obsidian-theme/index.js";

export default class Themes {
  theme = "nostromo";

  themes = [new Nostromo({ subtle: true }), new Obsidian({ subtle: true })];

  constructor() {
    this.properties = new Properties(this);
    this.properties.install("theme");
    this.properties.constrain("theme", { message: (v) => `theme with id "${v}" is not installed`, test: (v) => this.themes.map((o) => o.id).includes(v) });
    /*
      example of eliminating application.api
      user simply states: theme.theme = 'nostromo';
      and the system makes that happen:
    */
    this.properties.observe("theme", (id) => {
      document.querySelector("html").dataset.uiTheme = id;
      console.info("dataset.uiTheme", document.querySelector("html").dataset);
    });
    this.properties.observe("theme", (id) => {
      // console.log('Selected theme', id);
    });

    this.properties.install("themes");
    this.properties.constrain("themes", { message: (v) => `theme "${v.id}" is not a prototype of #abstract/Theme`, test: (v) => Theme.prototype.isPrototypeOf(v) });

    // when item is created (does not trigger automatically on subscription)
    this.properties.observe("themes.created", (list) => {
      console.log("created", { list });
    });
    // when item is removed (does not trigger automatically on subscription)
    this.properties.observe("themes.removed", (list) => {
      console.log("removed", { list });
    });

    // way to listen to an array
    this.properties.observe("themes", (list) => {
    });



    // this.observe = this.observable.observeFunction;
    //
    // observable.register('theme');
    // observable.register('themes');
    //
    // observable.constrain('themes', {prototypeOf:Theme});
    //
    // this.observe('theme', theme => {
    //   console.log('SETTING ID', theme.id);
    // });
    //
    // this.observe('themes.created', theme => {
    //   console.log('SETTING ID', theme.id);
    // })
    //
    // this.observe('themes.removed', theme => {
    //   console.log('SETTING ID', theme.id);
    // })
    //
    // this.observe(['x','y','w','h'], theme => {
    //   console.log('SETTING ID', theme.id);
    // }, {autorun: false})
    //
    //
    //
    // this.observe.theme = new Property(this, 'theme');
    // this.observe.themes = new Property(this, 'themes', []);
    //
    // this.theme =
    // x = this.theme
    //
    // this.theme.obserrveve()
    //
  }

  start() {

  }

  stop() {
    this.properties.stop();
    this.properties.status();

  }
}

// Object.getOwnPropertyNames(this).forEach(key => this.observable(key, this[key], this));
// this.register(this.observables)

// const nodeContent = [
//   // ['kind', node.constructor.name],
//   ...Object.entries(node),
//   ...Object.getOwnPropertyNames(Object.getPrototypeOf(node)).filter(name=>name!=='constructor').map(name=>[name, node[name]])
// ];
// if(!this.themes.map(o=>o.id).includes(id)) throw new TypeError('Theme Not Installed');
