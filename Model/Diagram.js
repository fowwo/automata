import DFA from "./DeterministicFiniteAutomaton.js";
import State from "../Element/State.js";
import Transition from "../Element/Transition.js";

const diagram = document.getElementById("diagram");
const statesList = document.querySelector("#states tbody");
const transitionsList = document.querySelector("#transitions table");
const transitionHeadRow = transitionsList.firstElementChild.firstElementChild;
const transitionBody = transitionsList.lastElementChild;

/** A diagram. */
export default class Diagram {

	/**
	 * @param {Object} x
	 * @param {String} x.name - The name of the diagram.
	 * @param {String} x.type - The type of the automaton.
	 * @param {Object} x.automaton - The automaton.
	 * @param {Object} x.elements - The properties of the elements in the diagram.
	 */
	constructor({ name = "", type, automaton, elements: { states = {}, transitions = {}, startState = {} } = {} }) {
		this.type = type;
		this.name = name;
		this.automaton = new {
			"DFA": DFA
		}[type](automaton);

		this.states = Object.fromEntries(automaton.states.values().map(i => {
			const { x, y, ...options } = states[i];
			if (this.automaton.finalStates.has(i)) options.final = true;
			return [ i, new State(x, y, options) ];
		}));
		if (automaton.states.has(automaton.startState)) this.states[automaton.startState].start = startState;

		this.transitions = Object.fromEntries(Object.entries(automaton.transitions).map(([ from, automatonTransitions ]) => {
			// Merge transitions of the same states and symbols.
			const merge = {};
			Object.entries(automatonTransitions).forEach(([ symbol, to ]) => {
				if (to in merge) merge[to].add(symbol);
				else merge[to] = new Set([ symbol ]);
			});

			for (const [ to, symbols ] of Object.entries(merge)) {
				const angle = transitions[from]?.[to];
				const transition = new Transition(this.states[from], this.states[to], Array.from(symbols).sort().join(","), angle);
				merge[to] = { symbols, transition };
			}
			return [ from, merge ];
		}));
	}

	/** Renders the diagram and displays its info. */
	load() {
		// Clear diagram and info.
		diagram.innerHTML = "";
		statesList.innerHTML = "";
		transitionHeadRow.innerHTML = "";
		transitionBody.innerHTML = "";

		// Render elements.
		for (const state of Object.values(this.states)) state.render();
		for (const stateTransitions of Object.values(this.transitions)) {
			for (const transitionEntry of Object.values(stateTransitions)) {
				transitionEntry.transition.render();
			}
		}

		// Create transition table head.
		transitionHeadRow.appendChild(document.createElement("th"));
		for (const symbol of this.automaton.alphabet) {
			const th = document.createElement("th");
			th.innerText = symbol;
			transitionHeadRow.appendChild(th);
		}

		// Display state and transition info.
		for (const state of Object.keys(this.states)) {
			this.#createStateEntry(state);
			this.#createTransitionEntry(state);
		}

		// Enable renaming input field.
		const rename = document.querySelector("#diagram-info > header > input");
		rename.disabled = false;
		rename.onchange = (event) => {
			this.name = event.target.value;
		};

		// Enable add state button.
		document.getElementById("new-state").onclick = this.createState.bind(this);
	}

	/** Creates a new state and adds it to the diagram. */
	createState() {
		// Find unused state label.
		let label = Object.keys(this.states).length;
		const labels = new Set(Object.values(this.states).map(x => x.label));
		while (labels.has(String(label))) label++;

		// Create new state.
		const px = parseFloat(diagram.style.getPropertyValue("--px"));
		const py = parseFloat(diagram.style.getPropertyValue("--py"));
		const state = new State(-px, -py, { label });
		const id = this.automaton.addState();
		this.states[id] = state;

		// Render state and show info.
		this.#createStateEntry(id).querySelector("input[type=text]").focus();
		this.#createTransitionEntry(id);
		state.render();
	}

	/**
	 * Changes the label of the given state.
	 * @param {Number} id - The state to rename.
	 * @param {String} name - The new state name.
	 */
	renameState(id, name) {
		const state = this.states[id];
		state.label = name;

		const th = transitionBody.querySelector(`tr[data-state='${id}'] > th`);
		th.innerText = name;

		for (const input of transitionBody.querySelectorAll(`input[data-state='${id}']`)) {
			input.value = name;
		}
	}

	/**
	 * Creates a state table entry for the given state.
	 * @param {Number} id - The state id.
	 */
	#createStateEntry(id) {
		const state = this.states[id];
		const tr = document.createElement("tr");
		tr.setAttribute("data-state", id);

		// Start state toggle
		const radio = document.createElement("div");
		radio.classList.add("radio", "symbol");
		const start = document.createElement("input");
		start.type = "radio";
		start.name = "start";
		start.checked = Boolean(state.start);
		start.addEventListener("change", () => {
			if (this.states[this.automaton.startState]) {
				state.start = this.states[this.automaton.startState].start;
				this.states[this.automaton.startState].start = null;
			}
			this.automaton.startState = Object.entries(this.states).find(x => x[1] === state)[0];
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
			if (label.value === "" || Object.values(this.states).find(x => x.label === label.value)) {
				label.value = label.getAttribute("data-value");
				return;
			}

			this.renameState(id, label.value);
			label.setAttribute("data-value", state.label);
		});

		// Append elements to table row.
		for (const element of [ radio, checkbox, label ]) {
			const td = document.createElement("td");
			td.appendChild(element);
			tr.appendChild(td);
		}

		statesList.appendChild(tr);
		return tr;
	}

	/**
	 * Creates a transition table entry for the given state.
	 * @param {Number} id - The state id.
	 */
	#createTransitionEntry(id) {
		const state = this.states[id];
		const tr = document.createElement("tr");
		const th = document.createElement("th");
		tr.setAttribute("data-state", id);
		th.innerText = state.label;
		tr.appendChild(th);

		const from = Object.entries(this.states).find(x => x[1] === state)[0];
		for (const symbol of this.automaton.alphabet) {
			const input = document.createElement("input");
			input.type = "text";
			input.onchange = () => input.blur();
			input.addEventListener("change", () => {
				input.value = input.value.trim();

				// Delete transition?
				if (input.value === "") {
					const prev = Object.keys(this.states).find(x => this.states[x].label === input.getAttribute("data-state"));
					if (prev === undefined) return;

					this.transitions[from][prev].symbols.delete(symbol);
					if (this.transitions[from][prev].symbols.size) {
						this.transitions[from][prev].transition.label = Array.from(this.transitions[from][prev].symbols).sort().join(",");
					} else {
						this.transitions[from][prev].transition.remove();
						delete this.transitions[from][prev];
					}
					delete this.automaton.transitions[from][symbol];
					input.removeAttribute("data-state");
					return;
				}

				// Check if state exists and is different.
				const to = Object.keys(this.states).find(x => this.states[x].label === input.value);
				if (to === undefined || to == input.getAttribute("data-state")) {
					const state = this.states[to ?? input.getAttribute("data-state")];
					input.value = state ? state.label : "";
					return;
				}

				// Remove symbol from current transitions.
				const prev = Object.keys(this.states).find(x => this.states[x].label === input.getAttribute("data-state"));
				if (prev !== undefined) {
					this.transitions[from][prev].symbols.delete(symbol);
					if (this.transitions[from][prev].symbols.size) {
						this.transitions[from][prev].transition.label = Array.from(this.transitions[from][prev].symbols).sort().join(",");
					} else {
						this.transitions[from][prev].transition.remove();
						delete this.transitions[from][prev];
					}
				}

				// Add symbol to new transition.
				if (!(from in this.transitions)) this.transitions[from] = {};
				if (this.transitions[from][to]) {
					this.transitions[from][to].symbols.add(symbol);
					this.transitions[from][to].transition.label = Array.from(this.transitions[from][to].symbols).sort().join(",");
				} else {
					const symbols = new Set([ symbol ]);
					const transition = new Transition(this.states[from], this.states[to], symbol);
					transition.render();
					this.transitions[from][to] = { symbols, transition };
				}

				if (!(from in this.automaton.transitions)) this.automaton.transitions[from] = {};
				this.automaton.transitions[from][symbol] = to;
				input.setAttribute("data-state", to);
			});
			if (symbol in (this.automaton.transitions[from] ?? {})) {
				input.value = this.states[this.automaton.transitions[from][symbol]].label;
				input.setAttribute("data-state", to);
			}
			tr.appendChild(document.createElement("td")).appendChild(input);
		}

		transitionBody.appendChild(tr);
		return tr;
	}

}
