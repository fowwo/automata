import Automaton from "./Automaton.js";

export default class TuringMachine extends Automaton {

	/**
	 * 
	 * @param {*} param0 
	 */
	constructor({ alphabet, tapeAlphabet, stateCount, startState, finalStates, transitions } = {}) {
		super({ alphabet, stateCount, startState, finalStates, transitions });
		this.tapeAlphabet = tapeAlphabet;
	}

	acceptsDeterministically(string) {
		if (this.startState === null) return false;
		
		let state = this.startState;
		const tape = { ...string };
		let head = 0;

		while (true) {
			const transition = this.transitions[state]?.[tape[head]];
			if (!transition) return false;

			const [ to, symbol, move ] = transition;
			state = to;
			tape[head] = symbol;
			head = move.trim().toUpperCase() === "R" ? head + 1 : head - 1;
		}

		return false;
	}

}

/*
pushdown:
	stateCount = 0,
	inputAlphabet = [],
	stackAlphabet = [],
	transitions
	startState = null,
	finalStates = [],
	initialStackSymbol
	*/
