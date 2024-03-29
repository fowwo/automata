import Anchor from "./Anchor.js";
import Text from "./Text.js";
import State, { radius as stateRadius } from "./State.js";
import StraightArrow from "./StraightArrow.js";
import SVG from "./SVG.js";

const minimumRadius = 50;

/** A loop transition in a diagram. */
export default class Loop extends SVG {

	// Elements
	#state;
	#path;
	#label;
	#anchor;
	#arrowHead;

	// Path
	#angle;

	// Listeners
	#onStateMove;
	#onAnchorMove;

	/**
	 * @param {State} from - The state to transition from.
	 * @param {State} to - The state to transition to.
	 * @param {String} label - The label of the transition.
	 * @param {Number} [angle] - The angle of the transition.
	 */
	constructor(state, { label = "", angle = 0, radius = minimumRadius }) {
		super(...state.position);

		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		this.element.appendChild(path);
		this.element.classList.add("transition");

		this.#state = state;
		this.#path = path;
		this.#angle = angle;
		this.#arrowHead = new StraightArrow(...this.#state.position, { length: 0, offset: stateRadius });
		this.#renderPath();

		this.#label = new Text(...this.#getArcMidpoint());
		this.#label.element.innerText = label;
		this.#repositionLabel();

		this.#anchor = new Anchor(...this.#getArcMidpoint(), {
			movementFilter: ([ x, y ]) => {
				const [ cx, cy ] = this.#state.position;

				// Keep anchor outside of state.
				const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
				const offset = stateRadius + 50;
				if (distance > offset) return [ x, y ];

				const angle = Math.atan2(y - cy, x - cx);
				return [ offset * Math.cos(angle) + cx, offset * Math.sin(angle) + cy ];
			}
		});

		let blockAnchorListener = false;
		this.#onStateMove = () => {
			this.position = this.#state.position;
		}
		this.#onAnchorMove = ([ x, y ]) => {
			if (blockAnchorListener) {
				this.#repositionLabel();
				return;
			}

			const [ cx, cy ] = this.#state.position;
			const [ dx, dy ] = [ 0, 0 ];

			const m = Math.sqrt((cx - x) ** 2 + (cy - y) ** 2);
			const r = Math.sqrt(dx ** 2 + dy ** 2) / 2;
			const t = Math.atan2(dy, dx);
			const a = Math.atan2(y - cy, x - cx);

			const angle = 2 * Math.atan2(m, r + stateRadius);
			const flip = (t - a + 2 * Math.PI) % (2 * Math.PI) < Math.PI;
			this.#angle = flip ? -angle : angle;
			// }

			this.#renderPath();
			this.#repositionLabel();
		}

		this.#state.addMoveListener(this.#onStateMove);
		this.#anchor.addMoveListener(this.#onAnchorMove);
	}

	get state() { return this.#state; }
	set state(state) {
		this.#state.removeMoveListener(this.#onStateMove);
		this.#state = state;
		this.#state.addMoveListener(this.#onStateMove);
		this.#onStateMove();
	}

	get label() { return this.#label.element.innerText; }
	set label(text) {
		this.#label.element.innerText = text;
		this.#repositionLabel();
	}

	#renderPath() {
		const [ cx, cy ] = this.#state.position;

		const r = this.#getRadius();

		// console.log(this.#angle);
		// const t = Math.atan2(this.#anchor.y - cy, this.#anchor.x - cx);
		const t = 0;
		const [ x1, y1 ] = [ stateRadius * Math.cos(this.#angle + t), stateRadius * Math.sin(this.#angle + t) ];
		const [ x2, y2 ] = [ -stateRadius * Math.cos(this.#angle - t), stateRadius * Math.sin(this.#angle - t) ];

		const large = Math.abs(this.#angle) > Math.PI / 2;
		const flip = this.#angle < 0;
		this.#path.setAttribute("d", `M ${x1} ${y1} A ${r} ${r} 0 ${large ? 1 : 0} ${flip ? 1 : 0} ${x2} ${y2}`);
		this.#arrowHead.element.style.rotate = `${Math.PI - this.#angle + t}rad`;
	}
	#repositionLabel() {
		const [ cx, cy ] = this.#state.position;
		const [ dx, dy ] = [ 0, 0 ];
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

		const [ rx, ry ] = [ 0, 0 ];

		return (Math.sqrt(rx ** 2 + ry ** 2) - stateRadius * Math.cos(this.#angle)) / Math.sin(this.#angle);
	}
	#getArcMidpoint() {
		const [ cx, cy ] = this.#state.position;
		if (this.#angle === 0) return [ cx, cy ];

		const [ dx, dy ] = [ 0, 0 ];

		const r = this.#getRadius();
		const t = Math.atan2(dy, dx);

		const m = r - r * Math.cos(this.#angle) + stateRadius * Math.sin(this.#angle);
		return [ cx - m * Math.sin(t), cy + m * Math.cos(t) ];
	}	

}
