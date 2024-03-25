// Boot Script - this is a boot sctipt that gets all the non-symmetrical oddities out of the way
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css';
import bootstrapJs from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Nostromo from "#plug-ins/nostromo-theme/index.js";
import Obsidian from "#plug-ins/obsidian-theme/index.js";


import { v4 as uuid } from "uuid";

globalThis.uuid = uuid
globalThis.themes = {Nostromo, Obsidian}

globalThis.bundle = {
  uuid,

};
 

import lodash from 'lodash';
bundle['lodash'] = lodash;

import EventEmitter from 'events';
bundle['events'] = EventEmitter;

import {basicSetup, EditorView} from "codemirror"
bundle['codemirror'] = {basicSetup, EditorView};

import {javascript} from "@codemirror/lang-javascript"
bundle['@codemirror/lang-javascript'] = {javascript};

import {keymap} from "@codemirror/view"
bundle['@codemirror/view'] = { EditorView, keymap};

import { indentWithTab } from "@codemirror/commands"
bundle['@codemirror/commands'] = { indentWithTab };

import { EditorState } from "@codemirror/state"
bundle['@codemirror/state'] = { EditorState };

import { oneDark } from '@codemirror/theme-one-dark'; // import { oneDark } from '/src/com/codearea-theme.js';
bundle['@codemirror/theme-one-dark'] = { oneDark };
