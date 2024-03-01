import DFA from "./DFA.js";
import State from "../Element/State.js";
import Transition from "../Element/Transition.js";

/** A diagram. */
export default class Diagram {

	/**
	 * @param {Object} x
	 * @param {String} x.name - The name of the diagram.
	 * @param {String} x.type - The type of the machine.
	 * @param {Object} x.machine - The machine.
	 * @param {Object} x.elements - The properties of the elements in the diagram.
	 */
	constructor({ name, type, machine, elements }) {
		this.type = type;
		this.name = name;
		this.machine = new {
			"DFA": DFA
		}[type](machine);
		this.elements = elements;
	}

	/** Renders the diagram. */
	load() {
		document.getElementById("diagram").innerHTML = "";
		const statesList = document.querySelector("#states tbody");
		statesList.innerHTML = "";

		// Render states and display state info.
		let startState = null;
		const states = this.elements.states.map(({ x, y, ...options }, i) => {
			if (i === this.machine.startState) options.start = this.elements.startState;
			if (this.machine.finalStates.has(i)) options.final = true;
			
			const state = new State(x, y, options);
			const tr = document.createElement("tr");

			// Start state toggle
			const radio = document.createElement("div");
			radio.classList.add("radio", "symbol");
			const start = document.createElement("input");
			start.type = "radio";
			start.name = "start";
			if (state.start) {
				startState = state;
				start.checked = true;
			}
			start.addEventListener("change", () => {
				if (startState) {
					state.start = startState.start;
					startState.start = null;
				}
				startState = state;
			});
			radio.appendChild(start);

			// Final state toggle
			const checkbox = document.createElement("div");
			checkbox.classList.add("checkbox", "symbol");
			const final = document.createElement("input");
			final.type = "checkbox";
			final.checked = state.final;
			final.addEventListener("change", (event) => {
				state.final = event.target.checked;
			});
			checkbox.appendChild(final);

			// Label
			const label = document.createElement("input");
			label.type = "text";
			label.value = state.label;
			label.addEventListener("change", (event) => {
				state.label = event.target.value;
			});
			
			// Append elements to table row.
			for (const element of [ radio, checkbox, label ]) {
				const td = document.createElement("td");
				td.appendChild(element);
				tr.appendChild(td);
			}
			statesList.appendChild(tr);
			return state;
		});

		// Render transitions.
		Object.entries(this.machine.transitions).forEach(([ from, transitions ]) => {

			// Merge transitions of the same states and symbols.
			const symbols = {};
			Object.entries(transitions).forEach(([ symbol, to ]) => {
				if (to in symbols) symbols[to].push(symbol);
				else symbols[to] = [ symbol ];
			});
			Object.entries(symbols).forEach(([ to, symbols ]) => {
				const angle = this.elements.transitions[from]?.[to];
				new Transition(states[from], states[to], symbols.join(","), angle);
			});
		});

		// Enable renaming input field.
		const rename = document.querySelector("#diagram-info > header > input");
		rename.disabled = false;
		rename.onchange = (event) => {
			this.name = event.target.value;
		};
	}

}
