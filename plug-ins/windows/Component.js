import { svg } from "domek";

export default class Component {

  properties = {
    id: uuid(),
    el: {}, // bag of elements
    g: svg.g({class:'component'}), // svg group node to contain everything
  };

  observables = {

    parent: undefined, // it may be needed to access parent from a control
    scene:  undefined, // remember parent sets the scene, child must adds its own .g to it.
    data:  undefined,

    name:  'un-named',

    x: 0,
    y: 0,

    w: 10,
    h: 10,

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
      '.data is required to start': function(){ if(!this.data){return {error:'data missing'}} },
      '.data must be an observable object': function(){ if(!this.data.on){return {error:'.on missing on .data'}} },
    }
  }

  traits = {

    appendElements(){
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

  started(){

  }

  stopped(){
    this.dispose()
  }

  methods = {

    initialize(){
      console.log(`%cComponent.initialize!`, 'background: hsl(180, 90%, 60%); color: black;');

      this.on("data", (data) => {
        console.info('UI COMPONENT IS BINDING TO DATA NODE');
        data.on("x", x => this.x = x);
        data.on("y", y => this.y = y);
        data.on("w", w => this.w = w);
        data.on("h", h => this.h = h);
        data.on("H", H => this.H = H);
        data.on("r", r => this.r = r);
        data.on("b", b => this.b = b);
        data.on("p", p => this.p = p);
        data.on("s", s => this.s = s);
      });
    },

  }

}
