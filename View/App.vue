<script setup lang="ts">
	import { diagram, diagrams } from "./State/Diagram";
	import Diagram from "./Component/Diagram.vue";
	import Sidebar from "./Component/Sidebar.vue";
</script>
<template>
	<Sidebar :diagram :diagrams />
	<Diagram :diagram />
	<div id="diagram-info-container" class="large-shadow">
		<div id="diagram-info"></div>
	</div>
</template>
