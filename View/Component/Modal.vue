<script setup lang="ts">
	import { ref } from "vue";

	defineProps<{
		title: string
	}>();
	defineExpose({
		open,
		close
	});

	const modal = ref<HTMLDialogElement | null>(null);

	function open() {
		modal.value?.showModal();
	}
	function close() {
		modal.value?.close();
	}
</script>
<template>
	<dialog class="modal" ref="modal" @click="(event) => event.target === modal && close()">
		<div>
			<header class="large-shadow">
				<span>{{ title }}</span>
				<button class="symbol" @click="close()">&#xE5CD;</button>
			</header>
			<div>
				<slot></slot>
			</div>
		</div>
	</dialog>
</template>
<style scoped>
	.modal {
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		inset: 0;
		width: 100vw;
		height: 100vh;
		max-width: none;
		max-height: none;
		background-color: hsl(0 0 0 / 40%);
		backdrop-filter: blur(5px);
		border: none;
		z-index: 100;
		transition: opacity var(--transition-fast) var(--transition-zip);

		&:not([open]) {
			opacity: 0;
			pointer-events: none;
		}
		&::backdrop {
			background: none;
		}
		> div {
			display: flex;
			flex-direction: column;
			max-width: calc(100vw - 50px);
			max-height: calc(100vh - 50px);
			background-color: hsl(var(--background-color-hsl));
			border-radius: 10px;
			overflow: hidden;
			filter: drop-shadow(0 0 50px #0008);
			transition: scale var(--transition-fast) var(--transition-zip);

			:not([open]) > & {
				scale: 0.9;
			}
			> header {
				position: relative;
				display: flex;
				padding: 0 20px;
				height: 60px;
				align-items: center;
				font-size: 1.25em;
				z-index: 1;

				> button {
					position: absolute;
					aspect-ratio: 1;
					height: 100%;
					top: 0;
					right: 0;
				}
			}
			> div {
				overflow: auto;
			}
		}
	}
</style>
