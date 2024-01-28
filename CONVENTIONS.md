
## When Short
this.properties.observe("name", v=> {
  document.querySelector('title').innerText = v;
});

## When Long
// example of hoisting concepts from observable to event-like
this.properties.observe("started", started=>this.onStart({started}));

...
onStart({started}){

}
