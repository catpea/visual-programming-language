import {intersection, difference} from '/plug-ins/boolean/index.js';
export default class Node {

  state = {
    current: 'initial',
    initial: {
       run: 'initialize',
     },
  };

  constraints = {
    initialize: {
      'node origin is requred': function(){
        if( this.origin === undefined ){
          return {error:'node is missing origin'};
        }
        if( !(typeof this.origin !== 'string' || typeof this.origin !== 'number') ){
          return {error:'node origin must be a string'};
        }
      }
    }
  };

  properties = {
    id: null,
    type: null,
  };

  observables = {

    x:0,
    y:0,
    w:0,
    h:0,
    H:0,
    r:0,
    b:0,
    p:0,
    s:0,

    selected: false,

    source: undefined,
    target: undefined,

    url: undefined, // JSON url
    src: undefined, // JSON url

    data: undefined, // JSON data

  }

  methods = {

    assign(meta, data){

      const nodeKeys = new Set([...Object.keys(this.oo.specification.properties), ...Object.keys(this.oo.specification.observables)]);
      const metaKeys = new Set([...Object.keys(meta)]);
      const commonProperties = intersection(nodeKeys, metaKeys);
      const newProperties = difference(metaKeys, commonProperties);
      for (const newProperty of newProperties) {
        this.oo.createObservable(newProperty, meta[newProperty])
      }
      Object.assign(this, meta, {data});
    },

    toObject(){
      const meta = {};
      const data = this.data;
      const object = {meta, data};

      for (const [name, value] of Object.entries(this.oo.specification.properties)) {
        console.log(this[name], name, value);
        if(this[name] !== value) meta[name] = this[name]
      }

      for (const [name, value] of Object.entries(this.oo.specification.observables).filter(([name])=>!['data'].includes(name))) {
        if(this[name] !==value) meta[name] = this[name];
      }

      for (const name of this.oo.newObservables) {
        meta[name] = this[name];
      }

      return object;
    },


    initialize(){

    },

    stop(){},

    destroy(){
      this.dispose()
    },

  }

}
