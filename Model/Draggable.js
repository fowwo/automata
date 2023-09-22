export default class Draggable {

	#x;
	#y;

	constructor(element, x = 0, y = 0) {
		this.element = element;
		this.element.classList.add("draggable");
		this.position = [ x, y ];

		this.element.onmousedown = (event) => {
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

	get x() { return this.#x; }
	set x(x) {
		this.#x = x;
		this.element.style.setProperty("--x", `${x}px`);
	}

	get y() { return this.#y; }
	set y(y) {
		this.#y = y;
		this.element.style.setProperty("--y", `${y}px`);
	}

	get position() { return [ this.x, this.y ]; }
	set position([ x, y ]) {
		[ this.x, this.y ] = [ x, y ];
	}

}
