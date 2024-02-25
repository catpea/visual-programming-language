import Component from "/plug-ins/windows/Component.js";

export default class Container {

  static extends = [Component];

  methods = {
    initialize(){
      console.log(`%cContainer.initialize!`, 'background: hsl(180, 80%, 60%); color: black;');
    }
  }

}
