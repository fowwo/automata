import Automaton from "./Automaton.js";

/** A deterministic finite automaton. */
export default class DFA extends Automaton {

	/**
	 * @param {Object} x
	 * @param {Iterable<String>} x.alphabet - The symbols of the language.
	 * @param {Number} x.stateCount - The number of states.
	 * @param {Number} x.startState - The index of the start state.
	 * @param {Iterable<Number>} x.finalStates - The indices of the final states.
	 * @param {{[state: Number]: {[symbol: String]: Number}}} x.transitions - An object mapping each state and each symbol to a state.
	 */
	constructor({ alphabet, stateCount, startState, finalStates, transitions } = {}) {
		super({ alphabet, stateCount, startState, finalStates, transitions });
	}

	accepts(string) {
		if (this.startState === null) return false;

		let state = this.startState;
		for (const symbol of string) {
			if (state === undefined) return false;
			state = this.transitions[state][symbol][0];
		}
		return this.finalStates.has(state);
	}

	// 	const states = [ this.finalStates. ];
	// }
}
