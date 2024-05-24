<script setup lang="ts">
	import { watch } from "vue";
	import { useTransform } from "../Composable/Transform";
	import Interface from "./Diagram/Interface.vue";
	import Workspace from "./Diagram/Workspace.vue";
	import Diagram from "../../Model/Diagram";

	const props = defineProps<{ diagram: Diagram }>();

	const transform = useTransform();

	// Reset the transform when changing diagrams.
	watch(props, () => {
		transform.x = 0;
		transform.y = 0;
		transform.scale = 1;
	}, { deep: false });
</script>
<template>
	<div class="diagram">
		<Interface :diagram :transform />
		<Workspace :diagram :transform />
	</div>
</template>
<style scoped>
	.diagram {
		position: relative;
		width: 100%;
		user-select: none;
	}
</style>
