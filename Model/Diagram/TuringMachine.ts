import Diagram from "../Diagram";
import DiagramData from "../../Type/DiagramData";
import TuringMachine from "../Automaton/TuringMachine";
import TuringMachineData from "../../Type/TuringMachineData";

/** A state diagram for a Turing machine. */
export default class TuringMachineDiagram extends Diagram {

	declare automaton: TuringMachine;

	constructor({ name, automaton, states, transitions, startTransition }: Omit<DiagramData, "type">) {
		super({
			name,
			type: "TM",
			automaton: new TuringMachine(automaton as TuringMachineData),
			states,
			transitions,
			startTransition
		});
	}
}
