// Boot Script - this is a boot sctipt that gets all the non-symmetrical oddities out of the way
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css';
import bootstrapJs from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Root from './Root.js';

// create a bare window
const rootWindow = new Root('Root Window');
// manually add it to a pre-made svg
document.querySelector('#editor-scene').appendChild( rootWindow.g );
rootWindow.start();
console.warn('TODO: rootWindow.port(main).maximize();');

// THe Root Window, is not associated with any application,
// an application HAS SPECIFIC NODES, it is loaded on per use-case basis.
