import RegularAutomaton from "./RegularAutomaton";
import DeterministicFiniteAutomatonData from "../Type/DeterministicFiniteAutomatonData";

/**
 * A deterministic finite automaton.
 * 
 * This implementation does **NOT** require the automaton to be complete;
 * the transition function may be partial. To check if the automaton is
 * complete, use `DeterministicFiniteAutomaton.isComplete()`.
 */
export default class DeterministicFiniteAutomaton extends RegularAutomaton {

	/** An object mapping each state and symbol to a state. */
	declare transitions: { [state: number]: { [symbol: string]: number; }; };

	constructor({ alphabet, states, startState, acceptStates, transitions }: DeterministicFiniteAutomatonData = {}) {
		super({ alphabet, states, startState, acceptStates, transitions });
	}

	/** @returns The resulting state. */
	run(string: string): number | null {
		let state = this.startState;
		for (const symbol of string) {
			if (state === null) return null;
			state = this.step(state, symbol);
		}
		return state;
	}

	/** @returns The resulting state. */
	step(state: number, symbol: string): number | null {
		return this.transitions[state]?.[symbol] ?? null;
	}

	accepts(string: string): boolean {
		const state = this.run(string);
		if (state === null) return false;
		return this.acceptStates.has(state);
	}

	removeState(state: number): void {
		this.states.delete(state);
		if (this.startState === state) this.startState = null;
		this.acceptStates.delete(state);
		delete this.transitions[state];

		for (const [ from, transitions ] of Object.entries(this.transitions)) {
			for (const [ symbol, to ] of Object.entries(transitions)) {
				if (to === state) {
					delete transitions[symbol];
				}
			}
			if (Object.keys(transitions).length === 0) {
				delete this.transitions[from as unknown as number];
			}
		}
	}

	/**
	 * Determines whether the automaton is complete.
	 * 
	 * An automaton is complete if each state has a transition for each input symbol.
	 */
	isComplete(): boolean {
		for (const state of this.states) {
			for (const symbol of this.alphabet) {
				if (this.transitions[state]?.[symbol] === undefined) {
					return false;
				}
			}
		}
		return true;
	}
}
