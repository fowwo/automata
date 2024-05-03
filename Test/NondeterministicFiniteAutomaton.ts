import { describe as suite, test } from "node:test";
import { strict as assert } from "node:assert";
import NFA from "../Model/NondeterministicFiniteAutomaton.js";

suite("NFA", () => {
	test(".accepts / .rejects", async (t) => {
		await t.test("1 - 'abba'", () => {
			const machine = new NFA({
				alphabet: [ "a", "b" ],
				states: 5,
				startState: 0,
				acceptStates: [ 4 ],
				transitions: {
					0: { "a": [ 1 ] },
					1: { "b": [ 2 ] },
					2: { "b": [ 3 ] },
					3: { "a": [ 4 ] },
				}
			});

			for (const string of [ "abba" ]) {
				assert(machine.accepts(string), `"${string}" is rejected but should be accepted.`);
			}
			for (const string of [ "", "a", "ab", "abb", "b", "aa", "aba", "abbb", "abbaa", "abbab" ]) {
				assert(machine.rejects(string), `"${string}" is accepted but should be rejected.`);
			}
		});
		await t.test("2 - a^n(b|bb|bbb)c^m", () => {
			const machine = new NFA({
				alphabet: [ "a", "b", "c" ],
				states: 4,
				startState: 0,
				acceptStates: [ 3 ],
				transitions: {
					0: { "a": [ 0 ], "b": [ 1 ], "ε": [ 1, 2 ] },
					1: { "b": [ 2 ] },
					2: { "b": [ 3 ] },
					3: { "c": [ 3 ] },
				}
			});

			for (const string of [ "b", "abc", "abbc", "abbbc", "aaaabcccccccccccc", "aaaabbcccccccccccc", "aaaabbbcccccccccccc" ]) {
				assert(machine.accepts(string), `"${string}" is rejected but should be accepted.`);
			}
			for (const string of [ "", "ac", "bac", "acb", "cab", "abbbbc", "aaaacccccccccccc", "aaaabbbbcccccccccccc" ]) {
				assert(machine.rejects(string), `"${string}" is accepted but should be rejected.`);
			}
		});
		await t.test("3 - 'hello world'", () => {
			const machine = new NFA({
				alphabet: [ "d", "e", "h", "l", "o", "r", "w", " " ],
				states: 12,
				startState: 0,
				acceptStates: [ 11 ],
				transitions: {
					0: { "h": [ 1 ] },
					1: { "e": [ 2 ] },
					2: { "l": [ 3 ] },
					3: { "l": [ 4 ] },
					4: { "o": [ 5 ] },
					5: { " ": [ 6 ] },
					6: { "w": [ 7 ] },
					7: { "o": [ 8 ] },
					8: { "r": [ 9 ] },
					9: { "l": [ 10 ] },
					10: { "d": [ 11 ] }
				}
			});

			for (const string of [ "hello world" ]) {
				assert(machine.accepts(string), `"${string}" is rejected but should be accepted.`);
			}
			for (const string of [ "helloworld", "hello worl", "hello world!", "hell world", "goodbye world", "hello mom", "accept me" ]) {
				assert(machine.rejects(string), `"${string}" is accepted but should be rejected.`);
			}
		});
		await t.test("4 - Σ(a|ba)", () => {
			const machine = new NFA({
				alphabet: [ "a", "b" ],
				states: 7,
				startState: 0,
				acceptStates: [ 5 ],
				transitions: {
					0: { "a": [ 2, 6 ], "ε": [ 1, 6 ] },
					1: { "b": [ 2 ], "ε": [ 1, 6 ] },
					2: { "b": [ 3 ], "ε": [ 3, 6 ] },
					3: { "a": [ 4 ] },
					4: { "ε": [ 5 ] },
					5: { "a": [ 6 ], "b": [ 6 ], "ε": [ 6 ] }
				}
			});

			for (const string of [ "aa", "ba", "aba", "bba" ]) {
				assert(machine.accepts(string), `"${string}" is rejected but should be accepted.`);
			}
			for (const string of [ "", "a", "b", "ab", "bb", "aaa", "aab", "abb", "baa", "bab", "bbb", "abaa", "abab", "bbaa", "bbab" ]) {
				assert(machine.rejects(string), `"${string}" is accepted but should be rejected.`);
			}
		});
		await t.test("5 - Large and Dense", () => {
			const machine = new NFA({
				alphabet: [ "a", "b" ],
				states: 16,
				startState: 0,
				acceptStates: [ 15 ],
				transitions: {
					0: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					1: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					2: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					3: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					4: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					5: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					6: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					7: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					8: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					9: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					10: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					11: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					12: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					13: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					14: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
					15: { "a": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ], "b": [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ] },
				}
			});

			for (const string of [ "a", "b", "abab", "bbabbababab", "aaaaaaaaaaaaaaaa", "bbbbbbbbbbbbbbbb", "abaaabababaaabababababbaaaaabbabbbbababbbbbbbabababbaaaaababbabababbbbbababbbbaaaa" ]) {
				assert(machine.accepts(string), `"${string}" is rejected but should be accepted.`);
			}
			for (const string of [ "" ]) {
				assert(machine.rejects(string), `"${string}" is accepted but should be rejected.`);
			}
		});
	});
	test(".removeState", () => {
		const automaton = new NFA({
			alphabet: [ "a", "b", "c" ],
			states: [ 0, 1, 2, 3, 4 ],
			startState: 3,
			acceptStates: [ 1, 2, 3 ],
			transitions: {
				0: { "a": [ 1, 2 ], "b": [ 3, 4 ], "c": [ 3, 4 ], "ε": [ 2, 4 ] },
				1: { "a": [ 2 ], "b": [ 4 ], "c": [ 2, 4 ], "ε": [ 2, 4 ] },
				2: { "a": [ 1, 3, 4 ], "b": [ 0, 1, 4 ], "c": [ 0, 1, 2, 3 ], "ε": [ 0, 1, 2, 3, 4 ] },
				3: { "a": [ 0, 2 ], "b": [ 0, 1, 2, 4 ], "c": [ 0, 2, 3 ], "ε": [ 2 ] },
				4: { "a": [ 0, 1, 2 ], "b": [ 0, 3, 4 ], "c": [ 0, 3, 4 ], "ε": [ 0, 2, 4 ] }
			}
		});

		automaton.removeState(2);
		assert.deepEqual(automaton.states, new Set([ 0, 1, 3, 4 ]));
		assert.equal(automaton.startState, 3);
		assert.deepEqual(automaton.acceptStates, new Set([ 1, 3 ]));
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 1 ], "b": [ 3, 4 ], "c": [ 3, 4 ], "ε": [ 4 ] },
			1: { "b": [ 4 ], "c": [ 4 ], "ε": [ 4 ] },
			3: { "a": [ 0 ], "b": [ 0, 1, 4 ], "c": [ 0, 3 ] },
			4: { "a": [ 0, 1 ], "b": [ 0, 3, 4 ], "c": [ 0, 3, 4 ], "ε": [ 0, 4 ] }
		});

		automaton.removeState(4);
		assert.deepEqual(automaton.states, new Set([ 0, 1, 3 ]));
		assert.equal(automaton.startState, 3);
		assert.deepEqual(automaton.acceptStates, new Set([ 1, 3 ]));
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 1 ], "b": [ 3 ], "c": [ 3 ] },
			3: { "a": [ 0 ], "b": [ 0, 1 ], "c": [ 0, 3 ] }
		});

		automaton.removeState(1);
		assert.deepEqual(automaton.states, new Set([ 0, 3 ]));
		assert.equal(automaton.startState, 3);
		assert.deepEqual(automaton.acceptStates, new Set([ 3 ]));
		assert.deepEqual(automaton.transitions, {
			0: { "b": [ 3 ], "c": [ 3 ] },
			3: { "a": [ 0 ], "b": [ 0 ], "c": [ 0, 3 ] }
		});

		automaton.removeState(3);
		assert.deepEqual(automaton.states, new Set([ 0 ]));
		assert.equal(automaton.startState, null);
		assert.deepEqual(automaton.acceptStates, new Set());
		assert.deepEqual(automaton.transitions, {});

		automaton.removeState(0);
		assert.deepEqual(automaton.states, new Set());
		assert.equal(automaton.startState, null);
		assert.deepEqual(automaton.acceptStates, new Set());
		assert.deepEqual(automaton.transitions, {});

		automaton.removeState(100);
		assert.deepEqual(automaton.states, new Set());
		assert.equal(automaton.startState, null);
		assert.deepEqual(automaton.acceptStates, new Set());
		assert.deepEqual(automaton.transitions, {});
	});
});
