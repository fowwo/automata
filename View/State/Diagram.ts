import { reactive, ref } from "vue";
import Diagram from "../../Model/Diagram";
import DiagramData from "../../Type/DiagramData";
import DeterministicFiniteAutomatonDiagram from "../../Model/Diagram/DeterministicFiniteAutomaton";
import NondeterministicFiniteAutomatonDiagram from "../../Model/Diagram/NondeterministicFiniteAutomaton";
import TuringMachineDiagram from "../../Model/Diagram/TuringMachine";

// Read diagram data from local storage.
let data = localStorage.getItem("diagrams");
if (data === null) {

	// Create a default diagram.
	const defaultData: DiagramData = {
		name: "Diagram",
		type: "DFA",
		automaton: {
			alphabet: [ "a", "b" ],
			states: 2,
			startState: 0,
			acceptStates: [ 1 ],
			transitions: {
				0: { "a": 0, "b": 1 },
				1: { "a": 0, "b": 1 }
			}
		},
		states: {
			0: { x: -100, y: 0, label: "0" },
			1: { x: 100, y: 0, label: "1" }
		},
		transitions: {
			0: {
				0: -Math.PI / 2,
				1: -Math.PI / 6
			},
			1: {
				0: -Math.PI / 6,
				1: -Math.PI / 2
			}
		},
		startTransition: {
			angle: Math.PI,
			length: 75
		}
	};
	data = JSON.stringify([ defaultData ]);
	localStorage.setItem("diagrams", data);
}

// Load diagrams.
const rawDiagrams: DiagramData[] = JSON.parse(data);
export const diagrams = reactive(rawDiagrams.map(x => parseDiagram(x)));
export const diagram = ref<Diagram>(diagrams[0]); // TODO: Store last opened diagram.

export function createDiagram(type: string) {

	// Generate a unique name.
	const names = new Set(diagrams.map(diagram => diagram.name));
	let diagramNumber = diagrams.length + 1;
	let name = `Diagram ${diagramNumber}`;
	while (names.has(name)) {
		diagramNumber++;
		name = `Diagram ${diagramNumber}`;
	}

	const diagram = parseDiagram({
		name,
		type,
		automaton: { states: 1, startState: 0 },
		states: { 0: { x: 0, y: 0, label: "0" } },
		transitions: {},
		startTransition: { angle: Math.PI, length: 75 }
	});

	diagrams.push(diagram);
	return diagram;
}
export function parseDiagram(diagram: DiagramData) {
	switch (diagram.type) {
		case "DFA": return new DeterministicFiniteAutomatonDiagram(diagram);
		case "NFA": return new NondeterministicFiniteAutomatonDiagram(diagram);
		case "TM": return new TuringMachineDiagram(diagram);
		default:
			throw Error("Invalid automaton type.");
	}
}
