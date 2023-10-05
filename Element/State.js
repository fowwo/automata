import Anchor from "../Element/Anchor.js";
import Draggable from "../Element/Draggable.js";

const stateRadius = 50;
const arrowTipLength = 15;

/** A state in a diagram. */
export default class State extends Draggable {

	#span;
	#start;
	#arrow;
	#arrowLine;

	/**
	 * @param {Number} x - The initial x position.
	 * @param {Number} y - The initial y position.
	 * @param {Object} options - An object containing optional parameters.
	 * @param {String} [options.label] - The label of the state.
	 * @param {Boolean} [options.start] - Whether the state is a start state.
	 * @param {Boolean} [options.final] - Whether the state is a final state.
	 */
	constructor(x, y, { label = "", start = null, final = false } = {}) {
		const element = document.createElement("div");
		element.classList.add("state");
		super(element, x, y);

		this.#span = document.createElement("span");
		element.appendChild(this.#span);

		this.final = final;
		this.label = label;

		// Add start transition.
		this.#arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.#arrow.setAttribute("width", "1");
		this.#arrow.setAttribute("height", "1");
		this.#arrow.setAttribute("viewBox", "-0.5 -0.5 1 1");
		const { angle = 0, length = 75 } = start ?? {};

		this.#arrowLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
		for (const [ attribute, value ] of [
			[ "x1", length + stateRadius ], [ "x2", stateRadius ], [ "y1", 0 ], [ "y2", 0 ]
		]) this.#arrowLine.setAttribute(attribute, value);

		const tip1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
		for (const [ attribute, value ] of [
			[ "x1", stateRadius + arrowTipLength ], [ "x2", stateRadius ], [ "y1", -arrowTipLength ], [ "y2", 0 ]
		]) tip1.setAttribute(attribute, value);

		const tip2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
		for (const [ attribute, value ] of [
			[ "x1", stateRadius + arrowTipLength ], [ "x2", stateRadius ], [ "y1", arrowTipLength ], [ "y2", 0 ]
		]) tip2.setAttribute(attribute, value);

		this.#arrow.appendChild(this.#arrowLine);
		this.#arrow.appendChild(tip1);
		this.#arrow.appendChild(tip2);
		element.appendChild(this.#arrow);

		// Add anchor to start transition.
		this.start = start;
		const anchor = new Anchor(
			(length + stateRadius) * Math.cos(angle) + x,
			(length + stateRadius) * Math.sin(angle) + y,
			{
				movementFilter: ([ x, y ]) => {
					const [ px, py ] = this.position;

					// Snap to axis.
					const threshold = 10;
					if (Math.abs(x - px) < threshold) x = px;
					if (Math.abs(y - py) < threshold) y = py;

					// Force minimum length.
					const length = Math.sqrt((x - px) ** 2 + (y - py) ** 2) - stateRadius;
					const minimumLength = 2 * arrowTipLength;
					if (length < minimumLength) {
						const angle = Math.atan2(y - py, x - px);
						x = (minimumLength + stateRadius) * Math.cos(angle) + px;
						y = (minimumLength + stateRadius) * Math.sin(angle) + py;
					}

					return [ x, y ];
				}
			}
		);

		let blockAnchorListener = false;
		this.addMoveListener(([ x, y ], [ px, py ]) => {
			if (start === null) return;

			const [ ax, ay ] = anchor.position;
			const [ dx, dy ] = [ x - px, y - py ];

			blockAnchorListener = true;
			anchor.position = [ ax + dx, ay + dy ];
			blockAnchorListener = false;
		});
		anchor.addMoveListener(([ x, y ]) => {
			if (blockAnchorListener) return;

			const [ sx, sy ] = this.position;
			const [ dx, dy ] = [ x - sx, y - sy ];
			const angle = -Math.atan2(dx, dy) + Math.PI / 2;
			const length = Math.sqrt(dx ** 2 + dy ** 2) - stateRadius;
			this.start = { angle, length };
		});

		// Resize label when text or font changes.
		new ResizeObserver(([ entry ]) => {
			const { width } = entry.contentRect;
			this.#rescaleLabel(width);
		}).observe(this.#span);
	}

	get label() { return this.span.innerText; }
	set label(value) { this.#span.innerText = value; }

	get start() { return this.#start; }
	set start(value) {
		if (value === null) {
			this.#arrow.style.visibility = "hidden";
			this.#start = null;
			return;
		}

		if (this.#start) Object.assign(this.#start, value);
		else this.#start = value;

		const { angle, length } = this.#start;
		this.#arrowLine.setAttribute("x1", length + stateRadius);
		this.#arrow.style.rotate = `${angle}rad`;
		this.#arrow.style.visibility = "";
	}

	get final() { return this.element.classList.contains("final"); }
	set final(value) {
		if (value) this.element.classList.add("final");
		else this.element.classList.remove("final");

		// Resize label.
		const { width } = this.#span.getBoundingClientRect();
		const scale = this.#span.style.scale || 1;
		this.#rescaleLabel(width / scale);
	}

	#rescaleLabel(width) {
		const maxWidth = this.final ? 60 : 80;
		this.#span.style.scale = Math.min(1, maxWidth / width);
	}

}
