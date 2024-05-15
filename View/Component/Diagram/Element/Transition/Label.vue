<script setup lang="ts">
	import { computed, ref } from "vue";
	import Element from "../Element.vue";
	import Text from "../Text.vue";

	const props = withDefaults(defineProps<{
		x: number;
		y: number;
		distance?: number;
		angle?: number;
		label: string;
	}>(), {
		distance: 10,
		angle: 0
	});

	const container = ref<typeof Element | null>(null);
	const labels = computed(() => props.label.split("\n"));
	const position = computed(() => {
		const { x, y, distance, angle } = props;
		if (!container.value) return { x, y };

		const [ width, height ] = [ container.value.$el.offsetWidth, container.value.$el.offsetHeight ];
		return {
			x: x + (distance + width / 2) * Math.cos(angle),
			y: y + (distance + height / 2) * Math.sin(angle)
		};
	});
</script>
<template>
	<Element v-bind="position" class="label" style="z-index: 2" ref="container">
		<Text v-for="label in labels" :x="0" :y="0" :value="label" />
	</Element>
</template>
