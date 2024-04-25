<script setup lang="ts">
	import Input from "./Input.vue";
</script>
<template>
	<Input type="radio" class="symbol" :class="$style.radio" />
</template>
<style module>
	.radio {
		position: relative;
		aspect-ratio: 1;
		height: 40px;
		box-shadow: var(--small-inset-shadow);
		border-radius: 5px;
		font-size: 0.75em;
		border-radius: 50%;

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
				content: "\e061";
				position: absolute;
				display: flex;
				inset: 3px;
				justify-content: center;
				align-items: center;
				font-variation-settings: "FILL" 1;
				background-color: hsl(var(--background-color-hsl));
				border-radius: 50%;
				pointer-events: none;
			}
		}
	}
</style>
