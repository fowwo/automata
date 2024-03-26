import Automaton from "./Automaton.js";

/** A nondeterministic finite automaton. */
export default class NFA extends Automaton {

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

	/**
	 * Determines whether a string is in the language.
	 * @param {String} string - A string over the alphabet.
	 * @returns {Boolean}
	 */
	accepts(string) {
		if (this.startState === null) return false;

		/**
		 * Finds all reachable states from the given states
		 * by taking any number of epsilon transitions.
		 */
		const getReachableStates = (/** @type {Set<number>} */ states) => {
			let current = new Set(states);
			while (current.size) {
				const next = new Set();
				for (const state of current) {
					for (const nextState of this.transitions[state]?.["ε"] ?? []) {
						if (!states.has(nextState)) {
							states.add(nextState);
							next.add(nextState);
						}
					}
				}
				current = next;
			}
			return states;
		};

		// Run the machine on the string.
		let states = getReachableStates(new Set([ this.startState ]));
		for (const symbol of string) {
			const next = new Set();
			for (const state of states) {
				for (const nextState of this.transitions[state]?.[symbol] ?? []) {
					next.add(nextState);
				}
			}
			states = getReachableStates(next);
		}

		// Check if any path ends at a final state.
		const [ A, B ] = [ states, this.finalStates ].sort((a, b) => a.size - b.size);
		for (const state of A) {
			if (B.has(state)) {
				return true;
			}
		}
		return false;
	}

}
