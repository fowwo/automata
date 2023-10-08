import SVG from "./SVG.js";

const defaultLength = 30;
const defaultHeadLength = 15 * Math.SQRT2;

/** A straight arrow. */
export default class StraightArrow extends SVG {

	#length;
	#headLength;
	#offset;
	#line;
	#head1;
	#head2;

	/**
	 * @param {Number} x - The initial x position.
	 * @param {Number} y - The initial y position.
	 * @param {Object} [options] - An object containing optional parameters.
	 * @param {Number} [options.length] - The length of the arrow.
	 * @param {Number} [options.headLength] - The length of each arrow head line.
	 * @param {Number} [options.offset] - The distance from the tip of the arrow head to the origin.
	 */
	constructor(x, y, { length = defaultLength, headLength = defaultHeadLength, offset = 0 } = {}) {
		super(x, y);
		console.log(this);

		this.#length = length;
		this.#headLength = headLength;
		this.#offset = offset;

		const n = headLength / Math.SQRT2;

		this.#line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		for (const [ attribute, value ] of [
			[ "x1", length + offset ], [ "x2", offset ], [ "y1", 0 ], [ "y2", 0 ]
		]) this.#line.setAttribute(attribute, value);
		
		this.#head1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
		for (const [ attribute, value ] of [
			[ "x1", n + offset ], [ "x2", offset ], [ "y1", -n ], [ "y2", 0 ]
		]) this.#head1.setAttribute(attribute, value);

		this.#head2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
		for (const [ attribute, value ] of [
			[ "x1", n + offset ], [ "x2", offset ], [ "y1", n ], [ "y2", 0 ]
		]) this.#head2.setAttribute(attribute, value);

		this.element.appendChild(this.#line);
		this.element.appendChild(this.#head1);
		this.element.appendChild(this.#head2);
	}

	get length() { return this.#length; }
	set length(value) {
		this.#length = value;
		this.#line.setAttribute("x1", this.#length + this.#offset);
	}

	get headLength() { return this.#headLength; }
	set headLength(value) {
		this.#headLength = value;
		
		const n = this.#headLength / Math.SQRT2;
		for (const [ attribute, value ] of [ [ "x1", n + offset ], [ "y1", -n ] ]) this.#head1.setAttribute(attribute, value);
		for (const [ attribute, value ] of [ [ "x1", n + offset ], [ "y1", n ] ]) this.#head2.setAttribute(attribute, value);
	}

	get offset() { return this.#offset; }
	set offset(value) {
		this.#offset = value;
		
		const n = this.#headLength / Math.SQRT2;
		for (const [ attribute, value ] of [ [ "x1", this.#length + offset ], [ "x2", offset ] ]) this.#line.setAttribute(attribute, value);
		for (const [ attribute, value ] of [ [ "x1", n + offset ], [ "x2", offset ], ]) this.#head1.setAttribute(attribute, value);
		for (const [ attribute, value ] of [ [ "x1", n + offset ], [ "x2", offset ], ]) this.#head2.setAttribute(attribute, value);
	}

}
