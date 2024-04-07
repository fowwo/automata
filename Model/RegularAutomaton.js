import Automaton from "./Automaton.js";

/** A finite automaton that recognizes a regular language. */
export default class RegularAutomaton extends Automaton {

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
	 * @param {String} string - The input string.
	 * @returns {Set<Number>} The set of reachable states after reading the string.
	 */
	run(string) {
		if (this.startState === null) return new Set();

		let states = this.getReachableStates(new Set([ this.startState ]));
		for (const symbol of string) states = this.step(states, symbol);
		return states;
	}

	/**
	 * Reads a single input symbol from a given set of states.
	 * 
	 * It is assumed that all states which are reachable via epsilon transitions
	 * before reading the symbol are given.
	 * @param {Set<Number>} states - The states to transition from.
	 * @param {String} symbol - The symbol to read.
	 * @returns {Set<Number>} The resulting set of states.
	 */
	step(states, symbol) {
		const next = new Set();
		for (const state of states) {
			for (const nextState of this.transitions[state]?.[symbol] ?? []) {
				next.add(nextState);
			}
		}
		return this.getReachableStates(next);
	}

	/**
	 * @param {String} string - The input string.
	 * @returns {Number | null} The resulting state.
	 */
	runDeterministically(string) {
		if (this.startState === null) return null;

		let state = this.startState;
		for (const symbol of string) {
			if (state === null) return null;
			state = this.stepDeterministically(state, symbol);
		}
		return state;
	}

	/**
	 * @param {Number} state - The state to transition from.
	 * @param {String} symbol - The symbol to read.
	 * @returns {Number | null} The resulting state.
	 */
	stepDeterministically(state = null, symbol) {
		return this.transitions[state]?.[symbol] ?? null;
	}

	/**
	 * Finds all reachable states from the given states
	 * by taking any number of epsilon transitions.
	 * @param {Iterable<Number>} states - The initial set of states.
	 * @returns {Set<Number>} - The resulting set of states.
	 */
	getReachableStates(states) {
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
	}

}
