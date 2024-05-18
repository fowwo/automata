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
}
