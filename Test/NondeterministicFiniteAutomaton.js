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
				finalStates: [ 4 ],
				transitions: {
					0: { "a": [ 1 ] },
					1: { "b": [ 2 ] },
					2: { "b": [ 3 ] },
					3: { "a": [ 4 ] },
				}
			});
	
			assert(machine.accepts("abba"));
	
			assert(machine.rejects(""));
			assert(machine.rejects("a"));
			assert(machine.rejects("ab"));
			assert(machine.rejects("abb"));
			assert(machine.rejects("b"));
			assert(machine.rejects("aa"));
			assert(machine.rejects("aba"));
			assert(machine.rejects("abbb"));
			assert(machine.rejects("abbaa"));
			assert(machine.rejects("abbab"));
		});
		await t.test("2 - a^n(b|bb|bbb)c^m", () => {
			const machine = new NFA({
				alphabet: [ "a", "b", "c" ],
				states: 4,
				startState: 0,
				finalStates: [ 3 ],
				transitions: {
					0: { "a": [ 0 ], "b": [ 1 ], "ε": [ 1, 2 ] },
					1: { "b": [ 2 ] },
					2: { "b": [ 3 ] },
					3: { "c": [ 3 ] },
				}
			});
	
			assert(machine.accepts("b"));
			assert(machine.accepts("abc"));
			assert(machine.accepts("abbc"));
			assert(machine.accepts("abbbc"));
			assert(machine.accepts("aaaabcccccccccccc"));
			assert(machine.accepts("aaaabbcccccccccccc"));
			assert(machine.accepts("aaaabbbcccccccccccc"));
	
			assert(machine.rejects(""));
			assert(machine.rejects("ac"));
			assert(machine.rejects("bac"));
			assert(machine.rejects("acb"));
			assert(machine.rejects("cab"));
			assert(machine.rejects("abbbbc"));
			assert(machine.rejects("aaaacccccccccccc"));
			assert(machine.rejects("aaaabbbbcccccccccccc"));
		});
		await t.test("3 - 'hello world'", () => {
			const machine = new NFA({
				alphabet: [ "d", "e", "h", "l", "o", "r", "w", " " ],
				states: 12,
				startState: 0,
				finalStates: [ 11 ],
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
	
			assert(machine.accepts("hello world"));
	
			assert(machine.rejects("helloworld"));
			assert(machine.rejects("hello worl"));
			assert(machine.rejects("hello world!"));
			assert(machine.rejects("hell world"));
			assert(machine.rejects("goodbye world"));
			assert(machine.rejects("hello mom"));
			assert(machine.rejects("accept me"));
		});
		await t.test("4 - Σ(a|ba)", () => {
			const machine = new NFA({
				alphabet: [ "a", "b" ],
				states: 7,
				startState: 0,
				finalStates: [ 5 ],
				transitions: {
					0: { "a": [ 2, 6 ], "ε": [ 1, 6 ] },
					1: { "b": [ 2 ], "ε": [ 1, 6 ] },
					2: { "b": [ 3 ], "ε": [ 3, 6 ] },
					3: { "a": [ 4 ] },
					4: { "ε": [ 5 ] },
					5: { "a": [ 6 ], "b": [ 6 ], "ε": [ 6 ] }
				}
			});
	
			assert(machine.accepts("aa"));
			assert(machine.accepts("ba"));
			assert(machine.accepts("aba"));
			assert(machine.accepts("bba"));
	
			assert(machine.rejects(""));
			assert(machine.rejects("a"));
			assert(machine.rejects("b"));
			assert(machine.rejects("ab"));
			assert(machine.rejects("bb"));
			assert(machine.rejects("aaa"));
			assert(machine.rejects("aab"));
			assert(machine.rejects("abb"));
			assert(machine.rejects("baa"));
			assert(machine.rejects("bab"));
			assert(machine.rejects("bbb"));
			assert(machine.rejects("abaa"));
			assert(machine.rejects("abab"));
			assert(machine.rejects("bbaa"));
			assert(machine.rejects("bbab"));
		});
		await t.test("5 - Large and Dense", () => {
			const machine = new NFA({
				alphabet: [ "a", "b" ],
				states: 16,
				startState: 0,
				finalStates: [ 15 ],
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
	
			assert(machine.accepts("a"));
			assert(machine.accepts("b"));
			assert(machine.accepts("abab"));
			assert(machine.accepts("bbabbababab"));
			assert(machine.accepts("aaaaaaaaaaaaaaaa"));
			assert(machine.accepts("bbbbbbbbbbbbbbbb"));
			assert(machine.accepts("abaaabababaaabababababbaaaaabbabbbbababbbbbbbabababbaaaaababbabababbbbbababbbbaaaa"));
	
			assert(machine.rejects(""));
		});
	});
	test(".removeState", () => {
		const automaton = new NFA({
			alphabet: [ "a", "b", "c" ],
			states: [ 0, 1, 2, 3, 4 ],
			transitions: {
				0: { "a": [ 1, 2, 3 ], "b": [ 0, 1, 3, 4 ], "c": [ 1, 3, 4 ] },
				1: { "a": [ 0, 2, 4 ], "b": [ 1, 2, 3 ], "c": [ 0, 2, 3, 4 ] },
				2: { "a": [ 0, 1, 3, 4 ], "b": [ 0, 1, 4 ], "c": [ 0, 1, 2, 3 ] },
				3: { "a": [ 0, 2, 4 ], "b": [ 0, 1, 2, 4 ], "c": [ 0, 2, 3 ] },
				4: { "a": [ 0, 1, 2, 4 ], "b": [ 0, 2, 3, 4 ], "c": [ 1, 2, 3 ] }
			}
		});

		automaton.removeState(2);
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 1, 3 ], "b": [ 0, 1, 3, 4 ], "c": [ 1, 3, 4 ] },
			1: { "a": [ 0, 4 ], "b": [ 1, 3 ], "c": [ 0, 3, 4 ] },
			3: { "a": [ 0, 4 ], "b": [ 0, 1, 4 ], "c": [ 0, 3 ] },
			4: { "a": [ 0, 1, 4 ], "b": [ 0, 3, 4 ], "c": [ 1, 3 ] }
		});

		automaton.removeState(4);
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 1, 3 ], "b": [ 0, 1, 3 ], "c": [ 1, 3 ] },
			1: { "a": [ 0 ], "b": [ 1, 3 ], "c": [ 0, 3 ] },
			3: { "a": [ 0 ], "b": [ 0, 1 ], "c": [ 0, 3 ] }
		});

		automaton.removeState(0);
		assert.deepEqual(automaton.transitions, {
			1: { "b": [ 1, 3 ], "c": [ 3 ] },
			3: { "b": [ 1 ], "c": [ 3 ] }
		});

		automaton.removeState(3);
		assert.deepEqual(automaton.transitions, {
			1: { "b": [ 1 ] }
		});

		automaton.removeState(1);
		assert.deepEqual(automaton.transitions, {});

		automaton.removeState(100);
		assert.deepEqual(automaton.transitions, {});
	});
});
