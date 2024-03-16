
const {basicSetup, EditorView} = bundle['codemirror'];
const {javascript} = bundle['@codemirror/lang-javascript']

const { keymap} = bundle["@codemirror/view"];
const { indentWithTab } = bundle["@codemirror/commands"];
const { EditorState } = bundle["@codemirror/state"];

const { oneDark } = bundle['@codemirror/theme-one-dark']; // NOTE: "Dark Backgroung And Light Text" Firefox Extension Mangles The Theme

import { svg, html, update, click } from "/plug-ins/domek/index.js"
import Component from "/plug-ins/windows/Component.js";

export default class CodeMirror {

  static extends = [Component];

  observables = {
    doc: undefined,
  };

  methods = {
    initialize(){
      this.h = 600;
    },

    mount(){

      this.el.ForeignObject = svg.foreignObject({
        name: this.name,
        width: this.w,
        height: this.h,
        x: this.x,
        y: this.y,
      });

      const div = html.div({
        class: 'editor-codemirror',
      });

      this.on('name', name=>update(this.el.ForeignObject,{name}));

      this.on('w', width=>update(this.el.ForeignObject,{width}));
      this.on('h', height=>update(this.el.ForeignObject,{height}));

      this.on('x', x=>update(this.el.ForeignObject,{x}));
      this.on('y', y=>update(this.el.ForeignObject,{y}));

      this.on('w', width=>update(div, {style:{width: width+'px'}}));
      this.on('h', height=>update(div, {style:{'height': height+'px'}}));


      this.el.ForeignObject.appendChild(div)
      this.appendElements();


      const extensions = [
        basicSetup,
        javascript(),
        EditorView.lineWrapping, //NOTE: EditorView.lineWrapping does/did not honor code indents
        keymap.of([indentWithTab]),
        // EditorView.updateListener.of((update) => {if (update.docChanged) value = update.state.doc.toString(); }),
        oneDark,
        EditorView.theme({

          '&': { maxHeight: this.h + 'px' },
          '.cm-gutter,.cm-content': { minHeight: '100px' },
          ".cm-scroller": {
            overflow: "auto",
            borderTopLeftRadius: '0px',
            borderTopLeftRadius: '0px',
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px',
         },
        })
      ];


      this.editorView = new EditorView({
        doc: (this.parent.data.doc || ""),
        extensions,
        parent: div
      })
      // codemirror.setSize(this.w, this.h);

      // HACK: code mirror inside a foreign element does not correctly receive focus - we monitor for its parent's click and manually set focus
      this.destructable = click(div, ()=>this.editorView.focus())

      this.on('doc', value=>{
        const doc = String(value);
        const editorState = EditorState.create({ doc, extensions });
        this.editorView.setState( editorState );
      });


    }
  }

}
