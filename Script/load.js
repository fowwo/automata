import Element from "../Element/Element.js";
import Draggable from "../Element/Draggable.js";
import State from "../Element/State.js";
import Transition from "../Element/Transition.js";
import DFA from "../Model/DFA.js";
import Diagram from "../Model/Diagram.js";
import Anchor from "../Element/Anchor.js";

// const a = new State(0, -150, { label: "0", start: { angle: 3 * Math.PI / 2, length: 150 } });
// const b = new State(0, 0, { label: "a", start: { angle: Math.PI, length: 30 } });
// const c = new State(0, 150, { label: "AAA", final: true, start: { angle: 3 * Math.PI / 4, length: 75 } });
// const d = new State(150, 0, { label: "coins", final: true });

// const t1 = new Transition(a, b, "a", Math.PI / 4);
// const t2 = new Transition(b, c, "b", -Math.PI / 4);
// const t3 = new Transition(b, d, "c", -3 * Math.PI / 4);

// const a = new State(-300, -100, { label: "a", start: {} });
// const b = new State(100, -100, { label: "b", final: true });
// const c = new State(-100, 100, { label: "c" });
// const d = new State(300, 100, { label: "coins", final: true });

// const t1 = new Transition(a, b, "0", -Math.PI / 2);
// const t2 = new Transition(b, c, "x", Math.PI / 4);
// const t3 = new Transition(c, d, "[0,1]", Math.PI / 2);
// const t4 = new Transition(c, b, "y", Math.PI / 4);
// console.log(t1);

const m = [
	"dfa",
	"nfa",
	"pda",
	"tm",
	"dfa",
	"dfa",
	"dfa",
	"dfa",
	"dfa",
	"dfa",
	"dfa",
	"dfa",
	"dfa",
	"dfa",
	"dfa",
	"dfa",
	"dfa",
	"dfa",
	"dfa",
	"dfa"
];
// for (let i = 1; i <= 20; i++) {
// 	document.querySelector("#diagram-select ul").innerHTML +=
// 	`
// 	<li>
// 		<button class="diagram-option ${m[i - 1]}-icon">Diagram ${String(i).repeat(i)}</button>
// 		<button class="diagram-rename"></button>
// 		<button class="diagram-delete"></button>
// 	</li>
// 	`;
// }



const diagrams = [];

{
	const machine = {
		alphabet: [ "a", "b" ],
		stateCount: 3,
		transitions: [
			{ "a": 0, "b": 1 },
			{ "a": 1, "b": 2 },
			{ "a": 2, "b": 0 }
		],
		startState: 0,
		finalStates: [ 2 ]
	};
	const d = {
		name: "Diagram 1",
		type: "DFA",
		machine,
		elements: {
			startState: {},
			states: [
				{ label: 3, x: -50, y: 0 },
				{ label: "B", x: 50, y: -200 },
				{ label: "C", x: 150, y: 0 },
			],
			transitions: {
				2: {
					0: Math.PI / 4
				}
			}
		}
	};
	const diagram = new Diagram(d);
	diagrams.push(diagram);
}
{
	const machine = {
		alphabet: [ "a", "b" ],
		stateCount: 3,
		transitions: [
			{ "a": 1, "b": 0 },
			{ "a": 2, "b": 1 },
			{ "a": 1, "b": 2 }
		],
		startState: 0,
		finalStates: [ 2 ]
	};
	const d = {
		name: "Diagram 1",
		type: "DFA",
		machine,
		elements: {
			startState: {},
			states: [
				{ label: "A", x: -50, y: 0 },
				{ label: "B", x: 50, y: -200 },
				{ label: "C", x: 150, y: 0 },
			],
			transitions: {}
		}
	};
	const diagram = new Diagram(d);
	diagrams.push(diagram);
}
{
	const machine = {
		alphabet: [ "a", "b" ],
		stateCount: 6,
		transitions: [
			{ "ε": 1 },
			{ "a": 2, "b": 1 },
			{ "a": 2, "b": 3 },
			{ "a": 4, "b": 1 },
			{ "a": 4, "b": 4, "ε": 5 },
			{}
		],
		startState: 0,
		finalStates: [ 5 ]
	};
	const d = {
		name: "Diagram 1",
		type: "DFA",
		machine,
		elements: {
			startState: {},
			states: [
				{ label: "start", x: -500, y: 0 },
				{ label: "0", x: -300, y: 0 },
				{ label: "1", x: -100, y: 0 },
				{ label: "2", x: 100, y: 0 },
				{ label: "3", x: 300, y: 0 },
				{ label: "final", x: 500, y: 0 },
			],
			transitions: {
				1: {
					1: Math.PI / 2
				},
				2: {
					2: Math.PI / 2
				},
				3: {
					1: Math.PI / 4
				}
			}
		}
	};
	const diagram = new Diagram(d);
	diagrams.push(diagram);
}
{
	const machine = {
		alphabet: [ "a", "b" ],
		stateCount: 4,
		transitions: [
			{ "ε": 2 },
			{ "b": 2 },
			{ "a": 3, "b": 2 },
			{}
		],
		startState: 3,
		finalStates: []
	};
	const d = {
		name: "Diagram 1",
		type: "DFA",
		machine,
		elements: {
			startState: {},
			states: [
				{ label: "start", x: -200, y: -100 },
				{ label: "2", x: -200, y: 100 },
				{ label: "0", x: 0, y: 0 },
				{ label: "1", x: 200, y: 0 },
			],
			transitions: {}
		}
	};
	const diagram = new Diagram(d);
	diagrams.push(diagram);
}
{
	const machine = {
		alphabet: [ "a", "b" ],
		stateCount: 3,
		transitions: [
			{ "b*a": 2 },
			{ "bb*a": 2 },
			{}
		],
		startState: 3,
		finalStates: []
	};
	const d = {
		name: "Diagram 1",
		type: "DFA",
		machine,
		elements: {
			startState: {},
			states: [
				{ label: "start", x: -200, y: -100 },
				{ label: "2", x: -200, y: 100 },
				{ label: "1", x: 200, y: 0 },
			],
			transitions: {}
		}
	};
	const diagram = new Diagram(d);
	diagrams.push(diagram);
}
{
	const machine = {
		alphabet: [ "a", "b" ],
		stateCount: 6,
		transitions: [
			{ "b*a": 2 },
			{},
			{ "a": 2, "b": 3 },
			{ "a": 4, "bb*a": 2 },
			{ "a": 4, "b": 4, "ε": 5 },
			{}
		],
		startState: 0,
		finalStates: [ 5 ]
	};
	const d = {
		name: "Diagram 1",
		type: "DFA",
		machine,
		elements: {
			startState: {},
			states: [
				{ label: "start", x: -500, y: 0 },
				{ label: "0", x: -300, y: 100 },
				{ label: "1", x: -100, y: 0 },
				{ label: "2", x: 100, y: 0 },
				{ label: "3", x: 300, y: 0 },
				{ label: "final", x: 500, y: 0 },
			],
			transitions: {
				1: {
					1: Math.PI / 2
				},
				2: {
					2: Math.PI / 2
				},
				3: {
					2: 3 * Math.PI / 8
				}
			}
		}
	};
	const diagram = new Diagram(d);
	diagrams.push(diagram);
}
{
	const machine = {
		alphabet: [ "a", "b" ],
		stateCount: 6,
		transitions: [
			{ "b*a": 2 },
			{},
			{ "a": 2, "b": 3 },
			{ "a": 4, "bb*a": 2 },
			{ "a": 4, "b": 4, "ε": 5 },
			{}
		],
		startState: 0,
		finalStates: [ 5 ]
	};
	const d = {
		name: "Diagram 1",
		type: "DFA",
		machine,
		elements: {
			startState: {},
			states: [
				{ label: "start", x: -500, y: 0 },
				{ label: "0", x: -300, y: 100 },
				{ label: "1", x: -100, y: 0 },
				{ label: "2", x: 100, y: 0 },
				{ label: "3", x: 300, y: 0 },
				{ label: "final", x: 500, y: 0 },
			],
			transitions: {
				1: {
					1: Math.PI / 2
				},
				2: {
					2: Math.PI / 2
				},
				3: {
					2: 3 * Math.PI / 8
				}
			}
		}
	};
	const diagram = new Diagram(d);
	diagrams.push(diagram);
}
diagrams[0].load();

{
	const { type, name, states, transitions } = {
		type: "DFA",
		name: "AOC",
		states: [{'x': 645.4144900333453, 'y': 763.8325314196802, 'label': '&bb'}, {'x': -792.9337075600822, 'y': 609.3079151094477, 'label': '%br'}, {'x': -147.4428607218496, 'y': 989.070575248378, 'label': 'broadcaster'}, {'x': -863.4310738670821, 'y': 504.46682812721934, 'label': '%bv'}, {'x': -598.3305732831166, 'y': -801.2493526204543, 'label': '%cr'}, {'x': -999.3392340533223, 'y': -36.3468744422275, 'label': '&dh'}, {'x': -967.384911224625, 'y': 253.3109423908184, 'label': '%dm'}, {'x': 644.7810680023557, 'y': 764.3673032945231, 'label': '&dp'}, {'x': -797.4232042125769, 'y': -603.4204449497438, 'label': '&dt'}, {'x': -457.271290365978, 'y': -889.3272552930296, 'label': '%dv'}, {'x': -974.1548413160003, 'y': 225.88126336772171, 'label': '%dz'}, {'x': -862.8776992349921, 'y': -505.4127779972788, 'label': '%fd'}, {'x': 812.2090139095608, 'y': 583.3665380565283, 'label': '%fh'}, {'x': -898.4829313588508, 'y': 439.00845328627395, 'label': '%fp'}, {'x': -273.61967316657973, 'y': -961.8379668406806, 'label': '%gf'}, {'x': -424.69130825015185, 'y': -905.3382200574405, 'label': '&gr'}, {'x': 155.7372407959115, 'y': -987.7985178310788, 'label': '%hd'}, {'x': 346.035135536597, 'y': 938.2215543112239, 'label': '%hm'}, {'x': -890.5402054653966, 'y': -454.9045421290593, 'label': '%jl'}, {'x': -752.5267186684038, 'y': -658.5617189680594, 'label': '%kc'}, {'x': 625.2676054761644, 'y': 780.4104186529698, 'label': '%kj'}, {'x': -576.0680899235406, 'y': 817.401710159603, 'label': '%kq'}, {'x': -823.6601843434132, 'y': -567.0836805334593, 'label': '%ks'}, {'x': -243.94648035239496, 'y': 969.788695914568, 'label': '%kt'}, {'x': 985.9861140546117, 'y': -166.8274044978411, 'label': '%lc'}, {'x': -54.11893969654787, 'y': -998.534496332561, 'label': '%mg'}, {'x': -996.4459346671306, 'y': 84.23478667004782, 'label': '%mx'}, {'x': 577.2969613932063, 'y': 816.5342726218972, 'label': '%nd'}, {'x': 699.0257700545317, 'y': -715.0964779662035, 'label': '%nf'}, {'x': 40.78791597397531, 'y': -999.1678266990485, 'label': '%np'}, {'x': 124.01567926709707, 'y': 992.2802584431076, 'label': '%nx'}, {'x': -344.143851334382, 'y': 938.9169343391026, 'label': '%pc'}, {'x': -906.204231742187, 'y': -422.84026578904775, 'label': '%ph'}, {'x': -999.5439054311137, 'y': 30.19902507560116, 'label': '%ps'}, {'x': 995.7637089901318, 'y': -91.94909384119097, 'label': '%qb'}, {'x': -987.3285211363565, 'y': -158.68960693975885, 'label': '%qc'}, {'x': -615.5772877689973, 'y': 788.0765208930953, 'label': '&qd'}, {'x': -930.1594323520616, 'y': -367.15586663771387, 'label': '%qf'}, {'x': 142.38116223563742, 'y': -989.811903666767, 'label': '%qg'}, {'x': -228.91040030532187, 'y': 973.4474965975603, 'label': '%qj'}, {'x': -545.7740500767144, 'y': -837.932387644051, 'label': '%qn'}, {'x': 641.9338672551302, 'y': 766.760008132188, 'label': '&rm'}, {'x': -483.5748682160345, 'y': 875.3030028680611, 'label': '%rn'}, {'x': 982.0643485404149, 'y': 188.5460562459223, 'label': 'rx'}, {'x': -305.4687577754284, 'y': -952.202099358711, 'label': '%sq'}, {'x': -133.95651331593942, 'y': -990.9872110881333, 'label': '%sr'}, {'x': -754.8551152451801, 'y': -655.8915725851232, 'label': '%sv'}, {'x': 969.0823927623181, 'y': -246.73734220433704, 'label': '%tb'}, {'x': 966.3543756304939, 'y': -257.2143477720447, 'label': '%tg'}, {'x': 47.97640372080091, 'y': -998.8484693315693, 'label': '%tq'}, {'x': 998.0797459330497, 'y': -61.94207583072298, 'label': '%vd'}, {'x': 936.421108390957, 'y': 350.87819504758585, 'label': '%vh'}, {'x': 919.5772337626213, 'y': -392.9092912435203, 'label': '%vr'}, {'x': -280.49295639918284, 'y': -959.8560836971583, 'label': '&vt'}, {'x': -644.7175743011925, 'y': 764.4208588122033, 'label': '%xd'}, {'x': -341.53708354317394, 'y': 939.8682995850127, 'label': '%xg'}, {'x': -589.6890005873896, 'y': -807.6304121231726, 'label': '&xm'}, {'x': -40.769852237374344, 'y': 999.1685639313032, 'label': '%xr'}, {'x': -999.9871101920215, 'y': -5.077346729318859, 'label': '%zz'}],
		transitions: [{'from': 0, 'to': 41, 'label': ''}, {'from': 1, 'to': 23, 'label': ''}, {'from': 2, 'to': 29, 'label': ''}, {'from': 2, 'to': 25, 'label': ''}, {'from': 2, 'to': 50, 'label': ''}, {'from': 2, 'to': 57, 'label': ''}, {'from': 3, 'to': 13, 'label': ''}, {'from': 3, 'to': 56, 'label': ''}, {'from': 4, 'to': 21, 'label': ''}, {'from': 4, 'to': 8, 'label': ''}, {'from': 5, 'to': 41, 'label': ''}, {'from': 6, 'to': 28, 'label': ''}, {'from': 6, 'to': 15, 'label': ''}, {'from': 7, 'to': 41, 'label': ''}, {'from': 8, 'to': 50, 'label': ''}, {'from': 8, 'to': 9, 'label': ''}, {'from': 8, 'to': 5, 'label': ''}, {'from': 8, 'to': 17, 'label': ''}, {'from': 8, 'to': 22, 'label': ''}, {'from': 8, 'to': 16, 'label': ''}, {'from': 8, 'to': 21, 'label': ''}, {'from': 9, 'to': 17, 'label': ''}, {'from': 10, 'to': 15, 'label': ''}, {'from': 10, 'to': 11, 'label': ''}, {'from': 11, 'to': 26, 'label': ''}, {'from': 12, 'to': 6, 'label': ''}, {'from': 12, 'to': 15, 'label': ''}, {'from': 13, 'to': 38, 'label': ''}, {'from': 13, 'to': 56, 'label': ''}, {'from': 14, 'to': 8, 'label': ''}, {'from': 14, 'to': 34, 'label': ''}, {'from': 15, 'to': 7, 'label': ''}, {'from': 15, 'to': 25, 'label': ''}, {'from': 15, 'to': 11, 'label': ''}, {'from': 15, 'to': 40, 'label': ''}, {'from': 16, 'to': 33, 'label': ''}, {'from': 17, 'to': 4, 'label': ''}, {'from': 18, 'to': 53, 'label': ''}, {'from': 18, 'to': 47, 'label': ''}, {'from': 19, 'to': 8, 'label': ''}, {'from': 19, 'to': 14, 'label': ''}, {'from': 20, 'to': 51, 'label': ''}, {'from': 21, 'to': 16, 'label': ''}, {'from': 22, 'to': 37, 'label': ''}, {'from': 23, 'to': 18, 'label': ''}, {'from': 24, 'to': 56, 'label': ''}, {'from': 25, 'to': 10, 'label': ''}, {'from': 25, 'to': 15, 'label': ''}, {'from': 26, 'to': 15, 'label': ''}, {'from': 26, 'to': 54, 'label': ''}, {'from': 27, 'to': 1, 'label': ''}, {'from': 28, 'to': 15, 'label': ''}, {'from': 29, 'to': 56, 'label': ''}, {'from': 29, 'to': 32, 'label': ''}, {'from': 30, 'to': 52, 'label': ''}, {'from': 30, 'to': 53, 'label': ''}, {'from': 31, 'to': 49, 'label': ''}, {'from': 31, 'to': 15, 'label': ''}, {'from': 32, 'to': 58, 'label': ''}, {'from': 33, 'to': 19, 'label': ''}, {'from': 33, 'to': 8, 'label': ''}, {'from': 34, 'to': 8, 'label': ''}, {'from': 35, 'to': 27, 'label': ''}, {'from': 36, 'to': 41, 'label': ''}, {'from': 37, 'to': 8, 'label': ''}, {'from': 37, 'to': 9, 'label': ''}, {'from': 38, 'to': 56, 'label': ''}, {'from': 38, 'to': 39, 'label': ''}, {'from': 39, 'to': 24, 'label': ''}, {'from': 39, 'to': 56, 'label': ''}, {'from': 40, 'to': 31, 'label': ''}, {'from': 41, 'to': 43, 'label': ''}, {'from': 42, 'to': 53, 'label': ''}, {'from': 42, 'to': 35, 'label': ''}, {'from': 44, 'to': 20, 'label': ''}, {'from': 45, 'to': 53, 'label': ''}, {'from': 46, 'to': 3, 'label': ''}, {'from': 47, 'to': 30, 'label': ''}, {'from': 48, 'to': 45, 'label': ''}, {'from': 48, 'to': 53, 'label': ''}, {'from': 49, 'to': 15, 'label': ''}, {'from': 49, 'to': 12, 'label': ''}, {'from': 50, 'to': 8, 'label': ''}, {'from': 50, 'to': 22, 'label': ''}, {'from': 51, 'to': 56, 'label': ''}, {'from': 51, 'to': 46, 'label': ''}, {'from': 52, 'to': 48, 'label': ''}, {'from': 52, 'to': 53, 'label': ''}, {'from': 53, 'to': 0, 'label': ''}, {'from': 53, 'to': 27, 'label': ''}, {'from': 53, 'to': 35, 'label': ''}, {'from': 53, 'to': 57, 'label': ''}, {'from': 53, 'to': 1, 'label': ''}, {'from': 53, 'to': 47, 'label': ''}, {'from': 53, 'to': 23, 'label': ''}, {'from': 54, 'to': 55, 'label': ''}, {'from': 54, 'to': 15, 'label': ''}, {'from': 55, 'to': 15, 'label': ''}, {'from': 55, 'to': 40, 'label': ''}, {'from': 56, 'to': 58, 'label': ''}, {'from': 56, 'to': 46, 'label': ''}, {'from': 56, 'to': 44, 'label': ''}, {'from': 56, 'to': 32, 'label': ''}, {'from': 56, 'to': 20, 'label': ''}, {'from': 56, 'to': 29, 'label': ''}, {'from': 56, 'to': 36, 'label': ''}, {'from': 57, 'to': 53, 'label': ''}, {'from': 57, 'to': 42, 'label': ''}, {'from': 58, 'to': 44, 'label': ''}]
	}
	// diagrams.push(new Diagram(type, name, states, transitions));
}
// setInterval(() => {
// 	diagrams[0].load();
// 	setTimeout(() => {
// 		diagrams[1].load();
// 	}, 20);
// }, 40);

// const diagram = document.getElementById("workspace");
// diagram.onclick = (event) => {
// 	// const [ x, y ] = windowToDiagramPosition(event.clientX, event.clientY);
// 	// new State(x, y);
// };
// function windowToDiagramPosition(x, y) {
// 	const scale = parseFloat(diagram.style.getPropertyValue("--scale"));
// 	const [ px, py ] = [ diagram.style.getPropertyValue("--px"), diagram.style.getPropertyValue("--py") ].map(x => parseFloat(x));
// 	const [ wx, wy ] = [ x - window.innerWidth / 2, y - window.innerHeight / 2 ].map(x => x / scale);
// 	return [ wx - px, wy - py ];
// }
