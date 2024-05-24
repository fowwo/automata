<script setup lang="ts">
	import Input from "./Input.vue";
</script>
<template>
	<Input type="checkbox" class="symbol" :class="$style.checkbox" />
</template>
<style module>
	.checkbox {
		position: relative;
		aspect-ratio: 1;
		height: 40px;
		box-shadow: var(--small-inset-shadow);
		border-radius: 5px;
		font-size: 1.25em;

		> input {
			position: absolute;
			inset: 0;
			appearance: none;
			border-radius: inherit;
			cursor: pointer;
		}
		&:has(> input:checked) {
			background-color: hsl(var(--accent-color-hsl));
			box-shadow: none;
			&::after {
				content: "\e876";
				position: absolute;
				display: flex;
				inset: 3px;
				justify-content: center;
				align-items: center;
				background-color: hsl(var(--background-color-hsl));
				border-radius: 3px;
				pointer-events: none;
			}
		}
	}
</style>
