import {ObjectOrientedProgramming} from "#plug-ins/object-oriented-programming/index.js";

export default class TestBase {

  oop = new ObjectOrientedProgramming();

  properties = {
    name: 'kathunk',
    bork: null,
    nermal: true,
  };

  observables = {
    hello: 1,
    names: ['Bob'],
  };

  constraints = {
    started: {
      'nermal must be false before start': function(started){
        console.log({nermal:this.nermal, started});
        const wantsToStart = started===true;
        if(!wantsToStart) return;

        if(this.nermal===false){
         return;
        }else{
           return {error:'Nermal is not set to false'};
        }
      }

    }
  };

  methods = {

    helloWorld: function(){
      console.log('%c%s', 'color: white; background: red;', this.name);
    },

    helloBork: true

  };

  traits = {

    helloPlanet: function(){
      console.log('%c%s', 'color: yellow; background: red;', this.name);
    }

  };

  constructor(){
    this.oop.initialize(this);
  }

  start(){

  }

  stop(){

  }

  destroy(){

  }

  // ------------------------------------------------------------------------ //

  name = "Foo Bar";

  helloBork(){
    console.log('%c%s', 'color: orange; background: red;', this.name);

  }
}
