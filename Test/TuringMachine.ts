import { describe as suite, test } from "node:test";
import { strict as assert } from "node:assert";
import TM, { tapeToString } from "../Model/TuringMachine.js";

suite("TM", () => {
	test("1 - Inverting Bits", () => {
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
	test("2 - Length is Power of Two", () => {
		const machine = new TM({
			alphabet: [ "0" ],
			tapeAlphabet: [ "x" ],
			states: 6,
			startState: 0,
			finalStates: [ 5 ],
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
	test("3 - Add Binary Numbers", () => {
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
	test("4 - Halts in Five Steps or Fewer", () => {
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
