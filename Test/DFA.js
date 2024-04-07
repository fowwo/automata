import { describe as suite, test } from "node:test";
import { strict as assert } from "node:assert";
import DFA from "../Model/DeterministicFiniteAutomaton.js";

suite("DFA", () => {
	test("1", () => {
		const machine = new DFA({
			alphabet: [ "a", "b" ],
			states: 2,
			startState: 0,
			finalStates: [ 1 ],
			transitions: {
				0: { "a": 0, "b": 1 },
				1: { "a": 0, "b": 1 }
			}
		});

		assert(machine.accepts("b"));
		assert(machine.accepts("bbb"));
		assert(machine.accepts("ab"));
		assert(machine.accepts("abab"));
		assert(machine.accepts("aaaabaaab"));

		assert(machine.rejects(""));
		assert(machine.rejects("a"));
		assert(machine.rejects("ba"));
		assert(machine.rejects("aba"));
		assert(machine.rejects("baba"));
		assert(machine.rejects("bbbbba"));
	});
	test("2", () => {
		const alphabet = [ "a", "b", "c" ];
		const machine = new DFA({
			alphabet,
			states: 5,
			startState: 0,
			finalStates: [ 2, 3 ],
			transitions: {
				0: { "a": 1, "b": 1, "c": 1 },
				1: { "a": 2, "b": 2, "c": 2 },
				2: { "a": 3, "b": 3, "c": 3 },
				3: { "a": 4, "b": 4, "c": 4 },
				4: { "a": 4, "b": 4, "c": 4 }
			}
		});

		for (let i = 0; i < alphabet.length; i++) {
			assert(machine.rejects(alphabet[i]));
			for (let j = 0; j < alphabet.length; j++) {
				assert(machine.accepts([ i, j ].map(x => alphabet[x]).join("")));
				for (let k = 0; k < alphabet.length; k++) {
					assert(machine.accepts([ i, j, k ].map(x => alphabet[x]).join("")));
					for (let l = 0; l < alphabet.length; l++) {
						assert(machine.rejects([ i, j, k, l ].map(x => alphabet[x]).join("")));
					}
				}
			}
		}

		assert(machine.rejects(""));
		assert(machine.rejects("bcabcabcabbca"));
	});
	test("3", () => {
		const machine = new DFA({
			alphabet: [ "a", "b", "c" ],
			states: 4,
			startState: 0,
			finalStates: [ 0 ],
			transitions: {
				0: { "a": 1, "b": 3, "c": 3 },
				1: { "a": 3, "b": 2, "c": 3 },
				2: { "a": 3, "b": 3, "c": 0 },
				3: { "a": 3, "b": 3, "c": 3 }
			}
		});

		assert(machine.accepts(""));
		assert(machine.accepts("abc"));
		assert(machine.accepts("abcabc"));
		assert(machine.accepts("abcabcabc"));
		assert(machine.accepts("abcabcabcabc"));
		assert(machine.accepts("abcabcabcabcabc"));

		assert(machine.rejects("a"));
		assert(machine.rejects("b"));
		assert(machine.rejects("c"));
		assert(machine.rejects("abca"));
		assert(machine.rejects("aabc"));
		assert(machine.rejects("abbc"));
		assert(machine.rejects("abcabcabcab"));
	});
});
