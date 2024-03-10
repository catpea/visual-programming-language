import { svg, update } from "domek";

export default class Component {

  properties = {
    id: uuid(),
    el: {}, // bag of elements
  };

  observables = {

    parent: undefined, // it may be needed to access parent from a control
    scene:  undefined, // remember parent sets the scene, this child must adds its own .g to it, then its own g becomes the scene for children
    node:  undefined, // data node

    // node has data, we keep it here at the root of component
    data:  undefined, // the data that is in the node

    selected:  false, // selection manager feature

    name:  'un-named',

    x: 0,
    y: 0,

    w: 0,
    h: 0,

    H: 0, // min h
    r: 0, // border radius

    b: 0, // border
    p: 0, // padding
    s: 0, // spacer/gap

  };

  constraints = {
    scene: {
      '.scene must be an instance of HTMLElement': function(){ if(!(obj instanceof HTMLElement)) return {error: 'Not an HTMLElement'}}
    },
    mount: {
      '.scene is required to start': function(){ if(!this.data){return {error:'data missing'}} },
      '.node is required to start': function(){ if(!this.node){return {error:'node missing'}} },
      '.node must be an observable object': function(){ if(!this.node.on){return {error:'.on missing on .node'}} },
    }
  }

  traits = {
    //
    // appendMain(){
    //   Object.values(this.el).forEach(el => this.scene.appendChild(el));
    // },

    allAnchors(parent, list=[]){

      if(parent?.children){
        for (const child of parent.children) {

          if(child.anchors?.length){
            for (const anchor of child.anchors) {
              list.push(anchor);
            }
          }

          this.allAnchors(child, list)

        }
      }

      return list;
    },

    appendElements(){

      // if(!this.g){
      //   this.g = svg.g({class:'component'});
      //   this.scene.appendChild(this.g)
      // }
      //
      // Object.values(this.el).forEach(el => this.g.appendChild(el));

      Object.values(this.el).forEach(el => this.scene.appendChild(el));

    },

    removeElements(){
      Object.values(this.el).forEach(el => el.remove());
    },

    getRandomIntInclusive(min, max) {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
    },

    pipe(name){
      const id = [name, this.root().id].join(':');
      const pipe = globalThis.project.pipes.get(id);
      return pipe;
    },

    root() {
      let response = null;
      if(!this.parent){
        response = this;
      }else{
        response = this.parent.root();
      }
      return response;
    }

  }

  methods = {


    initialize(){
      // console.log(`%cComponent.initialize!`, 'background: hsl(180, 90%, 60%); color: black;');

      this.on("node", (node) => {

        node.on("x", x => this.x = x);
        node.on("y", y => this.y = y);
        node.on("w", w => this.w = w);
        node.on("h", h => this.h = h);
        node.on("H", H => this.H = H);
        node.on("r", r => this.r = r);
        node.on("b", b => this.b = b);
        node.on("p", p => this.p = p);
        node.on("s", s => this.s = s);

        // node carries a .data property
        node.on("data", data => this.data = data);
      });
    },

  }

}
