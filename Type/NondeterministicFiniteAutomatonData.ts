import RegularAutomatonData from "./RegularAutomatonData";

type NondeterministicFiniteAutomatonData = RegularAutomatonData & {

	/** An object mapping each state and symbol to one or more states. */
	transitions?: { [state: number]: { [symbol: string]: number[] } };

};
export default NondeterministicFiniteAutomatonData;
