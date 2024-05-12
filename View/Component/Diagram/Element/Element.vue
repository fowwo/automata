<script setup lang="ts">
	defineProps<{
		x: number;
		y: number;
	}>();
</script>
<template>
	<div class="element">
		<slot></slot>
	</div>
</template>
<style scoped>
	.element {
		position: absolute;
		top: 50%;
		left: 50%;
		translate:
			calc(var(--scale, 1) * calc(var(--px, 0) + v-bind("x")) * 1px - 50%)
			calc(var(--scale, 1) * calc(var(--py, 0) + v-bind("y")) * 1px - 50%);
		scale: var(--scale, 1);
	}
	:deep(.grab) { cursor: grab; }
	:deep(.grab:active) { cursor: grabbing; }
</style>
