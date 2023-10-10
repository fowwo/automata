import Element from "./Element.js";

/** A span element in the workspace. */
export default class Text extends Element {

	/**
	 * @param {Number} x - The initial x position.
	 * @param {Number} y - The initial y position.
	 */
	constructor(x, y) {
		const element = document.createElement("span");
		super(element, x, y);
	}

}
