<script setup lang="ts">
	import Input from "./Input.vue";
</script>
<template>
	<Input type="text" class="small-inset-shadow" :class="$style.text" @keydown.enter="$event.target.blur()" />
</template>
<style module>
	.text > input {
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

		&:enabled {
			box-shadow: var(--small-inset-shadow);
		}
		&:focus, &:enabled:hover {
			color: hsl(var(--text-color-hsl) / 100%);
		}
	}
</style>
