// Boot Script - this is a boot sctipt that gets all the non-symmetrical oddities out of the way
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css';
import bootstrapJs from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { v4 as uuid } from "uuid";

import Node from "#plug-ins/node/Node.js";
//
import Themes from './Themes.js';
const themes = new Themes();
themes.theme = 'nostromo';


import Universe from './Universe.js';
const universe = new Universe();
window.universe = universe;

universe.name = 'Universe Window';
universe.svg = document.querySelector('#editor-svg');
universe.scene = document.querySelector('#editor-scene');
console.info('index.js creating a world in the universe!');

async function main(){

  const project = await (await fetch('templates/hello-project.json')).json();
  for (const item of project.data) {
    const node =  new Node(item.meta);


    universe.worlds.create( node ); // -> universe #onStart ->

    console.log( node.h );
  }
  universe.started = true;
}

main();
