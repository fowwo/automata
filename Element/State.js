import Draggable from "../Element/Draggable.js";

export default class State extends Draggable {

	constructor(x, y) {
		const element = document.createElement("div");
		element.classList.add("state");
		super(element, x, y);
	}

}
