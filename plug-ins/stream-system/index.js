export class StreamSystem {

  root = null;

  constructor(root, options){
      this.root = root;
  }

  create(name, type){
    console.log('STREAM CREATE', this.root.id, name, type);
  }

  destroy(name){

  }


}

    //
    //
    //
    //
    //  this.read = new ReadableStream({
    //   start(controller) {
    //
    //     interval = setInterval(() => {
    //       let data = Math.random();
    //       controller.enqueue(data);
    //     }, 1000);
    //
    //     button.addEventListener('click', function() {
    //       clearInterval(interval);
    //       readStream();
    //       controller.close();
    //     })
    //
    //   },
    //   pull(controller) {
    //     // We don't really need a pull in this example
    //   },
    //   cancel() {
    //     // This is called if the reader cancels,
    //     // so we should stop generating strings
    //     clearInterval(interval);
    //   }
    // });
