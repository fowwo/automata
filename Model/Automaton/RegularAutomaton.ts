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

	renameSymbol(from: string, to: string): boolean {
		if (!this.alphabet.has(from)) return false;
		if (from === to) return true;
		if (this.alphabet.has(to)) return false;

		this.alphabet.delete(from);
		this.alphabet.add(to);

		for (const transition of Object.values(this.transitions)) {
			for (const symbol of Object.keys(transition)) {
				if (symbol === from) {
					transition[to] = transition[from];
					delete transition[from];
				}
			}
		}
		return true;
	}
}
