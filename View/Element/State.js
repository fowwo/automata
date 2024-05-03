import Anchor from "../Element/Anchor.js";
import Draggable from "../Element/Draggable.js";
import StraightArrow from "./StraightArrow.js";

export const radius = 50;

/** A state in a diagram. */
export default class State extends Draggable {

	#span;
	#arrow;
	#anchor;

	/**
	 * @param {Number} x - The initial x position.
	 * @param {Number} y - The initial y position.
	 * @param {Object} options - An object containing optional parameters.
	 * @param {String} [options.label] - The label of the state.
	 * @param {Object} [options.start] - The properties of the start transition.
	 * @param {Number} [options.start.angle] - The angle of the start transition.
	 * @param {Number} [options.start.length] - The length of the start transition.
	 * @param {Boolean} [options.accept] - Whether the state is an accept state.
	 */
	constructor(x, y, { label = "", start = null, accept = false } = {}) {
		const element = document.createElement("div");
		element.classList.add("state");
		super(element, x, y);

		this.#span = document.createElement("span");
		element.appendChild(this.#span);

		// Add start transition.
		const { angle = Math.PI, length = 75 } = start ?? {};
		this.#arrow = new StraightArrow(x, y, { length, offset: radius });
		this.#arrow.element.style.rotate = `${angle}rad`;
		this.#anchor = new Anchor(
			(length + radius) * Math.cos(angle) + x,
			(length + radius) * Math.sin(angle) + y,
			{
				movementFilter: ([ x, y ]) => {
					const [ px, py ] = this.position;

					// Snap to axis.
					const threshold = 10;
					if (Math.abs(x - px) < threshold) x = px;
					if (Math.abs(y - py) < threshold) y = py;

					// Force minimum length.
					const length = Math.sqrt((x - px) ** 2 + (y - py) ** 2) - radius;
					const minimumLength = 2 * this.#arrow.headLength / Math.SQRT2;
					if (length < minimumLength) {
						const angle = Math.atan2(y - py, x - px);
						x = (minimumLength + radius) * Math.cos(angle) + px;
						y = (minimumLength + radius) * Math.sin(angle) + py;
					}

					return [ x, y ];
				}
			}
		);

		this.label = label;
		this.start = start !== null ? { angle, length } : null;
		this.accept = accept;

		let blockAnchorListener = false;
		this.addMoveListener(([ x, y ], [ px, py ]) => {
			const [ ax, ay ] = this.#anchor.position;
			const [ dx, dy ] = [ x - px, y - py ];

			this.#arrow.position = [ x, y ];

			blockAnchorListener = true;
			this.#anchor.position = [ ax + dx, ay + dy ];
			blockAnchorListener = false;
		});
		this.#anchor.addMoveListener(([ x, y ]) => {
			if (blockAnchorListener) return;

			const [ sx, sy ] = this.position;
			const [ dx, dy ] = [ x - sx, y - sy ];
			const angle = -Math.atan2(dx, dy) + Math.PI / 2;
			const length = Math.sqrt(dx ** 2 + dy ** 2) - radius;

			blockAnchorListener = true;
			this.start = { angle, length };
			blockAnchorListener = false;
		});

		// Resize label when text or font changes.
		new ResizeObserver(this.#rescaleLabel.bind(this)).observe(this.#span);
	}

	get label() { return this.#span.innerText; }
	set label(value) { this.#span.innerText = value; }

	get start() {
		if (this.#arrow.element.style.visibility !== "hidden") {
			return {
				angle: Number(this.#arrow.element.style.rotate.slice(0, -3)),
				length: this.#arrow.length
			};
		}
		return null;
	}
	set start(value) {
		if (!value) {
			this.#arrow.element.style.visibility = "hidden";
			this.#anchor.element.style.display = "none";
			return;
		}

		if (value.angle !== undefined) this.#arrow.element.style.rotate = `${value.angle}rad`;
		if (value.length !== undefined) this.#arrow.length = value.length;
		this.#arrow.element.style.visibility = "";
		this.#anchor.element.style.display = "";

		const { angle = this.start.angle, length = this.start.length } = value;
		this.#anchor.position = [
			(length + radius) * Math.cos(angle) + this.x,
			(length + radius) * Math.sin(angle) + this.y
		];
	}

	get accept() { return this.element.classList.contains("accept"); }
	set accept(value) {
		if (value) this.element.classList.add("accept");
		else this.element.classList.remove("accept");

		this.#rescaleLabel();
	}

	render() {
		super.render();
		this.#arrow.render();
		this.#anchor.render();
	}

	remove() {
		super.remove();
		this.#arrow.remove();
		this.#anchor.remove();
	}

	#rescaleLabel() {
		const width = this.#span.clientWidth;
		const maxWidth = this.accept ? 60 : 80;
		this.#span.style.scale = Math.min(1, maxWidth / width);
	}

}
