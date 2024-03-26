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

}
