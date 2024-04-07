import Automaton from "./Automaton.js";

/** A finite automaton that recognizes a regular language. */
export default class RegularAutomaton extends Automaton {

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
	 * @returns {Boolean}
	 */
	rejects(string) {
		return !this.accepts(string);
	}

}
