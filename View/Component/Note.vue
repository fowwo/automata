<script setup lang="ts">
	withDefaults(defineProps<{
		type?: "info" | "warning" | "error";
	}>(), {
		type: "info"
	});
</script>
<template>
	<div class="note" :class="type">
		<slot></slot>
	</div>
</template>
<style scoped>
	.note {
		display: flex;
		padding: 10px;
		margin: 10px 0;
		align-items: center;
		border-radius: 10px;

		&::before {
			display: flex;
			position: relative;
			margin-right: 10px;
			font-size: 2em;
			font-family: "Material Symbols Outlined";
			font-variation-settings: "FILL" 1;
		}
	}
	.info {
		background-color: hsl(var(--info-color) / 25%);
		&::before {
			content: "\e88e";
			color: hsl(var(--info-color));
		}
	}
	.warning {
		background-color: hsl(var(--warning-color) / 25%);
		&::before {
			content: "\e002";
			color: hsl(var(--warning-color));
		}
	}
	.error {
		background-color: hsl(var(--error-color) / 25%);
		&::before {
			content: "\e000";
			color: hsl(var(--error-color));
		}
	}
</style>
