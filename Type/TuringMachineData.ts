import AutomatonData from "./AutomatonData";

type TuringMachineData = AutomatonData & {

	/** The symbols allowed on the tape. */
	tapeAlphabet?: Iterable<string>;

	/** The symbol in tape cells which have not been written to. */
	blankSymbol?: string | null;

	/** An object mapping each state and symbol to a tape instruction. */
	transitions?: { [state: number]: { [symbol: string]: [state: number, symbol: string | null, move: string] }; }

};
export default TuringMachineData;
