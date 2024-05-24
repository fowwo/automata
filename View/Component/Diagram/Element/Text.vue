<script setup lang="ts">
	import Element from "./Element.vue";
	
	defineProps<{
		x: number;
		y: number;
		value: string;
	}>();
</script>
<template>
	<Element :x :y class="text">
		<span ref="span">{{ value }}</span>
	</Element>
</template>
<style scoped>
	.text {
		font-size: 1.75em;
		line-height: 1;
		text-align: center;
		text-shadow:
			-1px -1px 0px hsl(var(--background-color-hsl)),
			-1px 1px 0px hsl(var(--background-color-hsl)),
			1px -1px 0px hsl(var(--background-color-hsl)),
			1px 1px 0px hsl(var(--background-color-hsl));
		z-index: 2;
	}
</style>
