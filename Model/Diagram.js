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

		// Render states.
		const states = this.elements.states.map(({ x, y, ...options }, i) => {
			if (i === this.machine.startState) options.start = this.elements.startState;
			if (this.machine.finalStates.has(i)) options.final = true;
			
			return new State(x, y, options);
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
	}

}
