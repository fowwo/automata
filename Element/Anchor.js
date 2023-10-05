import Draggable from "./Draggable.js";

export default class Anchor extends Draggable {

	/**
	 * @param {Number} x - The initial x position.
	 * @param {Number} y - The initial y position.
	 * @param {Object} options - An object containing optional parameters.
	 * @param {([ x, y ]: [ Number, Number ]) => [ Number, Number ]} [options.movementFilter] - A function to intercept and control movement.
	 */
	constructor(x, y, options = {}) {
		const element = document.createElement("div");
		element.classList.add("anchor");
		super(element, x, y, options);
	}

}
