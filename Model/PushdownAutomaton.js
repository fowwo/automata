import Automaton from "./Automaton.js";

export default class PushdownAutomaton extends Automaton {

	/**
	 * 
	 * @param {*} param0 
	 */
	constructor({ alphabet, stackAlphabet, stateCount, startState, finalStates, transitions } = {}) {
		super({ alphabet, stateCount, startState, finalStates, transitions });
	}

	acceptsDeterministically() {
		if (this.startState === null) return false;

		let state = this.startState;
		let i = 0;
		const stack = [];

		// while (true) {
		// 	this.transitions[state]?.[]
		// }
	}

	accepts(string) {
		if (this.startState === null) return false;

		const dfs = [ [ this.startState, 0, [] ] ];
		while (dfs.length) {
			const [ state, index, stack ] = dfs.pop();
			// console.log(dfs, [ state, index, stack ]);
			if (index === string.length && this.finalStates.has(state)) return true;
			for (const [ to, pop, push ] of this.transitions[state]?.[string[index]] ?? []) {
				if (pop.length > stack.length) continue;
				if (pop.every((symbol, i) => symbol === stack.at(-i - 1))) {
					const newStack = stack.slice(0, stack.length - pop.length).concat([ ...push ].reverse());
					dfs.push([ to, index + 1, newStack ]);
				}
			}
			// for (const [ symbol, ] of Object.entries(this.transitions[state] ?? {})) {

			// }
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
