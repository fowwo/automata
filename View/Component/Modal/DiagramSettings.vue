<script setup lang="ts">
	import { ref } from "vue";
	import { Transform } from "../../Composable/Transform";
	import Modal from "../Modal.vue";
	import Note from "../Note.vue";
	import General from "./Diagram/General.vue";
	import States from "./Diagram/States.vue";
	import TransitionTable from "./Diagram/TransitionTable.vue";
	import Diagram from "../../../Model/Diagram";

	defineProps<{
		diagram: Diagram;
		transform?: Transform;
	}>();
	defineExpose({
		open: () => modal.value?.open(),
		close: () => modal.value?.close()
	});

	const modal = ref<InstanceType<typeof Modal> | null>(null);
	const nav = ref("general");
</script>
<template>
	<Modal title="Automaton Settings" :class="$style['automaton-settings']" ref="modal">
		<nav class="small-inset-shadow">
			<ul>
				<li class="toggle large-shadow">
					<input type="radio" name="automaton-settings-nav" value="general" v-model="nav">
					<span>General</span>
				</li>
				<li class="toggle large-shadow">
					<input type="radio" name="automaton-settings-nav" value="alphabet" v-model="nav">
					<span>Alphabet</span>
				</li>
				<li class="toggle large-shadow">
					<input type="radio" name="automaton-settings-nav" value="states" v-model="nav">
					<span>States</span>
				</li>
				<li class="toggle large-shadow">
					<input type="radio" name="automaton-settings-nav" value="transitions" v-model="nav">
					<span>Transitions</span>
				</li>
			</ul>
		</nav>
		<div>
			<General v-if="nav === 'general'" :diagram />
			<div :class="$style.alphabet" v-else-if="nav === 'alphabet'">
				<h1>Alphabet</h1>
				<hr>
				<ul></ul>
			</div>
			<States v-else-if="nav === 'states'" :diagram :transform />
			<div :class="$style.transitions" v-else-if="nav === 'transitions'">
				<h1>Transitions</h1>
				<hr>
				<Note type="error" v-if="diagram.automaton.alphabet.size === 0">
					Your automaton must have symbols in the alphabet before creating transitions.
				</Note>
				<TransitionTable v-else :diagram />
			</div>
		</div>
	</Modal>
</template>
<style module>
	.automaton-settings > div {
		width: 800px;
		height: 100%;

		> div {
			flex-grow: 1;
			display: flex;

			> nav {
				background-color: hsl(var(--shadow-color-hsl) / calc(var(--shadow-opacity)));
				box-shadow: var(--small-inset-shadow);
				overflow: hidden;
				flex-shrink: 0;

				> ul {
					margin: 20px 0 20px 10px;
					list-style: none;

					> li {
						width: 150px;
						height: 40px;
						padding: 10px;

						&:has(input:checked) {
							background-color: hsl(var(--background-color-hsl));
							border-radius: 10px 0 0 10px;
						}
						&:not(:has(input:checked))::before {
							box-shadow: none;
						}
					}
				}
			}
			> div {
				position: relative;
				flex-grow: 1;

				> div {
					position: absolute;
					inset: 0;
					padding: 20px;
					overflow: auto;
				}
			}
		}
	}
	.alphabet {
		> ul {
			display: flex;
			gap: 10px;
			flex-wrap: wrap;

			> li {
				display: grid;
				background-color: hsl(var(--background-color-hsl));
				font-size: 1.5em;
				border-radius: 10px;

				> input {
					min-width: 60px;
					height: 60px;
					text-align: center;
					border-radius: inherit;
					box-shadow: none;
					grid-area: 1 / 1;
				}
				&::after {
					content: attr(data-value);
					visibility: hidden;
					margin: 0 10px;
					font-size: inherit;
					grid-area: 1 / 1;
				}
			}
		}
	}
</style>
