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
			state = this.transitions[state][symbol];
		}
		return this.finalStates.has(state);
	}

	removeState(state) {
		this.stateCount--;
		if (this.startState === state) this.startState = null;
		this.finalStates.delete(state);
		delete this.transitions[state];
		for (const [ from, transitions ] of Object.entries(this.transitions)) {
			for (const [ symbol, to ] of Object.entries(transitions)) {
				if (to === state) {
					delete transitions[symbol];
				} else if (to > state) {
					transitions[symbol]--;
				}
			}
			if (Object.keys(transitions).length === 0) delete this.transitions[from];
		}
	}

	// /** Determines whether the DFA has a valid construction. */
	// isValid() {

	// 	// The DFA must have a start state.
	// 	if (!this.states.has(this.startState)) return false;

	// 	// Each state must have a transition for each symbol in the alphabet.
	// 	// for (const state of this.states) {
			
	// 	// }
	// }

	// minimize() {
	// 	const states = [ this.finalStates. ];
	// }
}
