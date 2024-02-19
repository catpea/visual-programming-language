# Visual Programming Language
User Friendly Visual Programming Language


## TODO

- [ ] legitimize on stop on start in Universe

```JavaScript

<script>
  import fsm from 'svelte-fsm';

  const simpleSwitch = fsm('off', {
    off: { toggle: 'on' },
    on: { toggle: 'off' }
  });
</script>

<button value={$simpleSwitch} on:click={simpleSwitch.toggle}>
  {$simpleSwitch}
</button>

```

- [ ] Create worlds to visualize this program

- make the tray into a draggable Window
- give trays connections
- create special IO nodes in the node world, when added it makes a port in the world box

- [ ] add a Generator
- [ ] give worlds their nodes, and make the code generator visit
- [ ] Wherever properties are used they must be shut down

## Architecture

  - index.html calls src/index.js
  - src/Root.js Root Window is created
  - Workspace is created

## Scene

  Parents set the .scene for child components to append themselves to.
  Parents set the .parent property to "this" as well.

## Program Ideas

- [ ] Split Screen App Example (in->f->out)
- [ ] ELIZA Chatbot
- [ ] Wiki Wiki
- [ ] ExpressJs/KOA Route Builder
- [ ] Sharp Image Processor
- [ ] Request Response Patter Builder
- [ ] State And Reducers Pattern Builder
- [ ] Image Gallery Builder ★★☆☆☆
- [ ] Static Site Generator: Antwerp Yutani ★☆☆☆☆
- [ ] Atom/Pulsar Plugin For Application Structure Visualization ★☆☆☆☆
- [ ] Prompt Builder ☆☆☆☆☆
- [ ] Ask AI for a list, go over each item refining it with greater detail ☆☆☆☆☆
- [ ] Drop a node anywhere in a web page, monitor/send events and data ☆☆☆☆☆
- [ ] Video Slideshow Generator ☆☆☆☆☆
- [ ] RxJs GUI ☆☆☆☆☆
- [ ] ffmpeg GUI ☆☆☆☆☆


## Acknowledgments

- Bootstrap Icons
