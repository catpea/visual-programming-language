const EventEmitter = bundle['events'];

export class Pipe extends EventEmitter {
  id;
  direction;

  constructor(id, direction){
    super();
    this.id = id;
    this.direction = direction;
  }

  input(data){
    console.log('pipe got input', data);
  }

}
