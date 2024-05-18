import Diagram from "../Diagram";
import DiagramData from "../../Type/DiagramData";
import NondeterministicFiniteAutomaton from "../Automaton/NondeterministicFiniteAutomaton";
import NondeterministicFiniteAutomatonData from "../../Type/NondeterministicFiniteAutomatonData";

/** A state diagram for a nondeterministic finite automaton. */
export default class NondeterministicFiniteAutomatonDiagram extends Diagram {

	declare automaton: NondeterministicFiniteAutomaton;

	constructor({ name, automaton, states, transitions, startTransition }: Omit<DiagramData, "type">) {
		super({
			name,
			type: "NFA",
			automaton: new NondeterministicFiniteAutomaton(automaton as NondeterministicFiniteAutomatonData),
			states,
			transitions,
			startTransition
		});
	}
}
