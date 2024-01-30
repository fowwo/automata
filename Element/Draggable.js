import Element from "./Element.js";

/** A draggable element in a diagram. */
export default class Draggable extends Element {

	/**
	 * @param {HTMLElement} element - The element to add to the diagram.
	 * @param {Number} x - The initial x position.
	 * @param {Number} y - The initial y position.
	 * @param {Object} options - An object containing optional parameters.
	 * @param {([ x, y ]: [ Number, Number ]) => [ Number, Number ]} [options.movementFilter] - A function to intercept and control movement.
	 */
	constructor(element, x, y, { movementFilter = null } = {}) {
		super(element, x, y);
		element.classList.add("draggable");

		element.onmousedown = (event) => {
			event.stopPropagation();

			const scale = parseFloat(diagram.style.getPropertyValue("--scale"));
			const [ cx, cy ] = [ event.clientX, event.clientY ];
			const [ px, py ] = this.position;

			const mouseup = () => {
				document.removeEventListener("mouseup", mouseup);
				document.removeEventListener("mousemove", mousemove);
			};
			const mousemove = (event) => {
				const [ dx, dy ] = [ event.clientX - cx, event.clientY - cy ].map(x => x / scale);
				const position = [ px + dx, py + dy ];
				if (movementFilter) this.position = movementFilter(position);
				else this.position = position;
			};

			document.addEventListener("mouseup", mouseup);
			document.addEventListener("mousemove", mousemove);
		};
	}

}
