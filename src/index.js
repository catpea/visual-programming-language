// Boot Script - this is a boot sctipt that gets all the non-symmetrical oddities out of the way
// import { v4 as uuid } from "uuid";

import {Instance} from "/plug-ins/object-oriented-programming/index.js";

console.log(`session ${uuid()}`);
console.log(Instance);

import Themes from './Themes.js';
const themes = new Instance(Themes);
themes.theme = 'nostromo';

import Project from './Project.js';
const project = new Instance(Project);
window.project = project;
project.name = 'Hello World Project';
project.svg = document.querySelector('#editor-svg');
project.scene = document.querySelector('#editor-scene');
project.background = document.querySelector('#editor-background');
project.file = 'templates/hello-project.json';
project.start();
