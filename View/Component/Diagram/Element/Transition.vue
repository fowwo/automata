<script setup lang="ts">
	import { computed, ref } from "vue";
	import { Transform } from "../../../Composable/Transform";
	import Anchor from "./Anchor.vue";
	import Arc from "./Arc.vue";
	import State from "./State.vue";
	import StraightArrow from "./StraightArrow.vue";
	import Text from "./Text.vue";
	import Diagram from "../../../../Model/Diagram";

	const props = withDefaults(defineProps<{
		from?: typeof State;
		to?: typeof State;
		label?: string;
		angle?: number;
		diagram: Diagram;
		diagramTransform: Transform;
	}>(), {
		angle: 0
	});

	defineEmits<{ anchorMove: [angle: number] }>();

	const anchor = ref<typeof Anchor | null>(null);
	const arrow = ref<typeof StraightArrow | null>(null);
	const text = ref<typeof Text | null>(null);

	const stateRadius = 50;
	const loopDistance = 50;

	const midpoint = computed(() => {
		if (!props.from || !props.to) return { x: 0, y: 0 };
		return {
			x: props.from.transform.x / 2 + props.to.transform.x / 2,
			y: props.from.transform.y / 2 + props.to.transform.y / 2,
		}
	});

	const anchorPosition = computed(() => {
		if (!props.from || !props.to) return { x: 0, y: 0 };

		const { x: cx, y: cy } = midpoint.value;
		if (props.from === props.to) {
			const distance = stateRadius + loopDistance;
			return {
				x: cx + distance * Math.cos(props.angle),
				y: cy + distance * Math.sin(props.angle)
			};
		}
		if (props.angle === 0) return { x: cx, y: cy };

		const [ ax, ay ] = props.from.transform.position;
		const [ bx, by ] = props.to.transform.position;
		const [ dx, dy ] = [ bx - ax, by - ay ];

		const r = calculateRadius(props.angle);
		const t = Math.atan2(dy, dx);

		const m = r - r * Math.cos(props.angle) + stateRadius * Math.sin(props.angle);
		return { x: cx - m * Math.sin(t), y: cy + m * Math.cos(t) };
	});

	const arcProperties = computed(() => {
		if (!props.from || !props.to) {
			return {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
				r: 0,
				large: false,
				flip: false
			};
		}
		if (props.from === props.to) {
			const angle = 2 * Math.atan2(stateRadius + loopDistance, stateRadius);
			const r = -stateRadius * Math.cos(angle) / Math.sin(angle);
			const [ x, y ] = [ stateRadius * Math.cos(angle), stateRadius * Math.sin(angle) ];

			return {
				x1: x,
				y1: y,
				x2: -x,
				y2: y,
				r,
				large: true,
				flip: false
			};
		}

		const [ ax, ay ] = (props.from.transform as Transform).position;
		const [ bx, by ] = (props.to.transform as Transform).position;
		const [ rx, ry ] = [ (bx - ax) / 2, (by - ay) / 2 ];

		const angle = calculateAngle();
		const r = calculateRadius(angle);
		const t = Math.atan2(ry, rx);

		const [ x1, y1 ] = [ -rx + stateRadius * Math.cos(angle + t), -ry + stateRadius * Math.sin(angle + t) ];
		const [ x2, y2 ] = [ rx - stateRadius * Math.cos(angle - t), ry + stateRadius * Math.sin(angle - t) ];

		const large = Math.abs(angle) > Math.PI / 2;
		const flip = angle < 0;

		return {
			x1,
			y1,
			x2,
			y2,
			r,
			large,
			flip
		};
	});

	const arcRotate = computed(() => {
		if (!props.from || !props.to || props.from !== props.to) return 0;

		const angle = calculateAngle();
		return angle - Math.PI / 2;
	});

	const arrowHeadAngle = computed(() => {
		if (!props.from || !props.to) return 0;
		if (props.from === props.to) {
			const angle = 2 * Math.atan2(stateRadius + loopDistance, stateRadius);
			const rotate = calculateAngle();
			return rotate - angle + Math.PI / 2;
		}

		const [ ax, ay ] = (props.from.transform as Transform).position;
		const [ bx, by ] = (props.to.transform as Transform).position;
		const [ rx, ry ] = [ (bx - ax) / 2, (by - ay) / 2 ];

		const t = Math.atan2(ry, rx);
		const angle = calculateAngle();
		return Math.PI - angle + t;
	});

	const labelPosition = computed(() => {
		if (!props.from || !props.to || !anchor.value || !text.value) return midpoint.value;

		const [ ax, ay ] = props.from.transform.position;
		const [ bx, by ] = props.to.transform.position;
		const { x: cx, y: cy } = midpoint.value;
		const [ dx, dy ] = [ bx - ax, by - ay ];
		const [ x, y ] = anchor.value.transform.position;

		const [ width, height ] = [ text.value.span.offsetWidth, text.value.span.offsetHeight ];

		const distance = 10;

		if (props.from === props.to) {
			const angle = calculateAngle();
			return {
				x: x + (distance + width / 2) * Math.cos(angle),
				y: y + (distance + height / 2) * Math.sin(angle)
			};
		}

		const t = Math.atan2(dy, dx);
		const a = Math.atan2(y - cy, x - cx);
		const p = t + Math.PI / 2;
		const [ ox, oy ] = [
			(distance + width / 2) * Math.cos(p),
			(distance + height / 2) * Math.sin(p)
		];
		const angle = calculateAngle();
		const flip = angle === 0 ? (0 <= p && p <= Math.PI) : ((t - a + 2 * Math.PI) % (2 * Math.PI) < Math.PI);
		return flip ? { x: x - ox, y: y - oy } : { x: x + ox, y: y + oy };
	});

	function calculateAngle() {
		if (!props.from || !props.to || !anchor.value) return 0;

		const [ x, y ] = anchor.value.transform.position;
		const [ ax, ay ] = props.from.transform.position;
		const [ bx, by ] = props.to.transform.position;
		const { x: cx, y: cy } = midpoint.value;
		const [ dx, dy ] = [ bx - ax, by - ay ];

		if (props.from.transform === props.to.transform) {
			return Math.atan2(y - cy, x - cx);
		}

		const m = Math.sqrt((cx - x) ** 2 + (cy - y) ** 2);
		const r = Math.sqrt(dx ** 2 + dy ** 2) / 2;
		const t = Math.atan2(dy, dx);
		const a = Math.atan2(y - cy, x - cx);

		const angle = 2 * Math.atan2(m, r + stateRadius);
		const flip = (t - a + 2 * Math.PI) % (2 * Math.PI) < Math.PI;
		return flip ? -angle : angle;
	}
	function calculateRadius(angle: number) {
		if (!props.from || !props.to || angle === 0) return 0;

		const [ ax, ay ] = props.from.transform.position;
		const [ bx, by ] = props.to.transform.position;
		const [ rx, ry ] = [ (bx - ax) / 2, (by - ay) / 2 ];

		return (Math.sqrt(rx ** 2 + ry ** 2) - stateRadius * Math.cos(angle)) / Math.sin(angle);
	}
</script>
<template>
	<Arc v-bind="{ ...midpoint, ...arcProperties}" class="arc" />
	<StraightArrow v-if="to" ref="arrow"
		:x="to.transform.x"
		:y="to.transform.y"
		:length="0"
		:offset="50"
		:angle="arrowHeadAngle"
	/>
	<Anchor v-bind="anchorPosition" ref="anchor"
		:diagramTransform
		:movementFilter="([ x, y ]) => {
			if (!props.from || !props.to) return [ 0, 0 ];

			const [ ax, ay ] = props.from.transform.position;
			const [ bx, by ] = props.to.transform.position;
			const { x: cx, y: cy } = midpoint;
			const [ dx, dy ] = [ bx - ax, by - ay ];

			if (props.from === props.to) {
				const distance = stateRadius + loopDistance;
				const initialAngle = Math.atan2(y - cy, x - cx);
				[ x, y ] = [ distance * Math.cos(initialAngle) + cx, distance * Math.sin(initialAngle) + cy ];

				const threshold = 10;
				if (Math.abs(x - cx) < threshold) x = cx;
				else if (Math.abs(y - cy) < threshold) y = cy;
				else return [ x, y ];

				const newAngle = Math.atan2(y - cy, x - cx);
				return [ distance * Math.cos(newAngle) + cx, distance * Math.sin(newAngle) + cy ];
			}

			const getPosition = (x: number, y: number) => {
				// Handle horizontal and vertical lines.
				if (dy === 0) return [ cx, y ];
				if (dx === 0) return [ x, cy ];

				// Lock anchor movement to a straight line.
				const m = -dx / dy;
				const ix = (cx * m + x / m - cy + y) / (m + 1 / m);
				const iy = m * (ix - cx) + cy;
				return [ ix, iy ];
			};

			[ x, y ] = getPosition(x, y);
			const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
			if (distance < 10) return [ cx, cy ]; // Snap anchor to center.
			return [ x, y ];
		}"
		:onRelease="() => $emit('anchorMove', calculateAngle())"
	/>
	<Text v-if="label" v-bind="labelPosition" :value="label" ref="text" />
</template>
<style scoped>
	.arc {
		rotate: calc(v-bind("arcRotate") * 1rad);
	}
</style>
