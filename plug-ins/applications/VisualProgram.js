import Concept from "/plug-ins/windows/Concept.js";

export default class VisualProgram {

  static extends = [Concept];

  // methods = {
  //   initialize: true,
  // };

  methods = {
    initialize(){
      if(!this.oo) throw new Error("VisualProgram oo Not Found")
      console.log(`%cVisualProgram.initialize!`, 'background: hsl(180, 70%, 60%); color: black;');

      console.log('FF initialize VisualProgram',   this);
      // console.log( this.oo.specifications.map(o=>({name: o.constructor.name, super:o.methods?.initialize})) );
      // ADD DRAGGABLE CAPTION
      // ADD DRA-AND-DROP TOOLBAR
      // ADD VPL ZONE
    }
  }

}
