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

		this.states = elements.states.map(({ x, y, ...options }, i) => {
			if (this.machine.finalStates.has(i)) options.final = true;
			return new State(x, y, options);
		});
		if (this.states[machine.startState]) this.states[machine.startState].start = elements.startState;

		this.transitions = Object.entries(this.machine.transitions).reduce((list, [ from, transitions ]) => {

			// Merge transitions of the same states and symbols.
			const symbols = {};
			Object.entries(transitions).forEach(([ symbol, to ]) => {
				if (to in symbols) symbols[to].push(symbol);
				else symbols[to] = [ symbol ];
			});

			return list.concat(Object.entries(symbols).map(([ to, symbols ]) => {
				const angle = elements.transitions[from]?.[to];
				return new Transition(this.states[from], this.states[to], symbols.join(","), angle);
			}));
		}, []);
	}

	/** Renders the diagram. */
	load() {
		document.getElementById("diagram").innerHTML = "";
		for (const state of this.states) state.render();
		for (const transition of this.transitions) transition.render();

		const statesList = document.querySelector("#states tbody");
		statesList.innerHTML = "";

		// Render states and display state info.
		for (const state of this.states) {
			statesList.appendChild(this.#createStateEntry(state));
		}

		// Enable renaming input field.
		const rename = document.querySelector("#diagram-info > header > input");
		rename.disabled = false;
		rename.onchange = (event) => {
			this.name = event.target.value;
		};
	}

	/**
	 * Creates a table row entry for the given state.
	 * @param {State} state - The state.
	 */
	#createStateEntry(state) {
		const tr = document.createElement("tr");

		// Start state toggle
		const radio = document.createElement("div");
		radio.classList.add("radio", "symbol");
		const start = document.createElement("input");
		start.type = "radio";
		start.name = "start";
		start.checked = Boolean(state.start);
		start.addEventListener("change", () => {
			if (this.states[this.machine.startState]) {
				state.start = this.states[this.machine.startState].start;
				this.states[this.machine.startState].start = null;
			}
			this.machine.startState = this.states.findIndex(x => x === state);
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
		return tr;
	}

}
