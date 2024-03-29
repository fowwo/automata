import { checkbox, createElement, radio, textInput } from "../Script/elements.js";
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

		// const alphabetList = document.getElementById("alphabet");
		const statesList = document.querySelector("#states tbody");
		const transitionsList = document.getElementById("transitions");
		// alphabetList.innerHTML = "";
		statesList.innerHTML = "";
		transitionsList.innerHTML = "";

		// Display alphabet symbols in the panel.
		// for (const symbol of this.machine.alphabet) {
		// 	const li = document.createElement("li");
		// 	li.innerText = symbol;
		// 	alphabetList.appendChild(li);
		// }

		// Render states and display state info.
		this.states.forEach((state, i) => {
			statesList.appendChild(this.#createStateEntry(state, i));
		});

		// Render transitions.
		const headRow = createElement("tr", {
			children: [ createElement("th") ]
		});
		const tbody = createElement("tbody");
		transitionsList.replaceWith(
			createElement("table", {
				properties: {
					id: "transitions"
				},
				children: [
					createElement("thead", {
						children: [ headRow ]
					}),
					tbody
				]
			})
		);
		for (const symbol of this.machine.alphabet) {
			headRow.appendChild(createElement("th", {
				properties: {
					innerText: symbol
				}
			}));
		}
		Object.entries(this.machine.transitions).forEach(([ from, transitions ]) => {

			const row = createElement("tr", {
				children: [
					createElement("th", {
						properties: {
							innerText: this.states[from].label
						}
					})
				]
			});
			tbody.appendChild(row);

			// Merge transitions of the same states and symbols.
			const symbols = {};
			for (const symbol of this.machine.alphabet) {
				const input = textInput();
				input.addEventListener("change", (event) => {
					const i = this.states.findIndex((state) => {
						return state.label === event.target.value;
					});
					if (i === -1) {
						input.value = input.getAttribute("data-previous-value");
						input.blur();
						return;
					}
					this.machine.transitions[from][symbol] = i;
					input.setAttribute("data-previous-value", input.value);
					input.blur();
				});
				if (symbol in this.machine.transitions[from]) {
					const i = this.machine.transitions[from][symbol];
					input.value = this.states[i].label;
					input.setAttribute("data-previous-value", input.value);
				}
				row.appendChild(td(input));
			}
		});

		// Enable renaming input field.
		const rename = document.querySelector("#diagram-info > header > input");
		rename.disabled = false;
		rename.onchange = (event) => {
			this.name = event.target.value;
		};

		// Add state button
		const addState = document.querySelector("#diagram-info > #add-state");
		addState.onclick = (event) => {
			const px = parseFloat(diagram.style.getPropertyValue("--px"));
			const py = parseFloat(diagram.style.getPropertyValue("--py"));
			const state = new State(-px, -py);

			const entry = createStateEntry(state);
			console.log(entry);
			entry.querySelector("input[type=text]").focus();
		}
		
	}

	/**
	 * Creates a table row for the state.
	 * @param {State} state - The state.
	 */
	#createStateEntry(state) {
		return createElement("tr", { children: [
			// Start state toggle
			td(radio({
				onchange: () => {
					if (this.states[this.machine.startState]) {
						state.start = this.states[this.machine.startState].start;
						this.states[this.machine.startState].start = null;
					}
					this.machine.startState = this.states.findIndex(x => x === state);
				},
				inputOptions: {
					properties: { checked: Boolean(state.start) }
				}
			})),
			// Final state toggle
			td(checkbox({
				onchange: (event) => {
					state.final = event.target.checked;
				},
				inputOptions: {
					properties: { checked: state.final }
				}
			})),
			// Label
			td(textInput({
				value: state.label,
				onchange: (event) => {
					state.label = event.target.value;
				}
			}))
		]});
	}

	addState(state) {
		
	}

	setStartState(state) {
		if (typeof state === "number") {
			console.log("number");
		}
		// if ()
	}

}

/**
 * Wraps an element in a `td` element.
 * @param {HTMLElement} element - The inner element.
 */
function td(element) {
	return createElement("td", { children: [ element ]});
}
