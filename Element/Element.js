const workspace = document.getElementById("workspace");

export default class Element {

	#x;
	#y;

	constructor(element, x, y) {
		this.element = element;
		this.position = [ x, y ];
		workspace.appendChild(element);
	}

	get x() { return this.#x; }
	set x(x) {
		this.#x = x;
		this.element.style.setProperty("--x", `${x}px`);
	}

	get y() { return this.#y; }
	set y(y) {
		this.#y = y;
		this.element.style.setProperty("--y", `${y}px`);
	}

	get position() { return [ this.x, this.y ]; }
	set position([ x, y ]) {
		[ this.x, this.y ] = [ x, y ];
	}

}
