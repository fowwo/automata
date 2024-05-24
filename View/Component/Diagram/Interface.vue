<script setup lang="ts">
	import { ref } from "vue";
	import { Transform } from "../../Composable/Transform";
	import Diagram from "../../../Model/Diagram";
	import DiagramSettings from "../Modal/DiagramSettings.vue";
	import DiagramIcon from "./Icon.vue";

	defineProps<{
		diagram: Diagram;
		transform: Transform;
	}>();

	const diagramModal = ref<InstanceType<typeof DiagramSettings> | null>(null);
</script>
<template>
	<div class="interface">
		<div class="diagram-info">
			<button id="edit-automaton" class="widget symbol small-shadow" @click="diagramModal?.open()">&#xF535;</button>
			<DiagramIcon :type="diagram.type" />
			<span>{{ diagram.name }}</span>
		</div>
		<div id="open-diagram-info" class="widget button toggle small-shadow">
			<input type="checkbox">
			<span class="symbol">&#xF535;</span>
			<span class="symbol">&#xE5CD;</span>
		</div>
		<div class="zoom">
			<span>{{ transform.scale.toFixed(2) }}</span>
			<button class="widget symbol small-shadow" @click="transform.zoomIn()">&#xE8FF;</button>
			<button class="widget symbol small-shadow" @click="transform.zoomOut()">&#xE900;</button>
		</div>
	</div>
	<DiagramSettings :diagram :transform ref="diagramModal" />
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
		> .diagram-info {
			top: var(--margin);
			left: var(--margin);
			align-items: center;
			font-size: 24px;

			> button {
				margin-right: 5px;
			}
		}
		> #open-diagram-info {
			position: absolute;
			top: var(--margin);
			right: var(--margin);
			padding: 0;
			font-size: 24px;
			transition: right var(--transition-duration) var(--transition-smooth);

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
