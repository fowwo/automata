import RegularAutomatonData from "./RegularAutomatonData";

type DeterministicFiniteAutomatonData = RegularAutomatonData & {
	
	/** An object mapping each state and symbol to a state. */
	transitions?: { [state: number]: { [symbol: string]: number } };

};
export default DeterministicFiniteAutomatonData;
