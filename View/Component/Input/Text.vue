<script setup lang="ts">
	import Input from "./Input.vue";

	defineProps<{ autoWidth?: boolean }>();

	const model = defineModel();
</script>
<template>
	<Input type="text" class="text" :class="{ autoWidth }" @keydown.enter="$event.target.blur()" size="1" v-model="model" :data-value="model" />
</template>
<style scoped>
	.text {
		width: 100%;

		& > :deep(input) {
			border: none;
			appearance: none;
			padding: 5px;
			width: 100%;
			height: 40px;
			background: none;
			font: inherit;
			text-overflow: ellipsis;
			color: hsl(var(--text-color-hsl) / 65%);
			border-radius: 5px;

			:deep(&):enabled {
				box-shadow: var(--small-inset-shadow);
			}
			:deep(&):focus, :deep(&):enabled:hover {
				color: hsl(var(--text-color-hsl) / 100%);
			}
		}
	}
	.autoWidth {
		display: inline-grid;
		width: auto;

		& > :deep(input) {
			text-align: center;
			grid-area: 1 / 1;
		}
		&::after {
			content: attr(data-value);
			visibility: hidden;
			margin: 0 10px;
			white-space: pre;
			grid-area: 1 / 1;
		}
	}
</style>
