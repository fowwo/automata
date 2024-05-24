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

	removeSymbol(symbol: string): boolean {
		const i = this.alphabet.indexOf(symbol);
		if (i === -1) return false;

		this.alphabet.splice(i, 1);

		for (const [ state, transition ] of Object.entries(this.transitions)) {
			for (const transitionSymbol of Object.keys(transition)) {
				if (transitionSymbol === symbol) {
					delete transition[symbol];
				}
			}
			if (Object.keys(transition).length === 0) {
				delete this.transitions[+state];
			}
		}
		return true;
	}

	renameSymbol(from: string, to: string): boolean {
		if (from === "ε" || to === "ε") return false; // Prevent renaming to and from epsilon symbol.

		const i = this.alphabet.indexOf(from);
		if (i === -1) return false;
		if (from === to) return true;
		if (this.alphabet.includes(to)) return false;

		this.alphabet[i] = to;

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
