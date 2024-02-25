/* README

  container has a layout manager associated with it
	layout managers are needed to allow HBox and VBox calculations
  component addition triggers registration/addition and from there it is all reactive.
  Component's setBounds called: and component is positioned

	VBox Layout manager, ultimatley wants to correctly set its own .h,
	it is civen all the children for that purpose, and it will use the H of the children.

	A child either has a pre-set height as the case is with controls,
	or a height that may change as the case it with containers that may receive more children.

	BUT THEY MANAGE THEIR OWN HEIGHT,
	NEVER CHANGE THE HEIGHT OF A CHILD,
	just set their x and y in relation to the H of other children
	and then set your own H.

*/



const BOTH_SIDES = 2

export class Layout {

	container;

	constructor(container){
		this.container = container;
	}

	manage(child) {
		// called whn a child is added
	}

	calculateChildW() {
		// NOTE: this width is the widh of litte UI inside a node
		// to calculate the width of a child, you need to look at the space the container has
		return 320 * Math.random();
	}
	calculateH() {
		//NOTE: this height is the height of a litte UI component inside the node UI
		// often a child will set its own height, but look at the area container has and number of children in HBox case
		return 200 * Math.random();
	}
	calculateChildX(container, child) {
		// NOTE: this x is not the x of the visual programming node, this x is that of nested UI components within it
		// x is relative to the container x
		return 800 * Math.random();
	}
	calculateChildY(container, child) {
		// NOTE: this y is not the y of the visual programming node, this y is that of nested UI components within it
		return 600 * Math.random();
	}

	above(container, child) { return container.children.slice(0, container.children.indexOf(child)); }
	#cleanup = [];
	cleanup(...arg){ this.#cleanup.push(...arg); }

}

export class VerticalLayout extends Layout {



	manage(child) {

		// you are the layout manager for this.component
		// you have 2 DIFFERENT responsobilities
		// RESPOSIBILITY #1: set the x and y of children - THIS IS THE MAIN THING THAT LAYOUT MANAGERS DO!
		// RESPOSIBILITY #2: set the h of this container to correctly contain the newly layed out children
		//                   set the w of this component...

		child.x = this.calculateChildX(child);
		child.y = this.calculateChildY(child);
		child.w = this.calculateChildW(child);

		// at the same time, be aware that parent will set your X/Y
		// so monotor it!
		this.container.properties.observe('x', () => child.x = this.calculateChildX(child) );
		this.container.properties.observe('y', () => child.y = this.calculateChildY(child) );
		this.container.properties.observe('w', () => child.w = this.calculateChildW(child) );

		// child.properties.observe('H', () => this.container.h = this.calculateH() );
		// this.container.properties.observe('H', () => child.y = this.calculateChildY(child) );

		// when a child changes size update the container height
		child.properties.observe('h', () => this.container.h = this.calculateH() );

		// when container changes size, this child needs to update its Y.
		this.container.properties.observe('h', () => child.y = this.calculateChildY(child) );



	}

	calculateChildW(child) {
		// console.log(`Calculating child width in ${this.container.name} for child ${child.name||child.text}`);
		// console.log(`My width is ${this.container.w}.`);
		const response =
			this.container.w -
			((this.container.b + this.container.p) * BOTH_SIDES) // REMOVE SPACE USED BY PARENT PADDING

		// console.log(`Returning ${response}`);
		return response;
	}

	calculateH() {
		let heightOfChildren = 0;
		const children = this.container.children;
		heightOfChildren = children.reduce((total, c) => total + (c.h), 0) +
				((this.container.s * 2) * (children.length > 0 ? children.length - 1 : 0 /* not counting gap in last child as it does not have one*/ ))


		let response =
			this.container.b +
			this.container.p +
			// this.container.H + // NOT A MISTAKE design can hold a base h that is used in calculations
			heightOfChildren +
		  this.container.p +
			this.container.b;

			// if(response < this.container.H) response = this.container.H; // hard height (min-height)
			if(response < this.container.H) response = this.container.H; // hard height (min-height)

		return response;
	}

	calculateChildX() {
		const response =
		  this.container.x + // use my own x
			this.container.b + // add border
			this.container.p; // add padding
		return response; // that is the child x
	}

	calculateChildY(child) {
		//console.log();
		const response =
			this.container.y +
			this.container.b +
			this.container.p +
			this.above(this.container, child).reduce((total, child) => total + child.h, 0) +
			((this.container.s * 2) * this.above(this.container, child).length);

		return response;
	}



}

export class HorizontalLayout extends Layout {

}

export class ManualLayout extends Layout {

}
