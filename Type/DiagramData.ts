import AutomatonData from "./AutomatonData";
import DFAData from "./DeterministicFiniteAutomatonData";
import AutomatonType from "./AutomatonType";
import NFAData from "./NondeterministicFiniteAutomatonData";
import TMData from "./TuringMachineData";

type DiagramData = {

	/** The name of the diagram. */
	name: string;

	/** The type of the automaton. */
	type: AutomatonType;

	/** The data of the automaton. */
	automaton: AutomatonData;

	/** The properties of each state. */
	states: {
		[state: number]: {
			x: number;
			y: number;
			label: string;
		}
	};

	/** The angle of each transition. */
	transitions: {
		[from: number]: {
			[to: number]: number
		}
	};

	/** The properties of the start transition. */
	startTransition: {
		angle: number;
		length: number;
	};

} & (
	{ type: "DFA"; automaton: DFAData } |
	{ type: "NFA"; automaton: NFAData } |
	{ type: "TM"; automaton: TMData }
);
export default DiagramData;
