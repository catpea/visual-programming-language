
export default class Node {

  state = {
    current: 'initial',
    initial: {
       run: 'initialize',
     },
  };

  properties = {
    id: null,
  };

  observables = {

    x:0,
    y:0,
    w:32,
    h:32,
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
