<script>

  import prettier from 'prettier';
  import parserBabel from "prettier/parser-babel.js";

  import { basicSetup } from "codemirror"
  import { EditorView, keymap} from "@codemirror/view"
  import { indentWithTab } from "@codemirror/commands"
  import { EditorState } from "@codemirror/state"
  import { javascript } from "@codemirror/lang-javascript"
  import { oneDark } from '@codemirror/theme-one-dark'; // import { oneDark } from '/src/com/codearea-theme.js';

  import { onMount,onDestroy,  beforeUpdate,afterUpdate,  hasContext,getContext,setContext, createEventDispatcher } from 'svelte';
  import { readable, writable, get } from 'svelte/store';
  import { fade, slide } from 'svelte/transition';
  // const dispatch = createEventDispatcher();

  let view;
  let parent;

  export let value;

  // export let language;

  const extensions = [
    basicSetup,
    javascript(),
    EditorView.lineWrapping, //NOTE: EditorView.lineWrapping does/did not honor code indents
    keymap.of([indentWithTab]),
    EditorView.updateListener.of((update) => {if (update.docChanged) value = update.state.doc.toString(); }),
    oneDark,
    EditorView.theme({
      ".cm-content, .cm-gutter": {minHeight: "8rem"},
      ".cm-scroller": {
        overflow: "auto",
        // borderTopLeftRadius: 'var(--bs-border-radius)',
        // borderTopRightRadius: 'var(--bs-border-radius)',
     },
    })
  ];

  //  when value changes, update editor, unless editor has the same data.
  $: if(value && view && view.state.doc.toString() != value){
    const doc = String(value)
    const editorState = EditorState.create({ doc, extensions });
    view.setState( editorState );
  }

  onMount(async () => {
    const doc = String(value);
    const state = EditorState.create({ doc, extensions });
    view = new EditorView({ state, parent })
  });

  onDestroy(async () => {
  });

</script>

<div class="card" style="overflow-x: scroll;">
  <div bind:this={parent}/>
</div>
