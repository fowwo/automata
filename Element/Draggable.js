import Element from "./Element.js";

export default class Draggable extends Element {

	constructor(element, x, y) {
		super(element, x, y);
		element.classList.add("draggable");

		element.onmousedown = (event) => {
			event.stopPropagation();

			const scale = parseFloat(workspace.style.getPropertyValue("--scale"));
			const [ cx, cy ] = [ event.clientX, event.clientY ];
			const [ px, py ] = this.position;

			const mouseup = () => {
				document.removeEventListener("mouseup", mouseup);
				document.removeEventListener("mousemove", mousemove);
			};
			const mousemove = (event) => {
				const [ dx, dy ] = [ event.clientX - cx, event.clientY - cy ].map(x => x / scale);
				this.position = [ px + dx, py + dy ];
			};

			document.addEventListener("mouseup", mouseup);
			document.addEventListener("mousemove", mousemove);
		};
	}

}
