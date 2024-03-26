import Component from "/plug-ins/windows/Component.js";
import Select from "/plug-ins/select/index.js";
import { svg, update } from "/plug-ins/domek/index.js"
import { midpoint } from "/plug-ins/geometrique/index.js";
import { edgepoint } from "/plug-ins/geometrique/index.js";

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

      this.el.Primary = svg.line({
        name: this.name,
        class: 'editor-line',
        'vector-effect': 'non-scaling-stroke',
      });

      this.el.Midpoint = svg.circle({
        name: this.name,
        class: 'editor-line-midpoint',
        'vector-effect': 'non-scaling-stroke',
        r:4,
      });

      this.on("selected", selected => selected?this.el.Primary.classList.add('selected'):this.el.Primary.classList.remove('selected'));
      this.on("selected", selected => selected?this.el.Midpoint.classList.add('selected'):this.el.Midpoint.classList.remove('selected'));


      const select = new Select({
        component: this,
        handle: this.el.Primary,
      }); this.destructable = ()=>focus.destroy()

      this.on('name',  name=>update(this.el.Primary,{name}), );

      this.on("node", (node) => {
        // used for Primary
        node.on("source", source => this.source = source);
        node.on("target", target => this.target = target);
      });


      this.on('source', id=>{
        if(!id) throw new Error(`Primary requires source id`);
        if(!id.includes(':')) throw new Error(`Id must contain ":".`);
        // const component = id.includes(':')?globalThis.project.anchors.get( id ):globalThis.project.applications.get( id );
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin); // root container always has a node, node always has an origin, origin has a root

        const component = origin.root.anchors.get( id );
        component.on('x', x=>this.x1=x)
        component.on('y', y=>this.y1=y)
      });

      this.on('target',  id=>{
        if(!id) throw new Error(`Primary requires target id`);
        if(!id.includes(':')) throw new Error(`Id must contain ":".`);
        // const component = id.includes(':')?globalThis.project.anchors.get( id ):globalThis.project.applications.get( id );
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin); // root container always has a node, node always has an origin, origin has a root
        const component = origin.root.anchors.get( id );
        component.on('x', x=>this.x2=x)
        component.on('y', y=>this.y2=y)
      });


      this.all(['source', 'target'], ({source, target})=>{
        const origin = globalThis.project.origins.get(this.getRootContainer().node.origin); // root container always has a node, node always has an origin, origin has a root
        globalThis.project.pipe(origin, source, target );
      })
      // ;


      // this.on('x1',      x1=>update(this.el.Primary,{x1}),     );
      // this.on('y1',      y1=>update(this.el.Primary,{y1}),     );
      // this.on('x2',      x2=>update(this.el.Primary,{x2}),     );
      // this.on('y2',      y2=>update(this.el.Primary,{y2}),     );
      //
      // this.on('x1',      x1=>update(this.el.Primary,{x1}),     );
      // this.on('y1',      y1=>update(this.el.Primary,{y1}),     );
      // this.on('x2',      x2=>update(this.el.Primary,{x2}),     );
      // this.on('y2',      y2=>update(this.el.Primary,{y2}),     );

      // this.any(['x1','y1','x2','y2'], packet=> update(this.el.Primary, packet));
      this.any(['x1','y1','x2','y2'], packet=> update(this.el.Midpoint, midpoint(packet)));

      this.any(['x1','y1','x2','y2'], ({x1, y1, x2, y2}) => {
        const [x3,y3] = edgepoint(x1, y1, 12, x1, y1, x2, y2);
        const [x4,y4] = edgepoint(x2, y2, -12, x1, y1, x2, y2);
        update(this.el.Primary, {x1:x3, y1:y3, x2:x4, y2:y4})
        // console.log(this.el.Primary, {x1:x3, y1:y3, x2:x4, y2:y4});
      });


      this.appendElements();
    },

    destroy(){
      this.removeElements()
    }

  }

}
