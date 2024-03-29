/** An abstract finite automaton. */
export default class Automaton {

	/**
	 * @param {Object} x
	 * @param {Iterable<String>} x.alphabet - The symbols of the language.
	 * @param {Number} x.stateCount - The number of states.
	 * @param {Number} x.startState - The index of the start state.
	 * @param {Iterable<Number>} x.finalStates - The indices of the final states.
	 * @param {{[state: Number]: {[symbol: String]: Number}}} x.transitions - An object mapping each state and each symbol to a state.
	 */
	constructor({ alphabet = [], stateCount = 0, startState = null, finalStates = [], transitions = {} } = {}) {
		this.alphabet = new Set(alphabet);
		this.stateCount = stateCount;
		this.startState = startState;
		this.finalStates = new Set(finalStates);
		this.transitions = transitions;
	}

	/**
	 * Determines whether a string is in the language.
	 * @param {String} string - A string over the alphabet.
	 * @returns {Boolean}
	 */
	accepts(string) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Determines whether a string is not in the language.
	 * @param {String} string - A string over the alphabet.
	 * @returns {Boolean}
	 */
	rejects(string) {
		return !this.accepts(string);
	}

	/**
	 * Adds a state.
	 * @returns {Number} The index of the new state.
	 */
	addState() {
		return this.stateCount++;
	}

	/**
	 * Removes a state
	 * @param {Number} state - The index of the state to remove.
	 */
	removeState(state) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Removes a transition.
	 * @param {Number} from - The state at the start of the transition.
	 * @param {String} symbol - The symbol of the transition.
	 * @param {Number} [to] - The state at the end of the transition.
	 */
	removeTransition(from, symbol, to) {

	}

	/** Creates a copy of the automaton. */
	clone() {
		const transitions = {};
		for (const state in this.transitions) {
			transitions[state] = { ...this.transitions[state] };
		}
		return new this.constructor({
			alphabet: this.alphabet,
			stateCount: this.stateCount,
			startState: this.startState,
			finalStates: this.finalStates,
			transitions
		});
	}

}
