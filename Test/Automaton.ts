import { describe as suite, test } from "node:test";
import { strict as assert } from "node:assert";

// Using a DFA as the automaton since Automaton is abstract.
import Automaton from "../Model/Automaton/DeterministicFiniteAutomaton";

suite("Automaton", () => {
	test(".addState", () => {
		const automaton = new Automaton({
			alphabet: [ "a", "b" ],
			states: [ 2, 4, 5 ]
		});

		for (const expected of [ 0, 1, 3, 6, 7 ]) {
			const state = automaton.addState();
			assert.equal(state, expected, `State ${state} was added instead of state ${expected}.`);
		}
	});
	test(".addSymbol", () => {
		const automaton = new Automaton({
			alphabet: [ "a", "b", "2", "4", "5" ],
			states: [ 2, 4, 5 ]
		});

		for (const expected of [ "0", "1", "3", "6", "7" ]) {
			const symbol = automaton.addSymbol();
			assert.equal(symbol, expected, `State ${symbol} was added instead of symbol ${expected}.`);
		}
	});
});
