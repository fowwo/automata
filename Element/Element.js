/** An element in a diagram. */
export default class Element {

	#x;
	#y;
	#moveListeners = new Set();

	/**
	 * @param {HTMLElement} element - The element to add to the diagram.
	 * @param {Number} x - The initial x position.
	 * @param {Number} y - The initial y position.
	 */
	constructor(element, x, y) {
		this.element = element;
		this.position = [ x, y ];
	}

	get x() { return this.#x; }
	set x(x) {
		const px = this.x;
		this.#x = x;
		this.element.style.setProperty("--x", `${x}px`);
		this.#notifyMoveListeners([ px, this.y ]);
	}

	get y() { return this.#y; }
	set y(y) {
		const py = this.y;
		this.#y = y;
		this.element.style.setProperty("--y", `${y}px`);
		this.#notifyMoveListeners([ this.x, py ]);
	}

	get position() { return [ this.x, this.y ]; }
	set position([ x, y ]) {
		const previous = this.position;
		[ this.#x, this.#y ] = [ x, y ];
		this.element.style.setProperty("--x", `${x}px`);
		this.element.style.setProperty("--y", `${y}px`);
		this.#notifyMoveListeners(previous);
	}

	/** Appends the element to the diagram. */
	render() {
		document.getElementById("diagram").appendChild(this.element);
	}

	addMoveListener(listener) {
		this.#moveListeners.add(listener);
	}
	removeMoveListener(listener) {
		this.#moveListeners.delete(listener);
	}
	#notifyMoveListeners(previous) {
		for (const listener of this.#moveListeners) listener(this.position, previous);
	}

}
