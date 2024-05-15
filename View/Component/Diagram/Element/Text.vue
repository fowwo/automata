<script setup lang="ts">
	import { ref } from "vue";
	import Element from "./Element.vue";
	
	defineProps<{
		x: number;
		y: number;
		value: string;
	}>();

	const span = ref<HTMLSpanElement | null>(null);

	defineExpose({ span });
</script>
<template>
	<Element :x :y class="text">
		<span ref="span">{{ value }}</span>
	</Element>
</template>
<style scoped>
	.text {
		font-size: 32px;
		text-shadow:
			-1px -1px 0px hsl(var(--background-color-hsl)),
			-1px 1px 0px hsl(var(--background-color-hsl)),
			1px -1px 0px hsl(var(--background-color-hsl)),
			1px 1px 0px hsl(var(--background-color-hsl));
		z-index: 2;
	}
</style>
