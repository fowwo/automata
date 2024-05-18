import Diagram from "../Diagram";
import DiagramData from "../../Type/DiagramData";
import DeterministicFiniteAutomaton from "../Automaton/DeterministicFiniteAutomaton";
import DeterministicFiniteAutomatonData from "../../Type/DeterministicFiniteAutomatonData";

/** A state diagram for a deterministic finite automaton. */
export default class DeterministicFiniteAutomatonDiagram extends Diagram {

	declare automaton: DeterministicFiniteAutomaton;

	constructor({ name, automaton, states, transitions, startTransition }: Omit<DiagramData, "type">) {
		super({
			name,
			type: "DFA",
			automaton: new DeterministicFiniteAutomaton(automaton as DeterministicFiniteAutomatonData),
			states,
			transitions,
			startTransition
		});
	}

	get mergedTransitionLabels() {
		return Object.fromEntries(Object.entries(this.automaton.transitions).map(([ from, automatonTransitions ]) => {
			const merge: { [state: number]: string[] } = {};
			Object.entries(automatonTransitions).forEach(([ symbol, to ]) => {
				if ((to as number) in merge) merge[to as number].push(symbol);
				else merge[to as number] = [ symbol ];
			});
			return [ from, Object.fromEntries(Object.entries(merge).map(([ state, symbols ]) => [ state, symbols.sort().join(", ") ])) ];
		}));
	}

}
