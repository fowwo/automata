<script setup lang="ts">
	import { Transform } from "../../Composable/Transform";
	import Diagram from "../../../Model/Diagram";

	defineProps<{
		diagram: Diagram;
		transform: Transform;
	}>();
</script>
<template>
	<div class="interface">
		<div class="zoom">
			<span>{{ transform.scale.toFixed(2) }}</span>
			<button class="widget symbol large-shadow" @click="transform.zoomIn()">&#xE8FF;</button>
			<button class="widget symbol large-shadow" @click="transform.zoomOut()">&#xE900;</button>
		</div>
	</div>
</template>
<style scoped>
	.interface {
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
