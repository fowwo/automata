import AutomatonData from "./AutomatonData";

type RegularAutomatonData = AutomatonData & {
	
	/** An object mapping each state and symbol to states. */
	transitions?: { [state: number]: { [symbol: string]: unknown } };

};
export default RegularAutomatonData;
