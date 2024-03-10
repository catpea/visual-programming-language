const EventEmitter = bundle['events'];

export class Pipe extends EventEmitter {

  input(data){
    console.log('pipe got input', data);
  }

}
