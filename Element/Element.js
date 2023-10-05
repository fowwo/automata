const workspace = document.getElementById("workspace");

/** An element in the workspace. */
export default class Element {

	#x;
	#y;
	#moveListeners = new Set();

	/**
	 * @param {HTMLElement} element - The element to add to the workspace.
	 * @param {Number} x - The initial x position.
	 * @param {Number} y - The initial y position.
	 */
	constructor(element, x, y) {
		this.element = element;
		this.position = [ x, y ];
		workspace.appendChild(element);
	}

	get x() { return this.#x; }
	set x(x) {
		this.#x = x;
		this.element.style.setProperty("--x", `${x}px`);
		this.#notifyMoveListeners();
	}

	get y() { return this.#y; }
	set y(y) {
		this.#y = y;
		this.element.style.setProperty("--y", `${y}px`);
		this.#notifyMoveListeners();
	}

	get position() { return [ this.x, this.y ]; }
	set position([ x, y ]) {
		[ this.#x, this.#y ] = [ x, y ];
		this.element.style.setProperty("--x", `${x}px`);
		this.element.style.setProperty("--y", `${y}px`);
		this.#notifyMoveListeners();
	}

	addMoveListener(listener) {
		this.#moveListeners.add(listener);
	}
	removeMoveListener(listener) {
		this.#moveListeners.delete(listener);
	}
	#notifyMoveListeners() {
		for (const listener of this.#moveListeners) listener(this.position);
	}

}
