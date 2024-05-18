import AutomatonData from "./AutomatonData";

type DiagramData = {

	/** The name of the diagram. */
	name: string;

	/** The type of the automaton. */
	type: string;

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

};
export default DiagramData;
