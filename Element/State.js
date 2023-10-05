import Draggable from "../Element/Draggable.js";

export default class State extends Draggable {

	#final;

	constructor(x, y, { final = false } = {}) {
		const element = document.createElement("div");
		element.classList.add("state");
		super(element, x, y);

		this.final = final;
	}

	get final() { return this.#final; }
	set final(value) {
		this.#final = value;
		if (value) {
			this.element.classList.add("final");
		} else {
			this.element.classList.remove("final");
		}
	}

}
