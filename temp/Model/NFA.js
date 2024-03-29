import RegularAutomaton from "./RegularAutomaton.js";

/** A nondeterministic finite automaton. */
export default class NFA extends RegularAutomaton {

	/**
	 * @param {Object} x
	 * @param {Iterable<String>} x.alphabet - The symbols of the language.
	 * @param {Number} x.stateCount - The number of states.
	 * @param {Number} x.startState - The index of the start state.
	 * @param {Iterable<Number>} x.finalStates - The indices of the final states.
	 * @param {{[state: Number]: {[symbol: String]: Number}}} x.transitions - An object mapping each state and each symbol to a state.
	 */
	constructor({ alphabet = [], stateCount = 0, startState = null, finalStates = [], transitions = [] } = {}) {
		super({ alphabet, stateCount, startState, finalStates, transitions });
	}

	/**
	 * Determines whether a string is in the language.
	 * @param {String} string - A string over the alphabet.
	 * @returns {Boolean}
	 */
	run(string) {
		if (this.startState === null) return false;

		return this.DFA().run(string);
	}

	/** Returns an equivalent deterministic finite automaton. */
	DFA() {
		const m = [ this.startState ];
		const startSet = new Set();
		while (m) {
			const x = m.pop();

		}
	}

}
