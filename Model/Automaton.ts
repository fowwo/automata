import AutomatonData from "../Type/AutomatonData";

/** An abstract finite automaton. */
export default abstract class Automaton {

	/** The symbols of the language. */
	alphabet: string[];

	/** The states or number of states. */
	states: Set<number>;

	/** The start state. */
	startState: number | null;

	/** The accept states. */
	acceptStates: Set<number>;

	/** An object mapping states and symbols to states. */
	transitions: { [state: number]: { [symbol: string]: unknown } };

	constructor({ alphabet = [], states = [], startState = null, acceptStates = [], transitions = {} }: AutomatonData = {}) {
		this.alphabet = Array.from(alphabet);
		if (typeof states === "number") {
			this.states = new Set();
			for (let i = 0; i < states; i++) {
				this.states.add(i);
			}
		} else {
			this.states = new Set(states);
		}
		this.startState = startState;
		this.acceptStates = new Set(acceptStates);
		this.transitions = transitions;
	}

	/** A list of all symbols in all alphabets. */
	abstract get symbols(): string[];

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

	/**
	 * Adds a symbol to the alphabet.
	 * @returns The new symbol.
	 */
	addSymbol(): string {
		const symbols = new Set(this.symbols);
		let i = 0;
		while (symbols.has(String(i))) i++;
		this.alphabet.push(String(i));
		return String(i);
	}

	/**
	 * Removes a symbol from the alphabet.
	 * @returns Whether the symbol was removed.
	 */
	abstract removeSymbol(symbol: string): boolean;

	/**
	 * Renames a symbol in the alphabet.
	 * @returns Whether the symbol was renamed.
	 */
	abstract renameSymbol(from: string, to: string): boolean;
}
