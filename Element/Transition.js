import Anchor from "../Element/Anchor.js";
import Element from "../Element/Element.js";
import State from "./State.js";

/** A transition in a diagram. */
export default class Transition extends Element {

	// Elements
	#from;
	#to;
	#path;
	#anchor;

	// Path
	#radius;
	#large;
	#flip;

	/**
	 * @param {State} from - The state to transition from.
	 * @param {State} to - The state to transition to.
	 * @param {Number} r - The radius of the transition arc.
	 * @param {Boolean} large - Whether the arc's central angle is larger than 180 degrees.
	 * @param {Boolean} flip - Whether the arc should be flipped.
	 */
	constructor(from, to, r, large, flip) {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		svg.classList.add("transition");
		svg.appendChild(path);
		svg.setAttribute("width", "1");
		svg.setAttribute("height", "1");
		svg.setAttribute("viewBox", "-0.5 -0.5 1 1");

		super(svg, ...midpoint(from.position, to.position));
		this.#path = path;
		this.#from = from;
		this.#to = to;
		this.#radius = r;
		this.#large = large;
		this.#flip = flip;
		this.#renderPath();

		this.#anchor = new Anchor(...this.#getArcMidpoint(), {
			movementFilter: ([ x, y ]) => {
				const [ ax, ay ] = this.#from.position;
				const [ bx, by ] = this.#to.position;
				const [ cx, cy ] = midpoint(this.#from.position, this.#to.position);
				const [ dx, dy ] = [ bx - ax, by - ay ];

				const getPosition = (x, y) => {
					// Handle horizontal and vertical lines.
					if (dy === 0) return [ cx, y ];
					if (dx === 0) return [ x, cy ];

					// Lock anchor movement to a straight line.
					const m = -dx / dy;
					const ix = (cx * m + x / m - cy + y) / (m + 1 / m);
					const iy = m * (ix - cx) + cy;
					return [ ix, iy ];
				};

				[ x, y ] = getPosition(x, y);
				const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
				if (distance < 10) return [ cx, cy ]; // Snap anchor to center.
				return [ x, y ];
			}
		});

		let blockAnchorMove = false;
		const onStateMove = () => {
			this.position = midpoint(this.#from.position, this.#to.position);

			blockAnchorMove = true;
			this.#anchor.position = this.#getArcMidpoint();
			blockAnchorMove = false;

			this.#renderPath();
		}
		const onAnchorMove = () => {
			if (blockAnchorMove) return;
			const [ x, y ] = this.#anchor.position;
			const [ ax, ay ] = this.#from.position;
			const [ bx, by ] = this.#to.position;
			const [ cx, cy ] = midpoint(this.#from.position, this.#to.position);
			const [ dx, dy ] = [ bx - ax, by - ay ];
			const c = Math.sqrt(dx ** 2 + dy ** 2) / 2;
			const a = Math.sqrt((cx - x) ** 2 + (cy - y) ** 2);
			this.#radius = a === 0 ? 0 : (a ** 2 + c ** 2) / (2 * a);

			const cbAngle = (Math.atan2(bx - cx, by - cy) + 2 * Math.PI) % (2 * Math.PI);
			const cpAngle = (Math.atan2(x - cx, y - cy) + 2 * Math.PI) % (2 * Math.PI);
			const angle3 = (cbAngle - cpAngle + 2 * Math.PI) % (2 * Math.PI);
			this.#flip = angle3 > Math.PI;
			this.#large = a > c;
			this.#renderPath();
		}

		this.#from.addMoveListener(onStateMove.bind(this));
		this.#to.addMoveListener(onStateMove.bind(this));
		this.#anchor.addMoveListener(onAnchorMove.bind(this));

	}

	#renderPath() {
		const [ ax, ay ] = this.#from.position;
		const [ bx, by ] = this.#to.position;
		const [ x1, y1 ] = [ (ax - bx) / 2, (ay - by) / 2 ];
		const [ x2, y2 ] = [ (bx - ax) / 2, (by - ay) / 2 ];

		const r = this.#radius;
		this.#path.setAttribute("d", `M ${x1} ${y1} A ${r} ${r} 0 ${this.#large ? 1 : 0} ${this.#flip ? 1 : 0} ${x2} ${y2}`);
	}
	#getArcMidpoint() {
		const [ ax, ay ] = this.#from.position;
		const [ bx, by ] = this.#to.position;
		const [ cx, cy ] = midpoint(this.#from.position, this.#to.position);
		if (this.#radius === 0) return [ cx, cy ];

		const [ dx, dy ] = [ bx - ax, by - ay ];
		const c = Math.sqrt(dx ** 2 + dy ** 2) / 2;
		const angle = Math.atan2(dy / 2, dx / 2) + Math.PI / 2;
		const m = c >= this.#radius ? c * (this.#flip ? -1 : 1)
			: (this.#radius + Math.sqrt(this.#radius ** 2 - c ** 2) * (this.#large ? 1 : -1)) * (this.#flip ? -1 : 1);

		return [ cx + m * Math.cos(angle), cy + m * Math.sin(angle) ];
	}	

}

function midpoint([ ax, ay ], [ bx, by ]) {
	return [ ax / 2 + bx / 2, ay / 2 + by / 2 ];
}
