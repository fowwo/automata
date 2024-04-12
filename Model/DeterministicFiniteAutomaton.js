import RegularAutomaton from "./RegularAutomaton.js";

/**
 * A deterministic finite automaton.
 * 
 * This implementation does **NOT** require the automaton to be complete;
 * the transition function may be partial. To check if the automaton is
 * complete, use {@link DeterministicFiniteAutomaton.isComplete}.
 */
export default class DeterministicFiniteAutomaton extends RegularAutomaton {

	/**
	 * @param {Object} automaton - An object containing the properties of the automaton.
	 * @param {Iterable<String>} automaton.alphabet - The symbols of the language.
	 * @param {Iterable<Number> | Number} automaton.states - The states or number of states.
	 * @param {Number} automaton.startState - The start state.
	 * @param {Iterable<Number>} automaton.finalStates - The final states.
	 * @param {{[state: Number]: {[symbol: String]: Number}}} automaton.transitions - An object mapping each state and each symbol to a state.
	 */
	constructor({ alphabet, states, startState, finalStates, transitions } = {}) {
		super({ alphabet, states, startState, finalStates, transitions });
	}

	/**
	 * @param {String} string - The input string.
	 * @returns {Number | null} The resulting state.
	 */
	run(string) {
		if (this.startState === null) return null;

		let state = this.startState;
		for (const symbol of string) {
			if (state === null) return null;
			state = this.step(state, symbol);
		}
		return state;
	}

	/**
	 * @param {Number} state - The state to transition from.
	 * @param {String} symbol - The symbol to read.
	 * @returns {Number | null} The resulting state.
	 */
	step(state, symbol) {
		return this.transitions[state]?.[symbol] ?? null;
	}

	/**
	 * @param {String} string - The input string.
	 * @returns {Boolean}
	 */
	accepts(string) {
		const state = this.run(string);
		return this.finalStates.has(state);
	}

	/**
	 * @param {Number} state - The state to remove.
	 */
	removeState(state) {
		this.states.delete(state);
		if (this.startState === state) this.startState = null;
		this.finalStates.delete(state);
		delete this.transitions[state];
		for (const [ from, transitions ] of Object.entries(this.transitions)) {
			for (const [ symbol, to ] of Object.entries(transitions)) {
				if (to === state) {
					delete transitions[symbol];
				}
			}
			if (Object.keys(transitions).length === 0) {
				delete this.transitions[from];
			}
		}
	}
}
