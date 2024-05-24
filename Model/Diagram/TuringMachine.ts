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

	get mergedTransitionLabels() {
		return Object.fromEntries(Object.entries(this.automaton.transitions).map(([ from, automatonTransitions ]) => {
			const merge: { [state: number]: string[] } = {};
			Object.entries(automatonTransitions).forEach(([ symbol, [ to, newSymbol, move ] ]) => {
				const transition = `${symbol}→${newSymbol}, ${move}`;
				if (to in merge) merge[to].push(transition);
				else merge[to] = [ transition ];
			});
			return [ from, Object.fromEntries(Object.entries(merge).map(([ state, transitions ]) => [ state, transitions.sort().join("\n") ])) ];
		}));
	}
}
