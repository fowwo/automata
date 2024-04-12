import { describe as suite, test } from "node:test";
import { strict as assert } from "node:assert";
import Automaton from "../Model/Automaton.js";

suite("Automaton", () => {
	test(".addState", () => {
		const automaton = new Automaton({
			alphabet: [ "a", "b" ],
			states: [ 2, 4, 5 ]
		});

		assert.equal(automaton.addState(), 0);
		assert.equal(automaton.addState(), 1);
		assert.equal(automaton.addState(), 3);
		assert.equal(automaton.addState(), 6);
		assert.equal(automaton.addState(), 7);
	});
});
