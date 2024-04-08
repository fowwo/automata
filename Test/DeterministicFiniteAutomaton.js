import { describe as suite, test } from "node:test";
import { strict as assert } from "node:assert";
import DFA from "../Model/DeterministicFiniteAutomaton.js";

suite("DFA", () => {
	test("1 - Ends with a 'b'", () => {
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
	test("2 - Length is Two or Three", () => {
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
	test("3 - (abc)^n", () => {
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
	test("4 - Length Modulo 13", () => {
		const machine = new DFA({
			alphabet: [ "a", "b", "c" ],
			states: 7,
			startState: 0,
			transitions: {
				0: { "a": 1, "b": 1, "c": 1 },
				1: { "a": 2, "b": 2, "c": 2 },
				2: { "a": 3, "b": 3, "c": 3 },
				3: { "a": 4, "b": 4, "c": 4 },
				4: { "a": 5, "b": 5, "c": 5 },
				5: { "a": 6, "b": 6, "c": 6 },
				6: { "a": 7, "b": 7, "c": 7 },
				7: { "a": 8, "b": 8, "c": 8 },
				8: { "a": 9, "b": 9, "c": 9 },
				9: { "a": 10, "b": 10, "c": 10 },
				10: { "a": 11, "b": 11, "c": 11 },
				11: { "a": 12, "b": 12, "c": 12 },
				12: { "a": 0, "b": 0, "c": 0 }
			}
		});

		for (const input of [ "", "abc", "aaaaaa", "abacbbcabccb", "bacbabcabcabbcabcbabcabcbabcabca" ]) {
			const state = machine.run(input);
			assert.equal(state, input.length % 13);
		}
	});
});
