<script setup lang="ts">
	import { computed } from "vue";
	import Element from "./Element.vue";

	const props = withDefaults(defineProps<{
		x: number;
		y: number;
		length?: number;
		headLength?: number;
		angle?: number;
		offset?: number;
	}>(), {
		length: 75,
		headLength: 15 * Math.SQRT2,
		angle: 0,
		offset: 0
	});

	const n = computed(() => props.headLength / Math.SQRT2);
</script>
<template>
	<Element :x :y class="straight-arrow">
		<svg :width="1" :height="1" viewBox="-0.5 -0.5 1 1">
			<line :x1="length + offset" :x2="offset" :y1="0" :y2="0" />
			<line :x1="n + offset" :x2="offset" :y1="-n" :y2="0" />
			<line :x1="n + offset" :x2="offset" :y1="n" :y2="0" />
		</svg>
	</Element>
</template>
<style scoped>
	.straight-arrow {
		rotate: calc(v-bind("angle") * 1rad);
	}
</style>
