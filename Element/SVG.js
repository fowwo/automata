import Element from "./Element.js";

/** An SVG element in a diagram. */
export default class SVG extends Element {

	/**
	 * @param {Number} x - The initial x position.
	 * @param {Number} y - The initial y position.
	 */
	constructor(x, y) {
		const element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		element.setAttribute("width", "1");
		element.setAttribute("height", "1");
		element.setAttribute("viewBox", "-0.5 -0.5 1 1");
		super(element, x, y);
	}

}
