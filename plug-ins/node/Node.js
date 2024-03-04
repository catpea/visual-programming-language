
export default class Node {

  state = {
    current: 'initial',
    initial: {
       run: 'initialize',
     },
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

    source: undefined,
    target: undefined,
    url: undefined, // JSON url
    src: undefined, // JSON url

    data: undefined, // JSON data

  }

  methods = {

    toObject(){

      const meta = {};
      const data = this.data;
      const object = {meta, data};

      for (const [name, value] of Object.entries(this.oo.specification.properties)) {
        console.log(this[name], name, value);
        if(this[name] !== value) meta[name] = this[name]
      }
      for (const [name, value] of Object.entries(this.oo.specification.observables).filter(([name])=>!['data'].includes(name))) {
        if(this[name] !==value) meta[name] = this[name]
      }

      return object;
    },

    initialize(){
      this.on('data', data => {
        // console.log('node got data', data);
      })
      this.on('url', url => {
        // console.log('node got url', url);
      })
    }

  }

}
