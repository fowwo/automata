import Automaton, { AutomatonArguments } from "./Automaton.js";

/** A finite automaton that recognizes a regular language. */
export default abstract class RegularAutomaton extends Automaton {

	/** An object mapping each state and symbol to states. */
	declare transitions: { [state: number]: { [symbol: string]: unknown; }; };

	constructor({ alphabet, states, startState, finalStates, transitions }: RegularAutomatonArguments = {}) {
		super({ alphabet, states, startState, finalStates, transitions });
	}

	rejects(string: string): boolean {
		return !this.accepts(string);
	}

}

export interface RegularAutomatonArguments extends AutomatonArguments {
	
	/** An object mapping each state and symbol to states. */
	transitions?: { [state: number]: { [symbol: string]: unknown } };

}
