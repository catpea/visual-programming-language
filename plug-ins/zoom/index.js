export default class Zoom {

  component;
  element;
  zone;

  magnitude = 0.001;
  min = 0.1;
  max = 1_0;

  constructor({component, element, zone}){
    this.component = component;
    this.element = element;
    this.zone = zone;
    this.mount();
  }

  mount(){

    this.wheelHandler = (e) => {
      const zoom0 = this.component.zoom;
      const panX0 = this.component.panX;
      const panY0 = this.component.panY;
      const cursorX = e.x;
      const cursorY = e.y;

      let zoom1;
      zoom1 = zoom0 + (-e.deltaY) * ( this.magnitude * zoom0 ) ;
      zoom1 = Math.min(Math.max(this.min, zoom1), this.max); // clamp

      let panX1;
      let panY1;
      panX1 = cursorX - zoom1/zoom0 * (cursorX - panX0);
      panY1 = cursorY - zoom1/zoom0 * (cursorY - panY0);

      // // adjust
      // requestAnimationFrame(() => {
      //   this.element.style.scale = zoom1;
      //   this.element.style.transform = `translate(${panX1/zoom1}px,${panY1/zoom1}px)`;
      // });

      // inform others who maybe listening to s
      this.component.zoom = zoom1;
      this.component.panX = panX1;
      this.component.panY = panY1;
    };

    this.zone.addEventListener('wheel', this.wheelHandler, {passive: true});
    this.element.addEventListener('wheel', this.wheelHandler, {passive: true});
  }

  destroy(){
    this.removeStartedObserver();
    this.zone.removeEventListener('wheel', this.wheelHandler);
    this.element.removeEventListener('wheel', this.wheelHandler);
  }

}
