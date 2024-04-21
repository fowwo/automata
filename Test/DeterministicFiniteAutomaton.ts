import { describe as suite, test } from "node:test";
import { strict as assert } from "node:assert";
import DFA from "../Model/DeterministicFiniteAutomaton.js";

suite("DFA", () => {
	test(".run / .accepts / .rejects", async (t) => {
		await t.test("1 - Ends with a 'b'", () => {
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

			for (const string of [ "b", "bbb", "ab", "abab", "aaaabaaab" ]) {
				assert(machine.accepts(string), `"${string}" is rejected but should be accepted.`);
			}
			for (const string of [ "", "a", "ba", "aba", "baba", "bbbbba" ]) {
				assert(machine.rejects(string), `"${string}" is accepted but should be rejected.`);
			}
		});
		await t.test("2 - Length is Two or Three", () => {
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
				assert(machine.rejects(alphabet[i]),
					`"${alphabet[i]}" is accepted but should be rejected.`);
				for (let j = 0; j < alphabet.length; j++) {
					assert(machine.accepts([ i, j ].map(x => alphabet[x]).join("")),
						`"${[ i, j ].map(x => alphabet[x]).join("")}" is rejected but should be accepted.`);
					for (let k = 0; k < alphabet.length; k++) {
						assert(machine.accepts([ i, j, k ].map(x => alphabet[x]).join("")),
							`"${[ i, j, k ].map(x => alphabet[x]).join("")}" is rejected but should be accepted.`);
						for (let l = 0; l < alphabet.length; l++) {
							assert(machine.rejects([ i, j, k, l ].map(x => alphabet[x]).join("")),
								`"${[ i, j, k, l ].map(x => alphabet[x]).join("")}" is accepted but should be rejected.`);
						}
					}
				}
			}

			for (const string of [ "", "bcabcabcabbca" ]) {
				assert(machine.rejects(string), `"${string}" is accepted but should be rejected.`);
			}
		});
		await t.test("3 - (abc)^n", () => {
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

			for (const string of [ "", "abc", "abcabc", "abcabcabc", "abcabcabcabc", "abcabcabcabcabc" ]) {
				assert(machine.accepts(string), `"${string}" is rejected but should be accepted.`);
			}
			for (const string of [ "a", "b", "c", "abca", "aabc", "abbc", "abcabcabcab" ]) {
				assert(machine.rejects(string), `"${string}" is accepted but should be rejected.`);
			}
		});
		await t.test("4 - Length Modulo 13", () => {
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
				assert.equal(state, input.length % 13, `DFA halts on state ${state} instead of state ${input.length % 13}`);
			}
		});
	});
	test(".removeState", () => {
		const automaton = new DFA({
			alphabet: [ "a", "b", "c" ],
			states: [ 0, 1, 2, 3, 4 ],
			startState: 3,
			finalStates: [ 1, 2, 3 ],
			transitions: {
				0: { "a": 2, "b": 3, "c": 4 },
				1: { "a": 1, "b": 1, "c": 2 },
				2: { "a": 4, "b": 3, "c": 2 },
				3: { "a": 2, "b": 2, "c": 2 },
				4: { "a": 0, "b": 1, "c": 3 }
			}
		});

		automaton.removeState(2);
		assert.deepEqual(automaton.states, new Set([ 0, 1, 3, 4 ]));
		assert.equal(automaton.startState, 3);
		assert.deepEqual(automaton.finalStates, new Set([ 1, 3 ]));
		assert.deepEqual(automaton.transitions, {
			0: { "b": 3, "c": 4 },
			1: { "a": 1, "b": 1 },
			4: { "a": 0, "b": 1, "c": 3 }
		});

		automaton.removeState(4);
		assert.deepEqual(automaton.states, new Set([ 0, 1, 3 ]));
		assert.equal(automaton.startState, 3);
		assert.deepEqual(automaton.finalStates, new Set([ 1, 3 ]));
		assert.deepEqual(automaton.transitions, {
			0: { "b": 3 },
			1: { "a": 1, "b": 1 }
		});

		automaton.removeState(3);
		assert.deepEqual(automaton.states, new Set([ 0, 1 ]));
		assert.equal(automaton.startState, null);
		assert.deepEqual(automaton.finalStates, new Set([ 1 ]));
		assert.deepEqual(automaton.transitions, {
			1: { "a": 1, "b": 1 }
		});

		automaton.removeState(0);
		assert.deepEqual(automaton.states, new Set([ 1 ]));
		assert.equal(automaton.startState, null);
		assert.deepEqual(automaton.finalStates, new Set([ 1 ]));
		assert.deepEqual(automaton.transitions, {
			1: { "a": 1, "b": 1 }
		});

		automaton.removeState(1);
		assert.deepEqual(automaton.states, new Set());
		assert.equal(automaton.startState, null);
		assert.deepEqual(automaton.finalStates, new Set());
		assert.deepEqual(automaton.transitions, {});

		automaton.removeState(100);
		assert.deepEqual(automaton.states, new Set());
		assert.equal(automaton.startState, null);
		assert.deepEqual(automaton.finalStates, new Set());
		assert.deepEqual(automaton.transitions, {});
	});
});
