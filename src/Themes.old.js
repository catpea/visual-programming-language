// import ReactiveObject from '#plug-ins/reactive-object/ReactiveObject.js';
import Properties from "#plug-ins/properties/Properties.js";

import Theme from "#abstract/Theme.js";
import Nostromo from "#plug-ins/nostromo-theme/index.js";
import Obsidian from "#plug-ins/obsidian-theme/index.js";

export default class Themes {

  defaults = {
    theme: "obsidian",
    themes: [new Nostromo({ subtle: true }), new Obsidian({ subtle: true })],
  }

  constraints = {
    theme: {
      'all themes are lower-case':      (theme) => !theme.match(/[A-Z]/),
      'specified theme does not exist': (theme) => this.themes.map((o) => o.id).includes(theme),
    },
    themes: { 'theme is not a prototype of #abstract/Theme': (v) => Theme.prototype.isPrototypeOf(v) }
  }

  constructor() {
    this.properties = new Properties(this);

    this.on('theme.before', id => {
      console.info('About To Change Theme To', id);
    });

    this.on('theme', (id, old) => {
      console.info(`Theme Change from ${old} to ${id}`);
      document.querySelector("html").dataset.uiTheme = id;
      console.info("dataset.uiTheme", document.querySelector("html").dataset);
    });

    this.on("themes.created", (list) => {p
      console.log("created", { list });
    });

    this.on("themes.removed", (list) => {
      console.log("removed", { list });
    });

    // way to listen to an array
    this.on("themes", (list) => {

    });

  }

  start() {

  }

  stop() {
    this.properties.stop();
    this.properties.status();

  }
}
