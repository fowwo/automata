type AutomatonData = {

	/** The symbols of the language. */
	alphabet?: Iterable<string>;

	/** The states or number of states. */
	states?: number | Iterable<number>;

	/** The start state. */
	startState?: number | null;

	/** The accept states. */
	acceptStates?: Iterable<number>;

	/** An object mapping states and symbols to states. */
	transitions?: { [state: number]: { [symbol: string]: unknown } };

};
export default AutomatonData;
