import { describe as suite, test } from "node:test";
import { strict as assert } from "node:assert";
import RegularAutomaton from "../Model/Automaton/NondeterministicFiniteAutomaton";

// Using an NFA as the automaton since RegularAutomaton is abstract.
suite("RegularAutomaton", () => {
	test(".renameSymbol", () => {
		const automaton = new RegularAutomaton({
			alphabet: [ "a", "b", "c" ],
			states: 3,
			startState: 0,
			acceptStates: [],
			transitions: {
				0: { "a": [ 0, 1, 2 ], "b": [ 1 ], "c": [ 2 ] },
				1: { "b": [ 1, 2 ], "c": [ 0, 2 ] },
				2: { "a": [ 2 ], "c": [ 0, 1 ], "ε": [ 1 ] },
			}
		});

		assert(automaton.renameSymbol("c", "d"));
		assert.deepEqual(automaton.alphabet, [ "a", "b", "d" ]);
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, 1, 2 ], "b": [ 1 ], "d": [ 2 ] },
			1: { "b": [ 1, 2 ], "d": [ 0, 2 ] },
			2: { "a": [ 2 ], "d": [ 0, 1 ], "ε": [ 1 ] },
		});

		assert(!automaton.renameSymbol("b", "d"));
		assert.deepEqual(automaton.alphabet, [ "a", "b", "d" ]);
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, 1, 2 ], "b": [ 1 ], "d": [ 2 ] },
			1: { "b": [ 1, 2 ], "d": [ 0, 2 ] },
			2: { "a": [ 2 ], "d": [ 0, 1 ], "ε": [ 1 ] },
		});

		assert(automaton.renameSymbol("b", "c"));
		assert.deepEqual(automaton.alphabet, [ "a", "c", "d" ]);
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, 1, 2 ], "c": [ 1 ], "d": [ 2 ] },
			1: { "c": [ 1, 2 ], "d": [ 0, 2 ] },
			2: { "a": [ 2 ], "d": [ 0, 1 ], "ε": [ 1 ] },
		});

		assert(automaton.renameSymbol("a", "A"));
		assert.deepEqual(automaton.alphabet, [ "A", "c", "d" ]);
		assert.deepEqual(automaton.transitions, {
			0: { "A": [ 0, 1, 2 ], "c": [ 1 ], "d": [ 2 ] },
			1: { "c": [ 1, 2 ], "d": [ 0, 2 ] },
			2: { "A": [ 2 ], "d": [ 0, 1 ], "ε": [ 1 ] },
		});

		assert(!automaton.renameSymbol("", ""));
		assert.deepEqual(automaton.alphabet, [ "A", "c", "d" ]);
		assert.deepEqual(automaton.transitions, {
			0: { "A": [ 0, 1, 2 ], "c": [ 1 ], "d": [ 2 ] },
			1: { "c": [ 1, 2 ], "d": [ 0, 2 ] },
			2: { "A": [ 2 ], "d": [ 0, 1 ], "ε": [ 1 ] },
		});
	});
});
