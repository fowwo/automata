import Automaton from "./Automaton.js";

export default class TuringMachine extends Automaton {

	/**
	 * @param {Object} automaton - An object containing the properties of the automaton.
	 * @param {Iterable<String>} automaton.alphabet - The symbols of the language.
	 * @param {Iterable<String>} automaton.tapeAlphabet - The symbols allowed on the tape.
	 * @param {String} automaton.blankSymbol - The symbol in tape cells which have not been written to.
	 * @param {Iterable<Number> | Number} automaton.states - The states or number of states.
	 * @param {Number} automaton.startState - The start state.
	 * @param {Iterable<Number>} automaton.finalStates - The final states.
	 * @param {{[state: Number]: {[symbol: String]: Number}}} automaton.transitions - An object mapping each state and each symbol to a state.
	 */
	constructor({ alphabet, tapeAlphabet = [], blankSymbol = null, states, startState, finalStates, transitions } = {}) {
		super({ alphabet, states, startState, finalStates, transitions });
		this.tapeAlphabet = new Set(tapeAlphabet);
		this.blankSymbol = blankSymbol;
	}

	/**
	 * @param {String} string - The input string.
	 * @param {Number} [stepLimit] - The maximum number of transitions to take.
	 * @returns {{ state: Number | null, tape: { [index: Number]: String }, head: Number, halt: Boolean }}
	 * 	An object containing the resulting state, tape, tape head position, and whether the automaton halted within the step limit.
	 */
	run(string, stepLimit) {
		let state = this.startState;
		let tape = { ...string };
		let head = 0;

		// Run the automaton for `stepLimit` steps (if specified).
		for (let i = 0; i !== stepLimit; i++) {
			const previousState = state;
			({ state, head } = this.step(state, tape, head));
			if (state === null) return { state: previousState, tape, head, halt: true };
		}

		// If there is no valid transitions after reaching the step limit, the automaton has halted.
		const tapeCopy = { ...tape };
		const nextState = this.step(state, tapeCopy, head).state;
		return { state, tape, head, halt: nextState === null };
	}

	/**
	 * @param {Number} state - The state to transition from.
	 * @param {{ [index: Number]: String }} tape - The tape.
	 * @param {Number} head - The position of the tape head.
	 * @returns {{ state: Number | null, head: Number }} An object containing the next state and tape head position.
	 */
	step(state, tape, head) {
		const symbol = head in tape ? tape[head] : this.blankSymbol;
		const transition = this.transitions[state]?.[symbol];
		if (!transition) return { state: null, head };

		const [ nextState, newSymbol, direction ] = transition;
		if (newSymbol === this.blankSymbol) {
			delete tape[head];
		} else {
			tape[head] = newSymbol;
		}
		switch (direction) {
			case "L":
			case "l":
				head--;
				break;
			case "R":
			case "r":
				head++;
				break;
		}
		return { state: nextState, head };
	}

	/**
	 * @param {String} string - The input string.
	 * @param {Number} [stepLimit] - The maximum number of transitions to take.
	 * @returns {Boolean}
	 */
	accepts(string, stepLimit) {
		const { state, halt } = this.run(string, stepLimit);
		return halt && this.finalStates.has(state);
	}

	/**
	 * Determines whether a string is not in the language.
	 * 
	 * If the input string does not halt within the step limit (if specified),
	 * this method will return `false`.
	 * @param {String} string - The input string.
	 * @param {Number} [stepLimit] - The maximum number of transitions to take.
	 * @returns {Boolean}
	 */
	rejects(string, stepLimit) {
		const { state, halt } = this.run(string, stepLimit);
		return halt && !this.finalStates.has(state);
	}

}

/**
 * Returns the tape in string form.
 * 
 * Any blank symbols in between written tape cells are converted to spaces.
 * @param {{ state: Number | null, head: Number }} tape - The tape.
 */
export function tapeToString(tape) {
	const indices = Object.keys(tape).map(Number);
	if (indices.length === 0) return "";

	const [ min, max ] = indices.reduce(([ min, max ], i) => [ Math.min(min, i), Math.max(max, i) ], [ indices[0], indices[0] ]);
	let string = "";
	for (let i = min; i <= max; i++) {
		string += i in tape ? tape[i] : " ";
	}
	return string;
}
