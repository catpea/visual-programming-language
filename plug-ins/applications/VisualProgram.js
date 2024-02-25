import Concept from "#plug-ins/windows/Concept.js";

export default class VisualProgram {

  static extends = [Concept];

  initialize(){
    // if(!this.Superclass) throw new Error("Superclass Not Found")
    console.log('FF initialize VisualProgram', this.data?.id, this);
    // this.super.initialize();
    // ADD DRAGGABLE CAPTION
    // ADD DRA-AND-DROP TOOLBAR
    // ADD VPL ZONE
  }

}
