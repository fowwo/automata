<script setup lang="ts">
	import DiagramType from "../../Type/DiagramType";

	const { type } = defineProps<{ type: DiagramType; }>();
	const symbol = {
		DFA: "\uEF4A",
		NFA: "\uEF4A",
		DPDA: "\uE86B",
		PDA: "\uEB36",
		LBA: "\uEB50",
		TM: "\uEB39",
		NTM: "\uEB39",
	}[type];
</script>
<template>
	<span class="symbol" :class="type">{{ symbol }}</span>
</template>
<style scoped>
	.DFA { color: #0f6; }
	.NFA { color: #0df; }
	.DPDA { color: #44f; }
	.PDA { color: #b0f; }
	.LBA { color: #f08; }
	.TM { color: #f80; }
	.NTM { color: #fe0; }
</style>
