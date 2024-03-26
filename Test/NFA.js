import { describe as suite, test } from "node:test";
import { strict as assert } from "node:assert";
import NFA from "../Model/NFA.js";

suite("NFA", () => {
	test("1", () => {
		const machine = new NFA({
			alphabet: [ "a", "b" ],
			stateCount: 5,
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
	test("2", () => {
		const machine = new NFA({
			alphabet: [ "a", "b", "c" ],
			stateCount: 4,
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
	test("3", () => {
		const machine = new NFA({
			alphabet: [ "d", "e", "h", "l", "o", "r", "w", " " ],
			stateCount: 12,
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
	test("4", () => {
		const machine = new NFA({
			alphabet: [ "a", "b" ],
			stateCount: 7,
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
	test("5", () => {
		const machine = new NFA({
			alphabet: [ "a", "b" ],
			stateCount: 16,
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
