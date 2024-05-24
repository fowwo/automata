<script setup lang="ts">
	import { useDrag } from "../../../Composable/Drag";
	import { Transform } from "../../../Composable/Transform";
	import Element from "./Element.vue";

	const props = defineProps<{
		movementFilter?: (position: [number, number]) => [number, number];
		onRelease?: (x: number, y: number) => void;
		diagramTransform: Transform;
	}>();

	const x = defineModel<number>("x", { required: true });
	const y = defineModel<number>("y", { required: true });

	const { transform, mousedown } = useDrag({
		x,
		y,
		movementFilter: props.movementFilter,
		onRelease: props.onRelease,
		diagramTransform: props.diagramTransform
	});

	defineExpose({ transform });
</script>
<template>
	<Element v-bind="transform" style="z-index: 3">
		<div class="anchor grab" @mousedown="mousedown"></div>
	</Element>
</template>
<style scoped>
	.anchor {
		aspect-ratio: 1;
		width: 30px;
		background-color: #f008;
		border-radius: 100%;

		&:hover { background-color: gold; }
		&:active { background-color: cyan; }
	}
</style>
