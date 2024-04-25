<script setup lang="ts">
	import { computed } from "vue";
	import AutomatonType from "../../../Type/AutomatonType";

	const props = defineProps<{ type: AutomatonType; }>();
	const symbol = computed(() => {
		return {
			DFA: "\uEF4A",
			NFA: "\uEF4A",
			DPDA: "\uE86B",
			PDA: "\uEB36",
			LBA: "\uEB50",
			TM: "\uEB39",
			NTM: "\uEB39",
		}[props.type];
	});
</script>
<template>
	<span class="symbol" :class="props.type">{{ symbol }}</span>
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
