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
	}

	get label() { return this.span.innerText; }
	set label(value) {
		this.#span.innerText = value;
		this.#rescaleLabel();
	}

	get final() { return this.#final; }
	set final(value) {
		this.#final = value;
		if (value) {
			this.element.classList.add("final");
		} else {
			this.element.classList.remove("final");
		}
		this.#rescaleLabel();
	}

	#rescaleLabel() {
		const maxWidth = this.final ? 60 : 80;
		const scale = this.#span.style.scale || 1;
		const { width } = this.#span.getBoundingClientRect();
		this.#span.style.scale = Math.min(1, scale * maxWidth / width);
	}

}
