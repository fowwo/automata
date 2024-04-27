<script setup lang="ts">
	import { ref } from "vue";
	import { diagram, diagrams } from "../../State/Diagram";
	import Modal from "../Modal.vue";
	import DiagramIcon from "../Diagram/Icon.vue";
	import Diagram from "../../../Model/Diagram";
	import DiagramData from "../../../Type/DiagramData";

	defineExpose({
		open: () => modal.value?.open(),
		close: () => modal.value?.close()
	});

	const modal = ref<InstanceType<typeof Modal> | null>(null);

	function createDiagram(type: DiagramData["type"]) {

		// Create a unique name.
		const names = new Set(diagrams.map(diagram => diagram.name));
		let diagramNumber = diagrams.length + 1;
		let name = `Diagram ${diagramNumber}`;
		while (names.has(name)) {
			diagramNumber++;
			name = `Diagram ${diagramNumber}`;
		}

		const newDiagram = new Diagram({
			name,
			type,
			automaton: { states: 1, startState: 1 },
			states: { 0: { x: 0, y: 0, label: "0" } },
			transitions: {},
			startTransition: { angle: Math.PI, length: 75 }
		});
		diagrams.push(newDiagram);
		diagram.value = newDiagram;
		modal.value?.close();
	}
</script>
<template>
	<Modal title="New Automaton" :class="$style['new-automaton-modal']" ref="modal">
		<hr>
		<div>
			<div>
				<span class="symbol">&#xEF4A;</span>
				<span class="symbol">&#xE941;</span>
				<span class="symbol">&#xE86B;</span>
				<span class="symbol">&#xE941;</span>
				<span class="symbol">&#xEB36;</span>
				<span class="symbol">&#xE941;</span>
				<span class="symbol">&#xEB50;</span>
				<span class="symbol">&#xE941;</span>
				<span class="symbol">&#xEB39;</span>
			</div>
			<div>more edges = higher computational power</div>
		</div>
		<hr>
		<button @click="createDiagram('DFA')">
			<DiagramIcon type="DFA" />
			<div>
				<span>Deterministic Finite Automaton</span>
				<span>DFA</span>
			</div>
		</button>
		<button @click="createDiagram('NFA')">
			<DiagramIcon type="NFA" />
			<div>
				<span>Nondeterministic Finite Automaton</span>
				<span>NFA</span>
			</div>
		</button>
		<button disabled>
			<DiagramIcon type="DPDA" />
			<div>
				<span>Deterministic Pushdown Automaton</span>
				<span>DPDA</span>
			</div>
		</button>
		<button disabled>
			<DiagramIcon type="PDA" />
			<div>
				<span>Pushdown Automaton</span>
				<span>PDA</span>
			</div>
		</button>
		<button disabled>
			<DiagramIcon type="LBA" />
			<div>
				<span>Linear Bounded Automaton</span>
				<span>LBA</span>
			</div>
		</button>
		<button @click="createDiagram('TM')">
			<DiagramIcon type="TM" />
			<div>
				<span>Turing Machine</span>
				<span>TM</span>
			</div>
		</button>
		<button disabled>
			<DiagramIcon type="NTM" />
			<div>
				<span>Nondeterministic Turing Machine</span>
				<span>NTM</span>
			</div>
		</button>
	</Modal>
</template>
<style module>
	.new-automaton-modal > div > div {
		padding: 15px 20px;

		> div {
			text-align: center;

			> div:first-child {
				font-size: 1.25em;
			}
			> div:last-child {
				color: hsl(var(--text-color-hsl) / 35%);
				font-size: 0.75em;
			}
		}
		> button {
			display: flex;
			width: 100%;
			height: 50px;

			> span {
				display: flex;
				margin-right: 0.25em;
				align-items: center;
				height: 100%;
				font-size: 2em;

				button:disabled > & {
					color: hsl(var(--text-color-hsl) / 10%);
				}
			}
			> div {
				display: flex;
				flex-direction: column;
				justify-content: center;
				height: 100%;
				min-width: 0;

				> span {
					line-height: 20px;
					text-align: left;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;

					&:last-child {
						opacity: 50%;
					}
				}
			}
		}
	}
</style>
