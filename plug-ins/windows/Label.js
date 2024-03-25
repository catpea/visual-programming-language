import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Control from "/plug-ins/windows/Control.js";
import Anchor from "/plug-ins/windows/Anchor.js";
import { svg, update, click, text } from "/plug-ins/domek/index.js"

export default class Label {

  static extends = [Control];

  properties = {
    handle:null,
  };

  observables = {
    text: '',
  };

  constraints = {
    mount: {
      '.scene is required to start the universe': function(){ if(!this.scene){return {error:'.svg not found'}} },
    }
  }

  methods = {

    initialize(){
      // console.log(`%cComponent.initialize!`, 'background: hsl(180, 80%, 60%); color: black;', this);
      this.s = 3; // nudge text away from border
    },

    mount(){

      this.el.Container = svg.rect({
        name: this.name,
        class: 'editor-label',
        'vector-effect': 'non-scaling-stroke',
        ry: this.r,
        // set initial values
        // these are special, handeled by the layout manager
        // NOTE: these are observables, getter returns a value, setter notifies listeners, and you can ```this.observe('x', v=>{...})```
        width: this.w,
        height: this.h,
        x: this.x,
        y: this.y,
      });
      this.handle = this.el.Container;


      this.el.ClipPath = svg.clipPath({
        id: `clip-path-${this.id}`,
      });
      const clipPathRect = svg.rect({
        x: this.x,
        y: this.y,
        width: this.w,
        height: this.h,
      });
      this.el.ClipPath.appendChild(clipPathRect);
      // 'clip-path': `url(#clip-path-${this.id})`,

      this.el.Caption = svg.text({
        name: this.name,
        class: 'editor-label-text',
        'dominant-baseline': 'hanging',
        'clip-path': `url(#clip-path-${this.id})`,
        x: this.x,
        y: this.y,
      });

      const updateZUI = function(el, zuiAttributes, standardAttributes){
        if(globalThis.project.zoom>1){
          update(el, zuiAttributes);
        }else{
          update(el, standardAttributes);
        }
      }
      globalThis.project.on('zoom', v=> requestAnimationFrame(() => {

        updateZUI(this.el.Caption, { style: {scale:1/globalThis.project.zoom}, x: (this.x+this.s)*globalThis.project.zoom, y: (this.y+this.s)*globalThis.project.zoom, }, {style: {scale:1}, x: (this.x+this.s), y: (this.y+this.s), })
        updateZUI(clipPathRect, { x: this.x*globalThis.project.zoom, y: this.y*globalThis.project.zoom, width: this.w*globalThis.project.zoom, height: this.h*globalThis.project.zoom, }, { x: this.x, y: this.y, width: this.w, height: this.h})

      }));


      const captionText = text(this.text);
      this.el.Caption.appendChild(captionText);

      this.on("selected", selected => selected?this.el.Container.classList.add('selected'):this.el.Container.classList.remove('selected'));

      // this.disposable = click( this.el.Container, e=>{
      //   // console.log('CLICKED', this.parent.data.id, this, this.parent);
      // });

      this.on('name',  name=>update(this.el.Container,{name}), );
      this.on('w',  width=>update(this.el.Container,{width}), );
      this.on('h', height=>update(this.el.Container,{height}),);
      this.on('x',      x=>update(this.el.Container,{x}),     );
      this.on('y',      y=>update(this.el.Container,{y}),     );
      this.on('r',     ry=>update(this.el.Container,{ry}),     );

      this.on('text',  text=>captionText.nodeValue = text);
      this.any(['x','y'], ({x, y})=>  updateZUI(this.el.Caption, { x: (x+this.s)*globalThis.project.zoom, y: (y+this.s)*globalThis.project.zoom, }, {style: {scale:1}, x: (x+this.s), y: (y+this.s) })  )
      this.any(['x','y','w', 'h'], ({x,y,w:width,h:height})=>     updateZUI(clipPathRect, { x: x*globalThis.project.zoom, y: y*globalThis.project.zoom, width: width*globalThis.project.zoom, height: this.h*globalThis.project.zoom }, { x, y, width, height}) )

      this.appendElements();

    },

    destroy(){
      this.removeElements()
    }

  }

}
