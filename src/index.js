// Boot Script - this is a boot sctipt that gets all the non-symmetrical oddities out of the way
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css';
import bootstrapJs from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Node from "#plug-ins/node/Node.js";

import Themes from './Themes.js';
const themes = new Themes();
themes.theme = 'nostromo';

import Universe from './Universe.js';
const universe = new Universe();
universe.name = 'Universe Window';
universe.svg = document.querySelector('#editor-svg');
universe.g = document.querySelector('#editor-scene');
universe.started = true;

console.log('index.js creating a world in the universe!');

const testTrays = [];

for (let i = 0; i < 10; i++) {
  testTrays.push(
    new Node({
      id: i,
      type: 'Tray',
      x: 800*Math.random(),
      y: 800*Math.random(),
      w: 800*Math.random(),
      h: 600*Math.random(),
      r: 6,
    })
  )
}

setInterval(x=>{

  for (const tray of testTrays) {
    tray.x = Math.random()>=0.5 ?tray.x-1:tray.x+1;
    tray.y = Math.random()>=0.5 ?tray.y-1:tray.y+1;
    tray.w = Math.random()>=0.5 ?tray.w-1:tray.w+1;
    tray.h = Math.random()>=0.5 ?tray.h-1:tray.h+1;
    tray.r = Math.random()>=0.5 ?tray.r-1:tray.r+1;
    if(tray.r<1) tray.r = 1;
    if(tray.r>32) tray.r = 32;
    if(tray.w<1) tray.w = 100;
    if(tray.h<1) tray.h = 132;
  }

}, 1_000/60)

for (const tray of testTrays) {
  universe.worlds.create(tray);
}
