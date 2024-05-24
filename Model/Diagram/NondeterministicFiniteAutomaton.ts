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

	get mergedTransitionLabels() {
		return Object.fromEntries(Object.entries(this.automaton.transitions).map(([ from, automatonTransitions ]) => {
			const merge: { [state: number]: string[] } = {};
			Object.entries(automatonTransitions).forEach(([ symbol, transition ]) => {
				for (const to of transition) {
					if (to in merge) merge[to].push(symbol);
					else merge[to] = [ symbol ];
				}
			});
			return [ from, Object.fromEntries(Object.entries(merge).map(([ state, symbols ]) => [ state, symbols.sort().join(", ") ])) ];
		}));
	}
}
