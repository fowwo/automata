import { reactive, ref } from "vue";
import Diagram from "../../Model/Diagram";
import DiagramData from "../../Type/DiagramData";

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
			finalStates: [ 1 ],
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
export const diagrams = reactive(rawDiagrams.map(x => new Diagram(x)));
export const diagram = ref<Diagram>(diagrams[0]); // TODO: Store last opened diagram.
