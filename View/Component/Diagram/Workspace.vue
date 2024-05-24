<script setup lang="ts">
	import { ref } from "vue";
	import { Transform } from "../../Composable/Transform";
	import Diagram from "../../../Model/Diagram";
	import State from "./Element/State.vue";
	import TransitionArrow from "./Element/Transition.vue";

	const props = defineProps<{
		diagram: Diagram;
		transform: Transform;
	}>();

	const states = ref<{ [state: number]: any }>({});
	const workspace = ref<HTMLDivElement | null>(null);

	function pan(event: MouseEvent) {
		const [ cx, cy ] = [ event.clientX, event.clientY ];
		const [ px, py ] = [ props.transform.x, props.transform.y ];
		workspace.value!.onmouseup = () => {
			workspace.value!.onmouseup = null;
			workspace.value!.onmousemove = null;
		};
		workspace.value!.onmousemove = (event) => {
			const [ dx, dy ] = [ event.clientX - cx, event.clientY - cy ].map(x => x / props.transform.scale);
			props.transform.x = px + dx;
			props.transform.y = py + dy;
		};
	}
	function zoom(event: WheelEvent) {
		if (event.buttons) return; // Prevent scroll while dragging.
		event.deltaY > 0 ? props.transform.zoomOut() : props.transform.zoomIn();
	}
</script>
<template>
	<div class="workspace" ref="workspace" @mousedown="pan" @wheel="zoom">
		<State v-for="state in diagram.automaton.states"
			:key="JSON.stringify(diagram.states[state])"
			v-model:x="diagram.states[state].x"
			v-model:y="diagram.states[state].y"
			:label="diagram.states[state].label"
			:accept="diagram.automaton.acceptStates.has(state)"
			:start="diagram.automaton.startState === state ? diagram.startTransition : undefined"
			:diagram
			:diagramTransform="transform"
			:ref="(element) => states[state] = element"
		/>
		<template v-for="(d, from) in props.diagram.mergedTransitionLabels">
			<template v-for="(label, to) in d">
				<TransitionArrow
					:from="states[from]"
					:to="states[to]"
					:angle="diagram.transitions[from]?.[to]"
					:label
					:diagram
					:diagramTransform="transform"
					@anchorMove="(angle) => {
						if (angle === 0) {
							delete diagram.transitions[from]?.[to];
							if (Object.keys(diagram.transitions[from]).length === 0) {
								delete diagram.transitions[from];
							}
							return;
						}
						diagram.transitions[from] ??= {};
						diagram.transitions[from][to] = angle;
					}"
				/>
			</template>
		</template>
	</div>
</template>
<style scoped>
	.workspace {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: 1;
		cursor: move;
		--px: v-bind("transform.x");
		--py: v-bind("transform.y");
		--scale: v-bind("transform.scale");

		& > * {
			:deep(& > svg) {
				fill: none;
				stroke: currentColor;
				stroke-width: 5px;
				stroke-linecap: round;
			}
		}
	}
</style>
