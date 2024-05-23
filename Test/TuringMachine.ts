import { describe as suite, test } from "node:test";
import { strict as assert } from "node:assert";
import TM, { tapeToString } from "../Model/Automaton/TuringMachine";

suite("TM", () => {
	test(".run / .accepts / .rejects", async (t) => {
		await t.test("1 - Inverting Bits", () => {
			const machine = new TM({
				alphabet: [ "0", "1" ],
				states: 1,
				startState: 0,
				transitions: {
					0: { "0": [ 0, "1", "R" ], "1": [ 0, "0", "R" ] }
				}
			});
	
			for (const [ input, expected ] of [
				[ "0", "1" ],
				[ "1", "0" ],
				[ "0101110010110", "1010001101001" ],
				[ "110101010011110100101", "001010101100001011010" ],
				[ "0101101001011110110100101101001011101001010110101010110100101", "1010010110100001001011010010110100010110101001010101001011010" ]
			]) {
				const { tape, head } = machine.run(input);
				assert.equal(tapeToString(tape), expected);
				assert.equal(head, input.length);
			}
		});
		await t.test("2 - Length is Power of Two", () => {
			const machine = new TM({
				alphabet: [ "0" ],
				tapeAlphabet: [ "x" ],
				states: 6,
				startState: 0,
				acceptStates: [ 5 ],
				transitions: {
					0: { "0": [ 1, "⊔", "R" ] },
					1: { "0": [ 2, "x", "R" ], "x": [ 1, "x", "R" ], "⊔": [ 5, "⊔", "R" ] },
					2: { "0": [ 4, "0", "R" ], "x": [ 2, "x", "R" ], "⊔": [ 3, "⊔", "L" ] },
					3: { "0": [ 3, "0", "L" ], "x": [ 3, "x", "L" ], "⊔": [ 1, "⊔", "R" ] },
					4: { "0": [ 2, "x", "R" ], "x": [ 4, "x", "R" ] }
				}
			});
	
			let input = "";
			for (let n = 1; n <= 64; n++) {
				input += "0";
				if (n & (n - 1)) {
					assert(machine.rejects(input), `"${input}" is accepted but should be rejected.`);
				} else {
					assert(machine.accepts(input), `"${input}" is rejected but should be accepted.`);
				}
			}
		});
		await t.test("3 - Add Binary Numbers", () => {
			const machine = new TM({
				alphabet: [ "0", "1", "+" ],
				states: 6,
				startState: 0,
				transitions: {
					0: {
						"0": [ 0, "0", "R" ],
						"1": [ 0, "1", "R" ],
						"+": [ 1, "+", "R" ]
					},
					1: {
						"0": [ 1, "0", "R" ],
						"1": [ 1, "1", "R" ],
						"⊔": [ 2, "⊔", "L" ]
					},
					2: {
						"0": [ 2, "1", "L" ],
						"1": [ 3, "0", "L" ],
						"+": [ 5, "⊔", "R" ]
					},
					3: {
						"0": [ 3, "0", "L" ],
						"1": [ 3, "1", "L" ],
						"+": [ 4, "+", "L" ]
					},
					4: {
						"0": [ 0, "1", "R" ],
						"1": [ 4, "0", "L" ],
						"⊔": [ 0, "1", "R" ]
					},
					5: {
						"1": [ 5, "⊔", "R" ]
					},
				}
			});
	
			for (const [ input, expected ] of [
				[ "1+1", "10" ],
				[ "101+010", "111" ],
				[ "110101+1001101001", "1010011110" ],
				[ "100", "100" ],
				[ "+100", "100" ],
			]) {
				const { tape } = machine.run(input);
				assert.equal(tapeToString(tape), expected);
			}
		});
		await t.test("4 - Halts in Five Steps or Fewer", () => {
			const machine = new TM({
				alphabet: [ "0" ],
				states: 1,
				startState: 0,
				transitions: {
					0: { "0": [ 0, "⊔", "R" ] }
				}
			});
	
			for (const input of [ "", "0", "00", "000", "0000", "00000" ]) {
				const { halt } = machine.run(input, 5);
				assert(halt);
			}
			for (const input of [ "000000", "0000000", "00000000" ]) {
				const { halt } = machine.run(input, 5);
				assert(!halt);
			}
		});
	});
	test(".removeState", () => {
		const automaton = new TM({
			alphabet: [ "0" ],
			tapeAlphabet: [ "x" ],
			states: 6,
			startState: 0,
			acceptStates: [ 5 ],
			transitions: {
				0: { "0": [ 1, "⊔", "R" ] },
				1: { "0": [ 2, "x", "R" ], "x": [ 1, "x", "R" ], "⊔": [ 5, "⊔", "R" ] },
				2: { "0": [ 4, "0", "R" ], "x": [ 2, "x", "R" ], "⊔": [ 3, "⊔", "L" ] },
				3: { "0": [ 3, "0", "L" ], "x": [ 3, "x", "L" ], "⊔": [ 1, "⊔", "R" ] },
				4: { "0": [ 2, "x", "R" ], "x": [ 4, "x", "R" ] }
			}
		});

		automaton.removeState(4);
		assert.deepEqual(automaton.states, new Set([ 0, 1, 2, 3, 5 ]));
		assert.equal(automaton.startState, 0);
		assert.deepEqual(automaton.acceptStates, new Set([ 5 ]));
		assert.deepEqual(automaton.transitions, {
			0: { "0": [ 1, "⊔", "R" ] },
			1: { "0": [ 2, "x", "R" ], "x": [ 1, "x", "R" ], "⊔": [ 5, "⊔", "R" ] },
			2: { "x": [ 2, "x", "R" ], "⊔": [ 3, "⊔", "L" ] },
			3: { "0": [ 3, "0", "L" ], "x": [ 3, "x", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		automaton.removeState(1);
		assert.deepEqual(automaton.states, new Set([ 0, 2, 3, 5 ]));
		assert.equal(automaton.startState, 0);
		assert.deepEqual(automaton.acceptStates, new Set([ 5 ]));
		assert.deepEqual(automaton.transitions, {
			2: { "x": [ 2, "x", "R" ], "⊔": [ 3, "⊔", "L" ] },
			3: { "0": [ 3, "0", "L" ], "x": [ 3, "x", "L" ] }
		});

		automaton.removeState(5);
		assert.deepEqual(automaton.states, new Set([ 0, 2, 3 ]));
		assert.equal(automaton.startState, 0);
		assert.deepEqual(automaton.acceptStates, new Set());
		assert.deepEqual(automaton.transitions, {
			2: { "x": [ 2, "x", "R" ], "⊔": [ 3, "⊔", "L" ] },
			3: { "0": [ 3, "0", "L" ], "x": [ 3, "x", "L" ] }
		});

		automaton.removeState(0);
		assert.deepEqual(automaton.states, new Set([ 2, 3 ]));
		assert.equal(automaton.startState, null);
		assert.deepEqual(automaton.acceptStates, new Set());
		assert.deepEqual(automaton.transitions, {
			2: { "x": [ 2, "x", "R" ], "⊔": [ 3, "⊔", "L" ] },
			3: { "0": [ 3, "0", "L" ], "x": [ 3, "x", "L" ] }
		});

		automaton.removeState(3);
		assert.deepEqual(automaton.states, new Set([ 2 ]));
		assert.equal(automaton.startState, null);
		assert.deepEqual(automaton.acceptStates, new Set());
		assert.deepEqual(automaton.transitions, {
			2: { "x": [ 2, "x", "R" ] }
		});

		automaton.removeState(2);
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
	test(".renameSymbol", () => {
		const automaton = new TM({
			alphabet: [ "a", "b", "c" ],
			tapeAlphabet: [ "A", "B", "C" ],
			blankSymbol: "_",
			states: 3,
			startState: 0,
			acceptStates: [],
			transitions: {
				0: { "a": [ 0, "b", "R" ], "b": [ 1, "c", "R" ], "C": [ 2, "a", "L" ], "_": [ 0, "_", "R" ] },
				1: { "a": [ 0, "B", "R" ], "B": [ 1, "C", "R" ], "c": [ 2, "A", "L" ], "_": [ 1, "_", "L" ] },
				2: { "a": [ 2, "_", "R" ], "C": [ 0, "_", "L" ], "_": [ 1, "_", "R" ] }
			}
		});

		assert(automaton.renameSymbol("c", "d"));
		assert.deepEqual(automaton.alphabet, [ "a", "b", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "A", "B", "C" ]);
		assert.equal(automaton.blankSymbol, "_");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "b", "R" ], "b": [ 1, "d", "R" ], "C": [ 2, "a", "L" ], "_": [ 0, "_", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "C", "R" ], "d": [ 2, "A", "L" ], "_": [ 1, "_", "L" ] },
			2: { "a": [ 2, "_", "R" ], "C": [ 0, "_", "L" ], "_": [ 1, "_", "R" ] }
		});

		assert(!automaton.renameSymbol("b", "d"));
		assert.deepEqual(automaton.alphabet, [ "a", "b", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "A", "B", "C" ]);
		assert.equal(automaton.blankSymbol, "_");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "b", "R" ], "b": [ 1, "d", "R" ], "C": [ 2, "a", "L" ], "_": [ 0, "_", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "C", "R" ], "d": [ 2, "A", "L" ], "_": [ 1, "_", "L" ] },
			2: { "a": [ 2, "_", "R" ], "C": [ 0, "_", "L" ], "_": [ 1, "_", "R" ] }
		});

		assert(automaton.renameSymbol("C", "D"));
		assert.deepEqual(automaton.alphabet, [ "a", "b", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "A", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "_");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "b", "R" ], "b": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "_": [ 0, "_", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "A", "L" ], "_": [ 1, "_", "L" ] },
			2: { "a": [ 2, "_", "R" ], "D": [ 0, "_", "L" ], "_": [ 1, "_", "R" ] }
		});

		assert(!automaton.renameSymbol("B", "D"));
		assert.deepEqual(automaton.alphabet, [ "a", "b", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "A", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "_");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "b", "R" ], "b": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "_": [ 0, "_", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "A", "L" ], "_": [ 1, "_", "L" ] },
			2: { "a": [ 2, "_", "R" ], "D": [ 0, "_", "L" ], "_": [ 1, "_", "R" ] }
		});

		assert(automaton.renameSymbol("_", "⊔"));
		assert.deepEqual(automaton.alphabet, [ "a", "b", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "A", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "b", "R" ], "b": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "A", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		assert(automaton.renameSymbol("b", "C"));
		assert.deepEqual(automaton.alphabet, [ "a", "C", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "A", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "C", "R" ], "C": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "A", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		assert(automaton.renameSymbol("A", "c"));
		assert.deepEqual(automaton.alphabet, [ "a", "C", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "c", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "C", "R" ], "C": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "c", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		assert(!automaton.renameSymbol("c", "C"));
		assert.deepEqual(automaton.alphabet, [ "a", "C", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "c", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "C", "R" ], "C": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "c", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		assert(!automaton.renameSymbol("c", "⊔"));
		assert.deepEqual(automaton.alphabet, [ "a", "C", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "c", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "C", "R" ], "C": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "c", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		assert(!automaton.renameSymbol("C", "c"));
		assert.deepEqual(automaton.alphabet, [ "a", "C", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "c", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "C", "R" ], "C": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "c", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		assert(!automaton.renameSymbol("C", "⊔"));
		assert.deepEqual(automaton.alphabet, [ "a", "C", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "c", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "C", "R" ], "C": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "c", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		assert(!automaton.renameSymbol("⊔", "c"));
		assert.deepEqual(automaton.alphabet, [ "a", "C", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "c", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "C", "R" ], "C": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "c", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		assert(!automaton.renameSymbol("⊔", "C"));
		assert.deepEqual(automaton.alphabet, [ "a", "C", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "c", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "C", "R" ], "C": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "c", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		assert(automaton.renameSymbol("d", "d"));
		assert.deepEqual(automaton.alphabet, [ "a", "C", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "c", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "C", "R" ], "C": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "c", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		assert(automaton.renameSymbol("D", "D"));
		assert.deepEqual(automaton.alphabet, [ "a", "C", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "c", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "C", "R" ], "C": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "c", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		assert(automaton.renameSymbol("⊔", "⊔"));
		assert.deepEqual(automaton.alphabet, [ "a", "C", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "c", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "C", "R" ], "C": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "c", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		assert(!automaton.renameSymbol("e", "e"));
		assert.deepEqual(automaton.alphabet, [ "a", "C", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "c", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "C", "R" ], "C": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "c", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});

		assert(!automaton.renameSymbol("", ""));
		assert.deepEqual(automaton.alphabet, [ "a", "C", "d" ]);
		assert.deepEqual(automaton.tapeAlphabet, [ "c", "B", "D" ]);
		assert.equal(automaton.blankSymbol, "⊔");
		assert.deepEqual(automaton.transitions, {
			0: { "a": [ 0, "C", "R" ], "C": [ 1, "d", "R" ], "D": [ 2, "a", "L" ], "⊔": [ 0, "⊔", "R" ] },
			1: { "a": [ 0, "B", "R" ], "B": [ 1, "D", "R" ], "d": [ 2, "c", "L" ], "⊔": [ 1, "⊔", "L" ] },
			2: { "a": [ 2, "⊔", "R" ], "D": [ 0, "⊔", "L" ], "⊔": [ 1, "⊔", "R" ] }
		});
	});
});
