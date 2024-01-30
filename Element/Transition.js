import Anchor from "./Anchor.js";
import Text from "./Text.js";
import State, { radius as stateRadius } from "./State.js";
import StraightArrow from "./StraightArrow.js";
import SVG from "./SVG.js";

/** A transition in a diagram. */
export default class Transition extends SVG {

	// Elements
	#from;
	#to;
	#path;
	#label;
	#anchor;
	#arrowHead;

	// Path
	#angle;

	// Listeners
	#onStateMove;
	#onToMove;
	#onAnchorMove;

	/**
	 * @param {State} from - The state to transition from.
	 * @param {State} to - The state to transition to.
	 * @param {String} label - The label of the transition.
	 * @param {Number} [angle] - The angle of the transition.
	 */
	constructor(from, to, label, angle = 0) {
		super(...midpoint(from.position, to.position));

		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		this.element.appendChild(path);
		this.element.classList.add("transition");

		this.#from = from;
		this.#to = to;
		this.#path = path;
		this.#angle = angle;
		this.#arrowHead = new StraightArrow(...this.#to.position, { length: 0, offset: stateRadius });
		this.#renderPath();

		this.#label = new Text(...this.#getArcMidpoint());
		this.#label.element.innerText = label;
		this.#repositionLabel();

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

		let blockAnchorListener = false;
		this.#onStateMove = () => {
			this.position = midpoint(this.#from.position, this.#to.position);

			blockAnchorListener = true;
			this.#anchor.position = this.#getArcMidpoint();
			blockAnchorListener = false;

			this.#renderPath();
		}
		this.#onToMove = () => {
			this.#arrowHead.position = this.#to.position;
			this.#onStateMove();
		};
		this.#onAnchorMove = ([ x, y ]) => {
			if (blockAnchorListener) {
				this.#repositionLabel();
				return;
			}

			const [ ax, ay ] = this.#from.position;
			const [ bx, by ] = this.#to.position;
			const [ cx, cy ] = midpoint(this.#from.position, this.#to.position);
			const [ dx, dy ] = [ bx - ax, by - ay ];

			const m = Math.sqrt((cx - x) ** 2 + (cy - y) ** 2);
			const r = Math.sqrt(dx ** 2 + dy ** 2) / 2;
			const t = Math.atan2(dy, dx);
			const a = Math.atan2(y - cy, x - cx);

			const angle = 2 * Math.atan2(m, r + stateRadius);
			const flip = (t - a + 2 * Math.PI) % (2 * Math.PI) < Math.PI;
			this.#angle = flip ? -angle : angle;
			this.#renderPath();
			this.#repositionLabel();
		}

		this.#from.addMoveListener(this.#onStateMove);
		this.#to.addMoveListener(this.#onToMove);
		this.#anchor.addMoveListener(this.#onAnchorMove);
	}

	get from() { return this.#from; }
	set from(state) {
		this.#from.removeMoveListener(this.#onStateMove);
		this.#from = state;
		this.#from.addMoveListener(this.#onStateMove);
		this.#onStateMove();
	}

	get to() { return this.#to; }
	set to(state) {
		this.#to.removeMoveListener(this.#onToMove);
		this.#to = state;
		this.#to.addMoveListener(this.#onToMove);
		this.#onToMove();
	}

	get label() { return this.#label.element.innerText; }
	set label(text) {
		this.#label.element.innerText = text;
		this.#repositionLabel();
	}

	#renderPath() {
		const [ ax, ay ] = this.#from.position;
		const [ bx, by ] = this.#to.position;
		const [ rx, ry ] = [ (bx - ax) / 2, (by - ay) / 2 ];

		const r = this.#getRadius();
		const t = Math.atan2(ry, rx);

		const [ x1, y1 ] = [ -rx + stateRadius * Math.cos(this.#angle + t), -ry + stateRadius * Math.sin(this.#angle + t) ];
		const [ x2, y2 ] = [ rx - stateRadius * Math.cos(this.#angle - t), ry + stateRadius * Math.sin(this.#angle - t) ];

		const large = Math.abs(this.#angle) > Math.PI / 2;
		const flip = this.#angle < 0;
		this.#path.setAttribute("d", `M ${x1} ${y1} A ${r} ${r} 0 ${large ? 1 : 0} ${flip ? 1 : 0} ${x2} ${y2}`);
		this.#arrowHead.element.style.rotate = `${Math.PI - this.#angle + t}rad`;
	}
	#repositionLabel() {
		const [ ax, ay ] = this.#from.position;
		const [ bx, by ] = this.#to.position;
		const [ cx, cy ] = midpoint(this.#from.position, this.#to.position);
		const [ dx, dy ] = [ bx - ax, by - ay ];
		const [ x, y ] = this.#getArcMidpoint();

		const [ width, height ] = [ this.#label.element.offsetWidth, this.#label.element.offsetHeight ];
		const t = Math.atan2(dy, dx);
		const a = Math.atan2(y - cy, x - cx);
		const angle = t + Math.PI / 2;
		const distance = 10;

		if (this.#angle === 0) {
			const flip = 0 <= angle && angle <= Math.PI;
			const [ ox, oy ] = [
				(distance + width / 2) * Math.cos(angle),
				(distance + height / 2) * Math.sin(angle)
			];
			this.#label.position = flip ? [ x - ox, y - oy ] : [ x + ox, y + oy ];
			return;
		}

		const flip = (t - a + 2 * Math.PI) % (2 * Math.PI) < Math.PI;
		const [ ox, oy ] = [
			(distance + width / 2) * Math.cos(angle),
			(distance + height / 2) * Math.sin(angle)
		];
		this.#label.position = flip ? [ x - ox, y - oy ] : [ x + ox, y + oy ];
	}
	#getRadius() {
		if (this.#angle === 0) return 0;

		const [ ax, ay ] = this.#from.position;
		const [ bx, by ] = this.#to.position;
		const [ rx, ry ] = [ (bx - ax) / 2, (by - ay) / 2 ];

		return (Math.sqrt(rx ** 2 + ry ** 2) - stateRadius * Math.cos(this.#angle)) / Math.sin(this.#angle);
	}
	#getArcMidpoint() {
		const [ cx, cy ] = midpoint(this.#from.position, this.#to.position);
		if (this.#angle === 0) return [ cx, cy ];

		const [ ax, ay ] = this.#from.position;
		const [ bx, by ] = this.#to.position;
		const [ dx, dy ] = [ bx - ax, by - ay ];

		const r = this.#getRadius();
		const t = Math.atan2(dy, dx);

		const m = r - r * Math.cos(this.#angle) + stateRadius * Math.sin(this.#angle);
		return [ cx - m * Math.sin(t), cy + m * Math.cos(t) ];
	}	

}

function midpoint([ ax, ay ], [ bx, by ]) {
	return [ ax / 2 + bx / 2, ay / 2 + by / 2 ];
}