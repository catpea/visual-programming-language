export default class Movable {

  parent; // parent container

  #delta = 0.001;
  #min = 0.1;
  #max = 1_0;

  #wheelHandler;
  #removeStartedObserver;
  #container;
  #element;

  constructor(delta){
    if(delta) this.#delta = delta;
  }

  start(){
    // this.#removeStartedObserver = this.container.observe('started', started=>{
      // if(started){

        this.begin({
            container: this.parent,
              element: this.parent.screen,
                 read: (property) => this.parent.style[property],
                write: (property, value) => this.parent.style[property] = value,
        })

  //    }// is started
    //})// observe

  }


  begin({ container, element, read, write }) {
    this.#container = container;
    this.#element = element;

    this.#wheelHandler = (e) => {
      let scale = this.#element.style.scale;
      if (scale === ''){
        scale = 1.0;
      }else{
        scale = parseFloat(scale);
      }
      scale = scale + (e.deltaY * -(this.#delta*this.#container.s));
      // NOTE: *this.#container.s is to adjust mouse for existing scale change

      // Clamp
      scale = Math.min(Math.max(this.#min, scale), this.#max);

      // adjust
      requestAnimationFrame(() => {
        this.#element.style.scale = scale;
      });

      // inform others who maybe listening to s
      this.#container.s = scale;
    };

    this.#element.addEventListener('wheel', this.#wheelHandler);
  }

  stop() {
    this.#removeStartedObserver();
    this.#element.removeEventListener('wheel', this.#wheelHandler);
  }
  
}
