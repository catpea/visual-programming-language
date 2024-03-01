// Installer - must be run in mount() once all alements are in the DOM
export default function zoom(that) {

  that.destructable = new Zoom({
    container: that,
    element: that.scene,
    zone: that.background,
  });

}

// Feature
export class Zoom {

  container;
  element;
  zone;

  delta = 0.001;
  min = 0.1;
  max = 1_0;

  constructor({container, element, zone}){
    this.container = container;
    this.element = element;
    this.zone = zone;
    this.mount();
  }

  mount(){

    this.wheelHandler = (e) => {

      let scale = this.element.style.scale;
      if (scale === ''){
        scale = 1.0;
      }else{
        scale = parseFloat(scale);
      }

      scale = scale + (e.deltaY * -( this.delta * this.container.zoom ));
      // NOTE: this.container.zoom is to adjust mouse for existing scale change

      // Clamp
      scale = Math.min(Math.max(this.min, scale), this.max);

      // adjust
      requestAnimationFrame(() => {
        this.element.style.scale = scale;
      });

      // inform others who maybe listening to s
      this.container.zoom = scale;
    };

    this.zone.addEventListener('wheel', this.wheelHandler, {passive: true});
  }

  destroy(){
    this.removeStartedObserver();
    this.zone.removeEventListener('wheel', this.wheelHandler);
  }

}
