import { describe as suite, test } from "node:test";
import { strict as assert } from "node:assert";
import PDA from "../Model/PushdownAutomaton.js";

suite("PDA", () => {
	test("1", () => {
		const machine = new PDA({
			alphabet: [ "a", "b" ],
			stackAlphabet: [ "A", "B" ],
			stateCount: 4,
			startState: 0,
			finalStates: [ 3 ],
			transitions: {
				0: {
					"a": [
						[ 1, [], [ "A", ] ]
					]
				},
				1: {
					"b": [
						[ 1, [], [ "B" ] ],
						[ 2, [], [ "B" ] ]
					]
				},
				2: {
					"a": [
						[ 2, [ "B" ], [] ]
					],
					"b": [
						[ 3, [ "A" ], [] ]
					]
				}
			}
		});

		assert(machine.accepts("abab"));
		assert(machine.accepts("abbaab"));
		assert(machine.accepts("abbbaaab"));
		assert(machine.accepts("abbbbbbbaaaaaaab"));
		assert(machine.accepts("abbbbbbbbbbbbaaaaaaaaaaaab"));

		assert(machine.rejects(""));
		assert(machine.rejects("a"));
		assert(machine.rejects("b"));
		assert(machine.rejects("ab"));
		assert(machine.rejects("abb"));
		assert(machine.rejects("abbab"));
		assert(machine.rejects("ababb"));
		assert(machine.rejects("ababa"));
		assert(machine.rejects("aabab"));
		assert(machine.rejects("babab"));
	}),
	test.skip("3", () => {
		const machine = new PDA({
			alphabet: [ "a", "b" ],
			stackAlphabet: [ "$", "-", "+" ],
			stateCount: 3,
			startState: 0,
			finalStates: [ 2 ],
			transitions: {
				0: {
					"ε": [
						[ 1, [], [ "$" ] ]
					]
				},
				1: {
					"a": [
						[ 1, [ "$" ], [ "+", "$" ] ],
						[ 1, [ "+" ], [ "+", "+" ] ],
						[ 1, [ "-" ], [] ]
					],
					"b": [
						[ 1, [ "$" ], [ "-", "$" ] ],
						[ 1, [ "+" ], [] ],
						[ 1, [ "-" ], [ "-", "-" ] ]
					],
					"ε": [
						[ 2, [ "$" ], [] ]
					]
				}
			}
		});

		assert(machine.accepts(""));
		assert(machine.accepts("ab"));
		assert(machine.accepts("ba"));
		assert(machine.accepts("aabb"));
		assert(machine.accepts("abab"));
		assert(machine.accepts("baab"));
		assert(machine.accepts("baba"));
		assert(machine.accepts("bbaa"));
		assert(machine.accepts("abba"));
		assert(machine.accepts("abababbaaabbbaaababb"));
		assert(machine.accepts("baabbbaaaabbbbbaaaaaabbbbbbbaaaaaaaabbbb"));

		assert(machine.rejects("a"));
		assert(machine.rejects("b"));
		assert(machine.rejects("aa"));
		assert(machine.rejects("abb"));
		assert(machine.rejects("bb"));
		assert(machine.rejects("aba"));
		assert(machine.rejects("baa"));
		assert(machine.rejects("abbb"));
		assert(machine.rejects("abbaa"));
		assert(machine.rejects("abbab"));
		assert(machine.rejects("aabbaaaabbaaaaa"));
		assert(machine.rejects("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"));
	});
});
