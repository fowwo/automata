type AutomatonData = {

	/** The symbols of the language. */
	alphabet?: Iterable<string>;

	/** The states or number of states. */
	states?: number | Iterable<number>;

	/** The start state. */
	startState?: number | null;

	/** The final states. */
	finalStates?: Iterable<number>;

	/** An object mapping states and symbols to states. */
	transitions?: { [state: number]: unknown; };

};
export default AutomatonData;
