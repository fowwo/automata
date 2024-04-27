import Automaton from "./Automaton";
import DFA from "./DeterministicFiniteAutomaton";
import NFA from "./NondeterministicFiniteAutomaton";
import TM from "./TuringMachine";
import DiagramData from "../Type/DiagramData";
import AutomatonType from "../Type/AutomatonType";

/** A state diagram for an automaton. */
export default class Diagram {

	/** The name of the diagram. */
	name: string;

	/** The type of the automaton. */
	type: AutomatonType;

	/** The automaton. */
	automaton: Automaton;

	/** The properties of each state. */
	states: DiagramData["states"];

	/** The angle of each transition. */
	transitions: DiagramData["transitions"];

	/** The properties of the start transition. */
	startTransition: DiagramData["startTransition"];

	constructor({ name, type, automaton, states, transitions, startTransition }: DiagramData) {
		this.type = type;
		this.name = name;
		this.states = states;
		this.transitions = transitions;
		this.startTransition = startTransition;
		switch (type) {
			case "DFA":
				this.automaton = new DFA(automaton);
				break;
			case "NFA":
				this.automaton = new NFA(automaton);
				break;
			case "TM":
				this.automaton = new TM(automaton);
				break;
		}
	}

	/** Adds a state to the diagram. */
	addState(x: number = 0, y: number = 0) {

		// Add state to the automaton.
		const state = this.automaton.addState();

		// Find unique label.
		let label = this.automaton.states.size - 1;
		const labels = new Set(Object.values(this.states).map(state => state.label));
		while (labels.has(String(label))) label++;

		// Add state properties.
		this.states[state] = { x, y, label: String(label) };
	}

	/** Removes a state from the diagram. */
	removeState(state: number) {

		// Remove state from the automaton.
		this.automaton.removeState(state);

		// If the start state was removed, reassign it to an existing state.
		if (this.automaton.startState === null && this.automaton.states.size > 0) {
			this.automaton.startState = this.automaton.states.values().next().value;
		}

		// Remove state properties.
		delete this.states[state];

		// Remove outgoing transitions.
		if (state in this.transitions) {
			delete this.transitions[state];
		}

		// Remove incoming transitions.
		for (const transitions of Object.values(this.transitions)) {
			if (state in transitions) {
				delete transitions[state];
			}
		}
	}

}
