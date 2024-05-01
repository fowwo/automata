import AutomatonData from "../Type/AutomatonData";

/** An abstract finite automaton. */
export default abstract class Automaton {

	/** The symbols of the language. */
	alphabet: Set<string>;

	/** The states or number of states. */
	states: Set<number>;

	/** The start state. */
	startState: number | null;

	/** The final states. */
	finalStates: Set<number>;

	/** An object mapping states and symbols to states. */
	transitions: { [state: number]: { [symbol: string]: unknown } };

	constructor({ alphabet = [], states = [], startState = null, finalStates = [], transitions = {} }: AutomatonData = {}) {
		this.alphabet = new Set(alphabet);
		if (typeof states === "number") {
			this.states = new Set();
			for (let i = 0; i < states; i++) {
				this.states.add(i);
			}
		} else {
			this.states = new Set(states);
		}
		this.startState = startState;
		this.finalStates = new Set(finalStates);
		this.transitions = transitions;
	}

	/** Runs the automaton on a given string. */
	abstract run(string: string, stepLimit?: number): unknown;

	/** Runs the automaton from a given context over one input symbol. */
	abstract step(...args: unknown[]): unknown;

	/** Determines whether a string is in the language. */
	abstract accepts(string: string, stepLimit?: number): boolean;

	/** Determines whether a string is not in the language. */
	abstract rejects(string: string, stepLimit?: number): boolean;

	/**
	 * Adds a state.
	 * @returns The new state.
	 */
	addState(): number {
		let i = 0;
		while (this.states.has(i)) i++;
		this.states.add(i);
		return i;
	}

	/** Removes a state and its incoming and outgoing transitions. */
	abstract removeState(state: number): void;

	/** Returns a JSON representation of the automaton. */
	toJSON(): AutomatonData {
		return {
			alphabet: Array.from(this.alphabet),
			states: Array.from(this.states),
			startState: this.startState,
			finalStates: Array.from(this.finalStates),
			transitions: this.transitions
		};
	}

}
