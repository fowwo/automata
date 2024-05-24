<script setup lang="ts">
	import { ref } from "vue";
	import { diagram as selectedDiagram } from "../State/Diagram";
	import NewAutomatonModal from "./Modal/NewAutomaton.vue";
	import DiagramIcon from "./Diagram/Icon.vue";
	import Diagram from "../../Model/Diagram";

	defineProps<{
		diagrams: Diagram[];
	}>();

	const newAutomatonModal = ref<InstanceType<typeof NewAutomatonModal> | null>(null);

	function toggleColorScheme() {
		const dark = document.documentElement.classList.toggle("dark");
		localStorage.setItem("color-scheme", dark ? "dark" : "light");
	}
</script>
<template>
	<nav class="sidebar large-shadow">
		<div></div>
		<div class="diagram-list">
			<button v-for="diagram of diagrams">
				<input type="radio" name="diagram" :value="diagram" v-model="selectedDiagram">
				<DiagramIcon :type="diagram.type" />
			</button>
			<hr>
			<button id="new-diagram" class="symbol small-shadow" @click="newAutomatonModal?.open()">&#xE145;</button>
		</div>
		<div>
			<button id="color-scheme" class="small-shadow" @click="toggleColorScheme()">
				<span class="symbol">&#xE430;</span>
				<span class="filled-symbol">&#xE3A8;</span>
			</button>
			<a class="button small-shadow" href="https://github.com/fowwo/automata">
				<svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/></svg>
			</a>
		</div>
	</nav>
	<Teleport to="body">
		<NewAutomatonModal ref="newAutomatonModal" />
	</Teleport>
</template>
<style scoped>
	.sidebar {
		display: flex;
		padding: 5px;
		width: 50px;
		justify-content: space-between;
		flex-direction: column;
		flex-shrink: 0;
		z-index: 2;

		> div {
			display: flex;
			flex-direction: column;
			gap: 5px;

			> button, > .button {
				position: relative;
				aspect-ratio: 1;
				font-size: 28px;
				background-color: hsl(var(--background-color-hsl));
			}
		}
		> .diagram-list {
			> button {
				position: relative;

				> input {
					position: absolute;
					inset: 0;
					appearance: none;
					border-radius: inherit;
					cursor: pointer;
				}
				> span {
					display: flex;
					justify-content: center;
					pointer-events: none;
				}
				&:has(input:checked) {
					background-color: hsl(var(--accent-color-hsl) / 20%);
					z-index: 200;

					&::after {
						content: "";
						position: absolute;
						top: 5px;
						bottom: 5px;
						right: -7px;
						width: 4px;
						border-radius: 5px;
						background-color: hsl(var(--accent-color-hsl));
					}
				}
			}
			> hr {
				margin: 0;

				&:first-child {
					display: none;
				}
			}
		}

		#new-diagram {
			background-color: hsl(var(--accent-color-hsl));
		}
		#color-scheme {
			> span {
				position: absolute;
				display: block;
				left: 0;
				right: 0;
			}
			& > :first-child {
				visibility: hidden;

				html.dark & {
					visibility: visible;
				}
			}
			& > :last-child {
				rotate: 135deg;
				translate: -2px 2px;

				html.dark & {
					visibility: hidden;
				}
			}
		}
	}
</style>
