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

		this.transitions = {};
		for (const [ from, transitions ] of Object.entries(this.machine.transitions)) {

			// Merge transitions of the same states and symbols.
			const merge = {};
			Object.entries(transitions).forEach(([ symbol, to ]) => {
				if (to in merge) merge[to].add(symbol);
				else merge[to] = new Set([ symbol ]);
			});

			for (const [ to, symbols ] of Object.entries(merge)) {
				const angle = elements.transitions[from]?.[to];
				const transition = new Transition(this.states[from], this.states[to], Array.from(symbols).sort().join(","), angle);
				merge[to] = { symbols, transition };
			}
			this.transitions[from] = merge;
		}
	}

	/** Renders the diagram. */
	load() {
		document.getElementById("diagram").innerHTML = "";
		for (const state of this.states) state.render();
		for (const stateTransitions of Object.values(this.transitions)) {
			for (const transitionEntry of Object.values(stateTransitions)) {
				transitionEntry.transition.render();
			}
		}

		const statesList = document.querySelector("#states tbody");
		const transitionsList = document.getElementById("transitions");
		const transitionHeadRow = transitionsList.firstElementChild.firstElementChild;
		const transitionBody = transitionsList.lastElementChild;

		// Clear tables.
		statesList.innerHTML = "";
		transitionHeadRow.innerHTML = "";
		transitionBody.innerHTML = "";

		// Create transition table head.
		transitionHeadRow.appendChild(document.createElement("th"));
		for (const symbol of this.machine.alphabet) {
			const th = document.createElement("th");
			th.innerText = symbol;
			transitionHeadRow.appendChild(th);
		}

		// Display state and transition info.
		for (const state of this.states) {
			statesList.appendChild(this.#createStateEntry(state));
			transitionBody.appendChild(this.#createTransitionEntry(state));
		}

		// Enable renaming input field.
		const rename = document.querySelector("#diagram-info > header > input");
		rename.disabled = false;
		rename.onchange = (event) => {
			this.name = event.target.value;
		};
	}

	/**
	 * Changes the label of the given state.
	 * @param {State} state - The state to rename.
	 * @param {String} name - The new state name.
	 */
	renameState(state, name) {
		// Rename state name in transition table.
		for (const th of document.querySelectorAll("#transitions > tbody > tr > th")) {
			if (th.innerText === state.label) {
				th.innerText = name;
				th.setAttribute("data-value", name);
			}
		}
		for (const input of document.querySelectorAll("#transitions > tbody > tr > td > input")) {
			if (input.value === state.label) {
				input.value = name;
				input.setAttribute("data-value", name);
			}
		}
		state.label = name;
	}

	/**
	 * Creates a state table entry for the given state.
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
		final.addEventListener("change", () => {
			state.final = final.checked;
		});
		checkbox.appendChild(final);

		// Label
		const label = document.createElement("input");
		label.type = "text";
		label.value = state.label;
		label.setAttribute("data-value", state.label);
		label.onchange = () => label.blur()
		label.addEventListener("change", () => {
			label.value = label.value.trim();
			if (label.value === start.label) return;

			// Prevent blank or duplicate state name.
			if (label.value === "" || this.states.findIndex(x => x.label === label.value) !== -1) {
				label.value = label.getAttribute("data-value");
				return;
			}

			this.renameState(state, label.value);
			label.setAttribute("data-value", state.label);
		});

		// Append elements to table row.
		for (const element of [ radio, checkbox, label ]) {
			const td = document.createElement("td");
			td.appendChild(element);
			tr.appendChild(td);
		}
		return tr;
	}

	/**
	 * Creates a transition table entry for the given state.
	 * @param {State} state - The state.
	 */
	#createTransitionEntry(state) {
		const tr = document.createElement("tr");
		const th = document.createElement("th");
		th.innerText = state.label;
		tr.appendChild(th);

		const from = this.states.findIndex(x => x === state);
		for (const symbol of this.machine.alphabet) {
			const input = document.createElement("input");
			input.type = "text";
			input.onchange = () => input.blur();
			input.addEventListener("change", () => {
				input.value = input.value.trim();
				if (input.value === input.getAttribute("data-value")) return;
				
				// Delete transition?
				if (input.value === "") {
					const prev = this.states.findIndex(x => x.label === input.getAttribute("data-value"));
					this.transitions[from][prev].symbols.delete(symbol);
					if (this.transitions[from][prev].symbols.size) {
						this.transitions[from][prev].transition.label = Array.from(this.transitions[from][prev].symbols).sort().join(",");
					} else {
						this.transitions[from][prev].transition.remove();
						delete this.transitions[from][prev];
					}
					delete this.machine.transitions[from][symbol];
					input.setAttribute("data-value", "");
					return;
				}

				// Check if state exists.
				const to = this.states.findIndex(x => x.label === input.value);
				if (to === -1) {
					input.value = input.getAttribute("data-value");
					return;
				}

				// Remove symbol from current transitions.
				const prev = this.states.findIndex(x => x.label === input.getAttribute("data-value"));
				if (prev !== -1) {
					this.transitions[from][prev].symbols.delete(symbol);
					if (this.transitions[from][prev].symbols.size) {
						this.transitions[from][prev].transition.label = Array.from(this.transitions[from][prev].symbols).sort().join(",");
					} else {
						this.transitions[from][prev].transition.remove();
						delete this.transitions[from][prev];
					}
				}

				// Add symbol to new transition.
				if (this.transitions[from][to]) {
					this.transitions[from][to].symbols.add(symbol);
					this.transitions[from][to].transition.label = Array.from(this.transitions[from][to].symbols).sort().join(",");
				} else {
					const symbols = new Set([ symbol ]);
					const transition = new Transition(this.states[from], this.states[to], symbol);
					transition.render();
					this.transitions[from][to] = { symbols, transition };
				}
				
				this.machine.transitions[from][symbol] = to;
				input.setAttribute("data-value", input.value);
			});
			if (symbol in this.machine.transitions[from]) {
				input.value = this.states[this.machine.transitions[from][symbol]].label;
				input.setAttribute("data-value", input.value);
			}
			tr.appendChild(document.createElement("td")).appendChild(input);
		}
		return tr;
	}

}
