export class EventSystem {

  root = null;

  constructor(root, options){
      this.root = root;
  }

  create(name, type){
    console.log('EMITTER CREATE', this.root.id, name, type);
  }

  destroy(name){
    console.log('EMITTER DESTROY', name );
  }
}
