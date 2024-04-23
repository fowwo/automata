<script setup lang="ts">
	import Interface from "./Diagram/Interface.vue";
	import Workspace from "./Diagram/Workspace.vue";
	import Diagram from "../../Model/Diagram";
	import { useTransform } from "../Composable/Transform";

	defineProps<{ diagram: Diagram }>();

	const transform = useTransform();
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
