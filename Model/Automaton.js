/** An abstract finite automaton. */
export default class Automaton {

	/**
	 * @param {Object} automaton - An object containing the properties of the automaton.
	 * @param {Iterable<String>} automaton.alphabet - The symbols of the language.
	 * @param {Iterable<Number> | Number} automaton.states - The states or number of states.
	 * @param {Number} automaton.startState - The start state.
	 * @param {Iterable<Number>} automaton.finalStates - The final states.
	 * @param {{[state: Number]: {[symbol: String]: Number}}} automaton.transitions - An object mapping each state and each symbol to a state.
	 */
	constructor({ alphabet = [], states = [], startState = null, finalStates = [], transitions = {} } = {}) {
		this.alphabet = new Set(alphabet);
		if (typeof states === "number") {
			this.states = new Set();
			for (let i = 0; i < states; i++) {
				this.states.add(i);
			}
		} else {
			this.states = new Set(states);
		}
		this.startState = startState;
		this.finalStates = new Set(finalStates);
		this.transitions = transitions;
	}

	/** Runs the automaton on a given string. */
	run() { throw new Error("Method not implemented."); }

	/** Runs the automaton from a given context over one input symbol. */
	step() { throw new Error("Method not implemented."); }

	/** Determines whether a string is in the language. */
	accepts() { throw new Error("Method not implemented."); }

	/** Determines whether a string is not in the language. */
	rejects() { throw new Error("Method not implemented."); }

}
