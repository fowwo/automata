<script setup lang="ts">
	import { ref } from "vue";
	import { Transform } from "../../Composable/Transform";
	import Diagram from "../../../Model/Diagram";
	import Modal from "../Modal.vue";

	defineProps<{
		diagram: Diagram;
		transform: Transform;
	}>();

	const automatonModal = ref<InstanceType<typeof Modal> | null>(null);
</script>
<template>
	<div class="interface">
		<div>
			<button id="edit-automaton" class="widget symbol large-shadow" @click="automatonModal?.open()">&#xF535;</button>
		</div>
		<div id="open-diagram-info" class="widget button toggle large-shadow">
			<input type="checkbox">
			<span class="symbol">&#xF535;</span>
			<span class="symbol">&#xE5CD;</span>
		</div>
		<div class="zoom">
			<span>{{ transform.scale.toFixed(2) }}</span>
			<button class="widget symbol large-shadow" @click="transform.zoomIn()">&#xE8FF;</button>
			<button class="widget symbol large-shadow" @click="transform.zoomOut()">&#xE900;</button>
		</div>
	</div>
	<Modal title="Automaton Settings" id="automaton-modal" ref="automatonModal">
		<nav class="small-inset-shadow">
			<ul>
				<li class="toggle large-shadow">
					<input type="radio" name="automaton-modal-nav" checked>
					<span>General</span>
				</li>
				<li class="toggle large-shadow">
					<input type="radio" name="automaton-modal-nav">
					<span>Alphabet</span>
				</li>
				<li class="toggle large-shadow">
					<input type="radio" name="automaton-modal-nav">
					<span>States</span>
				</li>
				<li class="toggle large-shadow">
					<input type="radio" name="automaton-modal-nav">
					<span>Transitions</span>
				</li>
			</ul>
		</nav>
		<div>
			<div id="general">
				<h1>General</h1>
				<hr>
				<div>
					<div>
						<label for="diagram-rename">Name</label>
					</div>
					<div>
						<input id="diagram-rename" type="text" class="small-inset-shadow">
					</div>
				</div>
			</div>
			<div id="alphabet">
				<h1>Alphabet</h1>
				<hr>
				<ul></ul>
			</div>
			<div id="states">
				<h1>States</h1>
				<table>
					<thead>
						<tr>
							<th title="Start State" class="symbol">&#xF6FE;</th>
							<th title="Final State" class="symbol">&#xF12E;</th>
							<th>Name</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
				<button id="new-state" class="symbol small-shadow">&#xE145;</button>
			</div>
			<div id="transitions">
				<h1>Transitions</h1>
				<div class="error">
					Your automaton must have symbols in the alphabet before creating transitions.
				</div>
				<table>
					<thead><tr></tr></thead>
					<tbody></tbody>
				</table>
			</div>
		</div>
	</Modal>
</template>
<style scoped>
	.interface {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: 2;
		pointer-events: none;
		--margin: 20px;

		> * {
			position: absolute;
			display: flex;
			gap: 5px;
		}
		button, .button {
			aspect-ratio: 1;
			height: 50px;
		}
		.widget {
			position: relative;
			background-color: hsl(var(--background-color-hsl) / 75%);
			border-radius: 10px;
			backdrop-filter: blur(8px);
			pointer-events: all;
		}
		#edit-automaton {
			top: var(--margin);
			left: var(--margin);
			font-size: 24px;
		}
		> #open-diagram-info {
			position: absolute;
			top: var(--margin);
			right: var(--margin);
			padding: 0;
			font-size: 24px;
			transition-property: right, background-color;
			transition-duration: var(--transition-duration);
			transition-timing-function: var(--transition-smooth);

			&:hover {
				font-size: 27px;
			}
			&:has(> input:checked) {
				right: -10px;
				background-color: hsl(var(--background-color-hsl));
			}
		}
		.zoom {
			margin: 0 var(--margin) var(--margin) 0;
			bottom: 0;
			right: 0;
			flex-direction: column;

			> button {
				font-size: 32px;

				&:not(:active):hover {
					font-size: 36px;
				}
			}
			> span {
				text-align: center;
				opacity: 50%;
			}
		}
	}
</style>
