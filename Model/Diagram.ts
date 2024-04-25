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

}
