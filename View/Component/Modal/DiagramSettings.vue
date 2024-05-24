<script setup lang="ts">
	import { ref } from "vue";
	import { Transform } from "../../Composable/Transform";
	import Modal from "../Modal.vue";
	import General from "./Diagram/General.vue";
	import Alphabet from "./Diagram/Alphabet.vue";
	import States from "./Diagram/States.vue";
	import Transitions from "./Diagram/Transitions.vue";
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
	<Modal title="Automaton Settings" class="automaton-settings" ref="modal">
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
			<Alphabet v-else-if="nav === 'alphabet'" :diagram />
			<States v-else-if="nav === 'states'" :diagram :transform />
			<Transitions v-else-if="nav === 'transitions'" :diagram />
		</div>
	</Modal>
</template>
<style scoped>
	.automaton-settings > :deep(div) {
		width: 800px;
		height: 100%;

		:deep(& > div) {
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
</style>
