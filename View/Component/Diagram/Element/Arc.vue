<script setup lang="ts">
	import Element from "./Element.vue";

	defineProps<{
		x: number;
		y: number;
		x1: number;
		y1: number;
		x2: number;
		y2: number;
		r: number;
		large: boolean;
		flip: boolean;
	}>();
</script>
<template>
	<Element :x :y>
		<svg :width="1" :height="1" viewBox="-0.5 -0.5 1 1">
			<path :d="`M ${x1} ${y1} A ${r} ${r} 0 ${large ? 1 : 0} ${flip ? 1 : 0} ${x2} ${y2}`" />
		</svg>
	</Element>
</template>
