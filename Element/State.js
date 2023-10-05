import Draggable from "../Element/Draggable.js";

export default class State extends Draggable {

	#span;
	#final;

	constructor(x, y, { label = "", final = false } = {}) {
		const element = document.createElement("div");
		element.classList.add("state");
		super(element, x, y);

		this.#span = document.createElement("span");
		element.appendChild(this.#span);

		this.final = final;
		this.label = label;

		// Resize label when text or font changes.
		new ResizeObserver(([ entry ]) => {
			const { width } = entry.contentRect;
			this.#rescaleLabel(width);
		}).observe(this.#span);
	}

	get label() { return this.span.innerText; }
	set label(value) { this.#span.innerText = value; }

	get final() { return this.#final; }
	set final(value) {
		this.#final = value;
		if (value) {
			this.element.classList.add("final");
		} else {
			this.element.classList.remove("final");
		}

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
