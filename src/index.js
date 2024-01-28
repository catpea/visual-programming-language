// Boot Script - this is a boot sctipt that gets all the non-symmetrical oddities out of the way
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css';
import bootstrapJs from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { v4 as uuid } from "uuid";

import Node from "#plug-ins/node/Node.js";

import Themes from './Themes.js';
const themes = new Themes();
themes.theme = 'nostromo';

import Universe from './Universe.js';
const universe = new Universe();
universe.name = 'Universe Window';
universe.svg = document.querySelector('#editor-svg');
universe.scene = document.querySelector('#editor-scene');
universe.started = true;

console.log('index.js creating a world in the universe!');

async function main(){

  const project = await (await fetch('templates/hello-project.json')).json();

  for (const item of project.data) {
    universe.worlds.create(new Node(item.meta));
  }

  // setInterval(x=>{
  // for (const tray of universe.worlds) {
  //     tray.x = Math.random()>=0.5 ?tray.x-1:tray.x+1;
  //     tray.y = Math.random()>=0.5 ?tray.y-1:tray.y+1;
  //     tray.w = Math.random()>=0.5 ?tray.w-1:tray.w+1;
  //     tray.h = Math.random()>=0.5 ?tray.h-1:tray.h+1;
  //     tray.r = Math.random()>=0.5 ?tray.r-1:tray.r+1;
  //     if(tray.r<1) tray.r = 1;
  //     if(tray.r>32) tray.r = 32;
  //     if(tray.w<1) tray.w = 100;
  //     if(tray.h<1) tray.h = 132;
  //   }
  // }, 1_000/22)

}

main();
