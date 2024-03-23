import {Instance} from "/plug-ins/object-oriented-programming/index.js";


const typeOf = function(variable){
  if (Array.isArray(variable)) return 'Array';
  if (typeof variable === 'function') return 'Function';
  if (Object(variable) === variable) return 'Object';
}
const byType = function(input){
  const response = {};
  for (const variable of input) {
    // console.log(typeOf(variable), variable);
    response[typeOf(variable)] = variable;
  }
  return response;
}
export function nest(Type, ...input){
  if(!Type) return;
  const {Object:attr, Array:children, Function:init} = byType(input);
  const instance = new Instance(Type, attr);
  if(init) init(instance, this?this.parent:null)
  return [ instance, children?.map(child=>nest.bind({parent:instance})(...child)).map(([ins,chi])=>chi?[ins,chi]:ins) ];
}
