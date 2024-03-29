import SVG from "./SVG.js";

const defaultLength = 30;
const defaultHeadLength = 15;

/** An arrow. */
export default class Arrow extends SVG {

	#from;
	#to;
	#radius;
	#large;
	#flip;

	/**
	 * @param {[ Number, Number ]} from - The start position of the arrow.
	 * @param {[ Number, Number ]} to - The end position of the arrow.
	 * @param {Object} [options] - An object containing optional parameters.
	 * @param {Number} [options.length] - The length of each line.
	 * @param {Number} [options.offset] - The distance from the tip of the arrow head to the origin.
	 * @param {Number} [options.angle] - The angle of the arrow head, in radians.
	 */
	constructor(from, to, { length = defaultHeadLength, offset = 0, angle = 0 } = {}) {
		const [ ax, ay ] = from;
		const [ bx, by ] = to;
		super(ax / 2 + bx / 2, ay / 2 + by / 2);

		for (const line of createArrowHeadLines({ length, offset })) this.element.appendChild(line);
		this.element.style.rotate = `${angle}rad`;
	}

	get from() { return this.#from; }
	set from(position) {
		this.#from = position;
		this.position = this.#getCenter();
		this.#render();
	}

	get to() { return this.#to; }
	set to(position) {
		this.#to = position;
		this.position = this.#getCenter();
		this.#render();
	}

	get radius() { return this.#radius; }
	set radius(value) {
		this.#radius = value;
		this.#render();
	}

	get large() { return this.#large; }
	set large(value) {
		this.#large = value;
		this.#render();
	}

	get flip() { return this.#flip; }
	set flip(value) {
		this.#flip = value;
		this.#render();
	}

	#getCenter() {
		const [ ax, ay ] = this.from;
		const [ bx, by ] = this.to;
		return [ ax / 2 + bx / 2, ay / 2 + by / 2 ];
	}

	#render() {
		const [ ax, ay ] = this.#from;
		const [ bx, by ] = this.#to;

		const [ x1, y1 ] = [ (ax - bx) / 2, (ay - by) / 2 ];
		const [ x2, y2 ] = [ (bx - ax) / 2, (by - ay) / 2 ];

		this.#path.setAttribute("d", `M ${x1} ${y1} A ${this.#radius} ${this.#radius} 0 ${this.#large ? 1 : 0} ${this.#flip ? 1 : 0} ${x2} ${y2}`);
	}
}

/**
 * Creates the two line elements of the arrow head.
 * @param {Object} options - An object containing optional parameters.
 * @param {Number} [options.length] - The length of each line.
 * @param {Number} [options.offset] - The distance from the tip of the arrow head to the origin.
 * @returns 
 */
export function createArrowHeadLines({ length = defaultHeadLength, offset = 0 } = {}) {
	const n = length / Math.SQRT2;

	const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
	for (const [ attribute, value ] of [
		[ "x1", offset + n ], [ "x2", offset ], [ "y1", -n ], [ "y2", 0 ]
	]) line1.setAttribute(attribute, value);

	const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
	for (const [ attribute, value ] of [
		[ "x1", offset + n ], [ "x2", offset ], [ "y1", n ], [ "y2", 0 ]
	]) line2.setAttribute(attribute, value);

	return [ line1, line2 ];
}
