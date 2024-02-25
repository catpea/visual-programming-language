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
      console.dir(this);

      // console.log( this.oo.specifications.map(o=>({name: o.constructor.name, super:o.methods?.initialize})) );
      // ADD DRAGGABLE CAPTION
      // ADD DRA-AND-DROP TOOLBAR
      // ADD VPL ZONE


      setInterval(x=>{


        this.data.x = this.data.x + this.getRandomIntInclusive(-1,1);
        this.data.y = this.data.y + this.getRandomIntInclusive(-1,1);

        // console.log(  this.data.x);
      }, 1_000/32);

    },

  }

}
