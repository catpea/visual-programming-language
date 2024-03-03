import Component from "/plug-ins/windows/Component.js";
import { svg, update } from "domek";

export default class Line {

  static extends = [Component];

  properties = {
  };

  observables = {
    source: null,
    target: null,

    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,

  };

  constraints = {
    mount: {
      '.scene is required to start the universe': function(){ if(!this.scene){return {error:'.svg not found'}} },
    }
  }

  methods = {

    initialize(){
    },

    mount(){

      this.el.Line = svg.line({
        name: this.name,
        class: 'junction-container',
        'stroke-width': 2,
      });

      this.on('name',  name=>update(this.el.Line,{name}), );

      this.on('source',  source=>{
        if(!source) return;
        const [port, id] = source.split(':')
        // const component = globalThis.project.concepts.find(o=>o.id==id)
        const component = globalThis.project.ui.get(id)
        // console.log('FOUND ROOT1 COMPONENT', component, component.allAnchors(component));
        const anchor = component.allAnchors(component).find(o=>o.name==port)

        console.log({anchor});

        anchor.on('x', x=>this.x1=x)
        anchor.on('y', y=>this.y1=y)
      });

      this.on('target',  target=>{
        if(!target) return;
        const [port, id] = target.split(':')
        const component = globalThis.project.ui.get(id)
        // console.log('FOUND ROOT2 COMPONENT', component,  );
        // console.log('FOUND ROOT2 COMPONENT', component.allAnchors(component));

        const anchor = component.allAnchors(component).find(o=>o.name==port)
        console.log({anchor});

        anchor.on('x', x=>this.x2=x)
        anchor.on('y', y=>this.y2=y)
      });


      this.on('x1',      x1=>update(this.el.Line,{x1}),     );
      this.on('y1',      y1=>update(this.el.Line,{y1}),     );
      this.on('x2',      x2=>update(this.el.Line,{x2}),     );
      this.on('y2',      y2=>update(this.el.Line,{y2}),     );

      this.on('x1',      x1=>console.log({x1}),     );
      this.on('y1',      y1=>console.log({y1}),     );
      this.on('x2',      x2=>console.log({x2}),     );
      this.on('y2',      y2=>console.log({y2}),     );

      this.appendElements();
    },

    destroy(){
      this.removeElements()
    }

  }

}
