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
        class: 'editor-line',
      });

      this.on('name',  name=>update(this.el.Line,{name}), );

      this.on('source', id=>{
        if(!id) throw new Error(`Line requires source id`);
        const anchor = globalThis.project.anchors.get( id );
        anchor.on('x', x=>this.x1=x)
        anchor.on('y', y=>this.y1=y)
      });

      this.on('target',  id=>{
        if(!id) throw new Error(`Line requires target id`);
        const anchor = globalThis.project.anchors.get( id );
        anchor.on('x', x=>this.x2=x)
        anchor.on('y', y=>this.y2=y)
      });


      this.on('x1',      x1=>update(this.el.Line,{x1}),     );
      this.on('y1',      y1=>update(this.el.Line,{y1}),     );
      this.on('x2',      x2=>update(this.el.Line,{x2}),     );
      this.on('y2',      y2=>update(this.el.Line,{y2}),     );



      this.appendElements();
    },

    destroy(){
      this.removeElements()
    }

  }

}
