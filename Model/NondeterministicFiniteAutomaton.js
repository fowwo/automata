import RegularAutomaton from "./RegularAutomaton.js";

/** A nondeterministic finite automaton. */
export default class NondeterministicFiniteAutomaton extends RegularAutomaton {

	/**
	 * @param {Object} automaton - An object containing the properties of the automaton.
	 * @param {Iterable<String>} automaton.alphabet - The symbols of the language.
	 * @param {Iterable<Number> | Number} automaton.states - The states or number of states.
	 * @param {Number} automaton.startState - The start state.
	 * @param {Iterable<Number>} automaton.finalStates - The final states.
	 * @param {{[state: Number]: {[symbol: String]: Number[]}}} automaton.transitions - An object mapping each state and each symbol to a state.
	 */
	constructor({ alphabet, states, startState, finalStates, transitions } = {}) {
		super({ alphabet, states, startState, finalStates, transitions });
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
	 * @param {String} string - A string over the alphabet.
	 * @returns {Boolean}
	 */
	accepts(string) {
		const [ A, B ] = [ this.run(string), this.finalStates ].sort((a, b) => a.size - b.size);
		for (const state of A) {
			if (B.has(state)) {
				return true;
			}
		}
		return false;
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

	/**
	 * @param {Number} state - The state to remove.
	 */
	removeState(state) {
		this.states.delete(state);
		delete this.transitions[state];
		for (const transitions of Object.values(this.transitions)) {
			for (const [ symbol, to ] of Object.entries(transitions)) {
				transitions[symbol] = to.filter(x => x !== state);
				if (transitions[symbol].length === 0) {
					delete transitions[symbol];
				}
			}
		}
	}
}
