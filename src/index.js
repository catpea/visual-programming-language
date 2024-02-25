// Boot Script - this is a boot sctipt that gets all the non-symmetrical oddities out of the way
import { v4 as uuid } from "uuid";
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css';
import bootstrapJs from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {Instance} from "#plug-ins/object-oriented-programming/index.js";

import Themes from './Themes.js';
const themes = new Instance(Themes);
themes.theme = 'nostromo';

import Project from './Project.js';
const project = new Instance(Project);
window.project = project;
project.name = 'Hello World Project';
project.svg = document.querySelector('#editor-svg');
project.scene = document.querySelector('#editor-scene');
project.file = 'templates/hello-project.json';
project.start();
