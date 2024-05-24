import { describe as suite, test } from "node:test";
import { strict as assert } from "node:assert";
import DFA from "../Model/Automaton/DeterministicFiniteAutomaton";
import TM from "../Model/Automaton/TuringMachine";

suite("Automaton", () => {
	test(".addState", () => {
		// Using a DFA as the automaton since Automaton is abstract.
		const automaton = new DFA({
			states: [ 2, 4, 5 ]
		});

		for (const expected of [ 0, 1, 3, 6, 7 ]) {
			const state = automaton.addState();
			assert.equal(state, expected, `State ${state} was added instead of state ${expected}.`);
		}
	});
	test(".addSymbol", () => {
		// Using a Turing machine as the automaton since Automaton is abstract.
		const automaton = new TM({
			alphabet: [ "2", "5" ],
			tapeAlphabet: [ "4", "7" ]
		});

		for (const expected of [ "0", "1", "3", "6", "8" ]) {
			const symbol = automaton.addSymbol();
			assert.equal(symbol, expected, `Symbol ${symbol} was added instead of symbol ${expected}.`);
		}
		assert.deepEqual(automaton.alphabet, [ "2", "5", "0", "1", "3", "6", "8" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "4", "7" ]);
	});
});
