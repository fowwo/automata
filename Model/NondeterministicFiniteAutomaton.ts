import RegularAutomaton, { RegularAutomatonArguments } from "./RegularAutomaton.js";

/** A nondeterministic finite automaton. */
export default class NondeterministicFiniteAutomaton extends RegularAutomaton {

	/** An object mapping each state and symbol to one or more states. */
	declare transitions: { [state: number]: { [symbol: string]: number[]; }; };

	constructor({ alphabet, states, startState, finalStates, transitions }: NondeterministicFiniteAutomatonArguments = {}) {
		super({ alphabet, states, startState, finalStates, transitions });
	}

	/** @returns {Set<Number>} The set of reachable states after reading the string. */
	run(string: string): Set<number> {
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
	 * @returns {Set<Number>} The resulting set of states.
	 */
	step(states: Set<number>, symbol: string): Set<number> {
		const next = new Set<number>();
		for (const state of states) {
			for (const nextState of this.transitions[state]?.[symbol] ?? []) {
				next.add(nextState);
			}
		}
		return this.getReachableStates(next);
	}

	accepts(string: string): boolean {
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
	 * @returns The resulting set of states.
	 */
	getReachableStates(states: Iterable<number>): Set<number> {
		const reachableStates = new Set(states);
		let current = new Set(states);
		while (current.size) {
			const next = new Set<number>();
			for (const state of current) {
				for (const nextState of this.transitions[state]?.["ε"] ?? []) {
					if (!reachableStates.has(nextState)) {
						reachableStates.add(nextState);
						next.add(nextState);
					}
				}
			}
			current = next;
		}
		return reachableStates;
	}

	removeState(state: number) {
		this.states.delete(state);
		if (this.startState === state) this.startState = null;
		this.finalStates.delete(state);
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

export interface NondeterministicFiniteAutomatonArguments extends RegularAutomatonArguments {

	/** An object mapping each state and symbol to one or more states. */
	transitions?: { [state: number]: { [symbol: string]: number[] } };

}
