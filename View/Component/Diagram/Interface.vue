<script setup lang="ts">
	import { ref } from "vue";
	import { Transform } from "../../Composable/Transform";
	import Diagram from "../../../Model/Diagram";
	import DiagramSettings from "../Modal/DiagramSettings.vue";

	defineProps<{
		diagram: Diagram;
		transform: Transform;
	}>();

	const diagramModal = ref<InstanceType<typeof DiagramSettings> | null>(null);
</script>
<template>
	<div class="interface">
		<div>
			<button id="edit-automaton" class="widget symbol large-shadow" @click="diagramModal?.open()">&#xF535;</button>
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
	<DiagramSettings :diagram ref="diagramModal" />
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
