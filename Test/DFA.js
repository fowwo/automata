import { describe as suite, test } from "node:test";
import { strict as assert } from "node:assert";
import DFA from "../Model/RegularAutomaton.js";

suite("DFA", () => {
	test("1", () => {
		const machine = new DFA({
			alphabet: [ "a", "b" ],
			stateCount: 2,
			startState: 0,
			finalStates: [ 1 ],
			transitions: {
				0: { "a": 0, "b": 1 },
				1: { "a": 0, "b": 1 }
			}
		});

		assert(machine.acceptsDeterministically("b"));
		assert(machine.acceptsDeterministically("bbb"));
		assert(machine.acceptsDeterministically("ab"));
		assert(machine.acceptsDeterministically("abab"));
		assert(machine.acceptsDeterministically("aaaabaaab"));

		assert(machine.rejectsDeterministically(""));
		assert(machine.rejectsDeterministically("a"));
		assert(machine.rejectsDeterministically("ba"));
		assert(machine.rejectsDeterministically("aba"));
		assert(machine.rejectsDeterministically("baba"));
		assert(machine.rejectsDeterministically("bbbbba"));
	});
	test("2", () => {
		const alphabet = [ "a", "b", "c" ];
		const machine = new DFA({
			alphabet,
			stateCount: 5,
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
			assert(machine.rejectsDeterministically(alphabet[i]));
			for (let j = 0; j < alphabet.length; j++) {
				assert(machine.acceptsDeterministically([ i, j ].map(x => alphabet[x]).join("")));
				for (let k = 0; k < alphabet.length; k++) {
					assert(machine.acceptsDeterministically([ i, j, k ].map(x => alphabet[x]).join("")));
					for (let l = 0; l < alphabet.length; l++) {
						assert(machine.rejectsDeterministically([ i, j, k, l ].map(x => alphabet[x]).join("")));
					}
				}
			}
		}

		assert(machine.rejectsDeterministically(""));
		assert(machine.rejectsDeterministically("bcabcabcabbca"));
	});
	test("3", () => {
		const machine = new DFA({
			alphabet: [ "a", "b", "c" ],
			stateCount: 4,
			startState: 0,
			finalStates: [ 0 ],
			transitions: {
				0: { "a": 1, "b": 3, "c": 3 },
				1: { "a": 3, "b": 2, "c": 3 },
				2: { "a": 3, "b": 3, "c": 0 },
				3: { "a": 3, "b": 3, "c": 3 }
			}
		});

		assert(machine.acceptsDeterministically(""));
		assert(machine.acceptsDeterministically("abc"));
		assert(machine.acceptsDeterministically("abcabc"));
		assert(machine.acceptsDeterministically("abcabcabc"));
		assert(machine.acceptsDeterministically("abcabcabcabc"));
		assert(machine.acceptsDeterministically("abcabcabcabcabc"));

		assert(machine.rejectsDeterministically("a"));
		assert(machine.rejectsDeterministically("b"));
		assert(machine.rejectsDeterministically("c"));
		assert(machine.rejectsDeterministically("abca"));
		assert(machine.rejectsDeterministically("aabc"));
		assert(machine.rejectsDeterministically("abbc"));
		assert(machine.rejectsDeterministically("abcabcabcab"));
	});
});
