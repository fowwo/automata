import Automaton from "../Automaton";
import RegularAutomatonData from "../../Type/RegularAutomatonData";

/** A finite automaton that recognizes a regular language. */
export default abstract class RegularAutomaton extends Automaton {

	/** An object mapping each state and symbol to states. */
	declare transitions;

	constructor({ alphabet, states, startState, acceptStates, transitions }: RegularAutomatonData = {}) {
		super({ alphabet, states, startState, acceptStates, transitions });
	}

	rejects(string: string): boolean {
		return !this.accepts(string);
	}

}
