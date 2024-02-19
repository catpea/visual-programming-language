// Boot Script - this is a boot sctipt that gets all the non-symmetrical oddities out of the way
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css';
import bootstrapJs from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {Instance} from "#plug-ins/object-oriented-programming/index.js";

import { v4 as uuid } from "uuid";

import {log, error, warn, info, debug, seq} from "#plug-ins/log/index.js";

import Node from "#plug-ins/node/Node.js";

// import Test from './Test.js';
//
// const test = new Instance(Test); // Test is the entry point.
// test.name = 'Alice';
// test.helloWorld();
// test.helloPlanet();
// test.helloBork();
// test.on("started", started=>{
//   console.log('started value has changes to:', started);
// })
//
// test.on("names.created", v=>{
//   console.log('names.created:', v);
// })
//
// test.on("names.changed", v=>{
//   console.log('names...:', v);
// })
//
// setTimeout(x=>{
//   test.nermal = false;
//   test.started = true;
//   test.names.create('Alice');
// }, 2_000);
//
// console.log(test);

import Themes from './Themes.js';


const themes = new Instance(Themes); // Test is the entry point.
themes.theme = 'nostromo';
console.log(themes);

//
// seq('create universe');
// import Universe from './Universe.js';
// const universe = new Universe();
// window.universe = universe;
//
// universe.name = 'Universe Window';
// universe.svg = document.querySelector('#editor-svg');
// universe.scene = document.querySelector('#editor-scene');
//
// async function main(){
//
//   seq('load project file + and create world node array');
//   const project = await (await fetch('templates/hello-project.json')).json();
//
//   for (const item of project.data) {
//
//     console.log(`%cCreate node ${item.meta.id}`, 'background: red; color: white;');
//     const world =  new Node(item);
//     universe.worlds.create( world ); // -> see universe #onStart for creation.
//
//   }
//
//   seq('start universe')
//   universe.started = true;
// }
//
// main();
