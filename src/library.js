// Boot Script - this is a boot sctipt that gets all the non-symmetrical oddities out of the way
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css';
import bootstrapJs from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Nostromo from "#plug-ins/nostromo-theme/index.js";
import Obsidian from "#plug-ins/obsidian-theme/index.js";


import { v4 as uuid } from "uuid";

globalThis.uuid = uuid
globalThis.themes = {Nostromo, Obsidian}
