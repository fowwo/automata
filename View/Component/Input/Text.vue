<script setup lang="ts">
	import Input from "./Input.vue";
</script>
<template>
	<Input type="text" class="text" @keydown.enter="$event.target.blur()" size="1" />
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
</style>
