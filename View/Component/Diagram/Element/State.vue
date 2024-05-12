<script setup lang="ts">
	import { ref, onMounted, onUnmounted, computed } from "vue";
	import { useDrag } from "../../../Composable/Drag";
	import { Transform } from "../../../Composable/Transform";
	import Element from "./Element.vue";
	import Anchor from "./Anchor.vue";
	import StraightArrow from "./StraightArrow.vue";
	import Diagram from "../../../../Model/Diagram";

	const props = defineProps<{
		label: string;
		accept?: boolean;
		start?: { angle: number, length: number };
		diagram: Diagram;
		diagramTransform: Transform;
	}>();

	const x = defineModel<number>("x", { required: true });
	const y = defineModel<number>("y", { required: true });

	const { transform, mousedown } = useDrag({
		x,
		y,
		diagramTransform: props.diagramTransform
	});

	const radius = 50;

	const state = ref<HTMLDivElement | null>(null);
	const labelElement = ref<HTMLSpanElement | null>(null);
	const labelObservedWidth = ref(0);
	const labelResizeObserver = new ResizeObserver(() => {
		labelObservedWidth.value = labelElement.value?.clientWidth ?? 0;
	});
	const labelWidth = computed(() => {
		if (labelElement.value === null || labelObservedWidth.value === 0) return 0;
		const width = labelObservedWidth.value;
		const maxWidth = props.accept ? 60 : 80;
		return Math.min(1, maxWidth / width);
	});

	const anchor = ref<typeof Anchor | null>(null);
	const anchorPosition = computed(() => {
		if (!props.start) return { x: 0, y: 0 };
		return {
			x: (props.start.length + radius) * Math.cos(props.start.angle) + transform.x,
			y: (props.start.length + radius) * Math.sin(props.start.angle) + transform.y
		};
	});

	const arrowProperties = computed(() => {
		if (anchor.value === null) return props.start ?? { angle: 0, length: 0 };

		const [ x, y ] = anchor.value.transform.position;
		const [ sx, sy ] = transform.position;
		const [ dx, dy ] = [ x - sx, y - sy ];
		const angle = -Math.atan2(dx, dy) + Math.PI / 2;
		const length = Math.sqrt(dx ** 2 + dy ** 2) - radius;

		return { angle, length };
	});

	onMounted(() => {
		if (labelElement.value) {
			labelResizeObserver.observe(labelElement.value);
		}
	});
	onUnmounted(() => {
		labelResizeObserver.disconnect();
	});
</script>
<template>
	<Element v-bind="transform" style="z-index: 1">
		<div class="state grab" :class="{ accept }" @mousedown="mousedown" ref="state">
			<span class="label" ref="labelElement">{{ label }}</span>
		</div>
	</Element>
	<template v-if="start">
		<StraightArrow
			v-bind="{ ...transform, ...arrowProperties }"
			:offset="50"
		/>
		<Anchor
			v-bind="anchorPosition"
			:movementFilter="([ nx, ny ]: [number, number]): [number, number] => {
				const [ px, py ] = [ x, y ];

				// Snap to axis.
				const threshold = 10;
				if (Math.abs(nx - px) < threshold) nx = px;
				if (Math.abs(ny - py) < threshold) ny = py;

				// Force minimum length.
				const length = Math.sqrt((nx - px) ** 2 + (ny - py) ** 2) - radius;
				const minimumLength = 30;
				if (length < minimumLength) {
					const angle = Math.atan2(ny - py, nx - px);
					nx = (minimumLength + radius) * Math.cos(angle) + px;
					ny = (minimumLength + radius) * Math.sin(angle) + py;
				}

				return [ nx, ny ];
			}"
			:onRelease="() => props.diagram.startTransition = arrowProperties"
			:diagramTransform
			ref="anchor"
		/>
	</template>
</template>
<style scoped>
	.state {
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		aspect-ratio: 1;
		width: 100px;
		background-color: hsl(var(--background-color-hsl));
		border: 5px solid currentColor;
		border-radius: 100%;

		> .label {
			font-size: 50px;
			line-height: 90px;
			white-space: nowrap;
			scale: v-bind("labelWidth");
		}
	}
	.accept::after {
		position: absolute;
		display: block;
		content: "";
		margin: 10px;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		border-radius: 100%;
		border: 5px solid currentColor;
	}
</style>
