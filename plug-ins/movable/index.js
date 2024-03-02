// Installer
export default function movable(that, {handle}={}) {

  that.destructable = new Movable({
    handle
  });

}

// Feature
export class Movable {

  handle;

  constructor({handle}){
    this.handle = handle;
    this.mount();
  }

  mount(){

  }

  destroy(){

  }
}
