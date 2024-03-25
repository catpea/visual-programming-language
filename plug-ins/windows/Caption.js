import {Instance} from "/plug-ins/object-oriented-programming/index.js";

import Horizontal from "/plug-ins/windows/Horizontal.js";
import Control from "/plug-ins/windows/Control.js";
import Label from "/plug-ins/windows/Label.js";
import Anchor from "/plug-ins/windows/Anchor.js";

import { svg, update, click } from "/plug-ins/domek/index.js"
import {nest} from "/plug-ins/nest/index.js";

export default class Caption {

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
    },

    mount(){

      this.createControlAnchor({ name: 'input', side: 0 });
      this.createControlAnchor({ name: 'output', side: 1 });

      const [horizontal, [ info1, info2 ]] = nest(Horizontal, { parent:this, scene:this.scene }, [
        [Label, {h: 24,       text: this.text, parent:this}, (c,p)=>p.children.create(c)],
        [Label, {h: 24, W:24, text: '^', parent:this}, (c,p)=>p.children.create(c)],
      ], (c)=>{
        this.destructable = ()=>{c.stop(); c.destroy();}
      })
      this.handle = info1.el.Container;
      horizontal.start()

      this.on("selected", selected => selected?info1.el.Container.classList.add('selected'):info1.el.Container.classList.remove('selected'));
      this.on('text',  text=>info1.text=text, );
      this.any(['x','y','w','h',  ],  ({x,y,w,h})=>Object.assign(horizontal, {x,y,w,h }));


      let maximizer;
      let maximized = false;
      let restoreWindow = {};
      let restoreZoomPan = {};
      this.disposable = click(info2.handle, e=>{
        console.log('maximized', maximized);
        if(maximized){
          console.log('MINIMIZE', maximizer);
          maximizer.map(a=>a())
          maximized = false;
          Object.assign(this.getRootContainer(),restoreWindow)
          Object.assign(globalThis.project,restoreZoomPan)
        }else{
          console.log('MAXIMIZE!');
          restoreWindow = {
            x:this.getRootContainer().x,
            y:this.getRootContainer().y,
            w:this.getRootContainer().w,
            h:this.getRootContainer().h,
          };
          restoreZoomPan = {
            panX: globalThis.project.panX,
            panY: globalThis.project.panY,
            zoom: globalThis.project.zoom,
          };

          const handler = ()=>{
            this.getRootContainer().x = 0 - (globalThis.project.panX / globalThis.project.zoom);
            this.getRootContainer().y = 0 - (globalThis.project.panY / globalThis.project.zoom);
            this.getRootContainer().w = globalThis.project.w / globalThis.project.zoom;
            this.getRootContainer().h = globalThis.project.h / globalThis.project.zoom;
          };
          maximizer = globalThis.project.any(['zoom', 'panX', 'panY', 'w', 'h'], handler);
          handler()
          console.log('maximizer', maximizer);
          maximized = true;
        }



        console.log({
          x:this.getRootContainer().x,
          y:this.getRootContainer().y,
          w:this.getRootContainer().w,
          h:this.getRootContainer().h,
        });
      });

    },

    destroy(){
      this.removeElements()
    }

  }

}
