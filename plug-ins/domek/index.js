const kebabize = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())


const update = function(elements, properties) {
	const els = Array.isArray(elements) ? elements : [elements];
	for(const el of els) {
		for(const key in properties) {
			let value = properties[key];
			if(key=='style' && typeof value == 'object'){
				for (const name in value) {
					el.style[name] = value[name];
				}
				continue;
			}else if(typeof value == 'object'){
				value = Object.entries(value).map(([k,v])=>`${k}: ${v};`).join(' ')
			}
			if(el.namespaceURI == 'http://www.w3.org/2000/svg') {
				el.setAttributeNS(null, key, value);
			} else {
				el.setAttribute(key, value);
			}
		}
	}
}

const svg = new Proxy({}, {
	get: function(target, property) {
		return function(properties, text) {
			const el = document.createElementNS('http://www.w3.org/2000/svg', property);
			update(el, properties)
			if(text) el.appendChild(document.createTextNode(text));
			return el;
		}
	}
});

const xhtml = new Proxy({}, {
	get: function(target, property) {
		return function(properties, text) {
			const el = document.createElementNS('http://www.w3.org/1999/xhtml', property);
			update(el, properties)
			if(text) el.appendChild(document.createTextNode(text));
			return el;
		}
	}
});

const html = new Proxy({}, {
	get: function(target, property) {
		return function(properties, text) {
			const el = document.createElement(property);
			update(el, properties)
			if(text) el.appendChild(document.createTextNode(text));
			return el;
		}
	}
});












const list = (arrayList, rootElement) => {
	// Ensure that child nodes' count matches arrayList's length
	while(rootElement.childNodes.length > arrayList.length) {
		rootElement.removeChild(rootElement.lastChild);
	}

	arrayList.forEach((item, i) => {
		if('textContent' in item) { // It's a text node (typeof str === 'string')
			const textNode = rootElement.childNodes[i] || rootElement.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'text'));
			Object.assign(textNode, item);
		} else if(Array.isArray(item)) { // It's an array (group node)
			const groupNode = rootElement.childNodes[i] || rootElement.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
			list(item, groupNode);
		}
	});

	return rootElement;
}

const id = function(str = '') {
	return 'id' + str.replaceAll(/ |-/g, '0')
}

const text = function(text) {
	return document.createTextNode(text);
}




function back(element) {
	const parentElement = element.parentNode;

	// Remove element from its current position...
	parentElement.removeChild(element);

	// And insert it at the first position (at the back in SVG)
	parentElement.insertBefore(element, parentElement.firstChild);
}

function front(element) {
	const parentElement = element.parentNode;

	// Remove element from its current position...
	parentElement.removeChild(element);

	// And add it back, so it will be the last one (and thus at the front in SVG)
	parentElement.appendChild(element);
}

function keyboard(verify, callback) {
	// Create a function to handle the keydown event
	const listener = e => {
		if(verify(e)) {
			callback(e);
		}
	};
	// Add the listener
	document.addEventListener('keydown', listener);
	// Return a function to remove the listener
	return () => document.removeEventListener('keydown', listener);
}

function dataset(element, data){
	for (const key in data) {
		element.dataset[key] = data[key];
	}
}

function click(element, callback){
	element.addEventListener('mouseup', handler);
	function handler(event) {
		callback(event);
	}
	return ()=>	element.removeEventListener('mouseup', handler);
}

function dblclick(element, callback){
	element.addEventListener('dblclick', handler);
	function handler(event) {
		callback(event);
	}
	return ()=>	element.removeEventListener('dblclick', handler);
}

function mouse(element, on, off){
	element.addEventListener("mouseover", on);
	element.addEventListener("mouseout", off);
	return ()=>	{
		element.removeEventListener('mouseover', on);
		element.removeEventListener('mouseout', off);
	}

}

// fails in firefox
function clip(width, height, scale=1){
	return `path('M 0 0 L ${width*scale} 0 L ${width*scale} ${height*scale} L 0 ${height*scale} L 0 0 Z')`;
}



export {
	svg,
	html,
	xhtml,
	text,

	id,
	list,
	update,

	back,
	front,

	keyboard,
 

	click,
	dblclick,

	mouse,
	dataset,

	clip,

 };
