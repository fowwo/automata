<script setup lang="ts">
	import { ref } from "vue";
	import { diagrams } from "../../State/Diagram";
	import Modal from "../Modal.vue";
	import Note from "../Note.vue";
	import TextValidatorInput from "../Input/TextValidator.vue";
	import Diagram from "../../../Model/Diagram";

	const props = defineProps<{ diagram: Diagram; }>();
	defineExpose({
		open: () => modal.value?.open(),
		close: () => modal.value?.close()
	});

	const modal = ref<InstanceType<typeof Modal> | null>(null);
	const nav = ref("general");

	function isUniqueName(name: string) {
		if (name === "") return false;
		for (const otherDiagram of diagrams) {
			if (otherDiagram !== props.diagram && otherDiagram.name === name) {
				return false;
			}
		}
		return true;
	}
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
			<div :class="$style.general" v-if="nav === 'general'">
				<h1>General</h1>
				<hr>
				<div>
					<div>
						<label for="diagram-rename">Name</label>
					</div>
					<TextValidatorInput id="diagram-rename" :validator="isUniqueName" revert v-model.trim.collapse.lazy="diagram.name" />
				</div>
			</div>
			<div :class="$style.alphabet" v-if="nav === 'alphabet'">
				<h1>Alphabet</h1>
				<hr>
				<ul></ul>
			</div>
			<div :class="$style.states" v-if="nav === 'states'">
				<h1>States</h1>
				<table>
					<thead>
						<tr>
							<th title="Start State" class="symbol">&#xF6FE;</th>
							<th title="Final State" class="symbol">&#xF12E;</th>
							<th>Name</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
				<button class="symbol small-shadow">&#xE145;</button>
			</div>
			<div :class="$style.transitions" v-if="nav === 'transitions'">
				<h1>Transitions</h1>
				<Note type="error">
					Your automaton must have symbols in the alphabet before creating transitions.
				</Note>
				<table>
					<thead><tr></tr></thead>
					<tbody></tbody>
				</table>
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
	.general {
		> div {
			display: flex;
			margin-top: 10px;
			gap: 10px;

			> div:first-child {
				flex-grow: 1;

				> label {
					line-height: 40px;
				}
				> p {
					font-size: 0.8em;
					color: hsl(var(--text-color-hsl) / 65%);
				}
			}
			> div:last-child {
				max-width: 250px;
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
	.states {
		> table {
			width: 100%;

			> thead {
				height: 30px;

				> tr > th {
					font-size: 1.25em;

					&:last-child {
						width: 100%;
						font-size: 1em;
						text-align: left;
						line-height: 0;
					}
				}
			}
			> tbody > tr > td {
				&:nth-last-child(2) {
					border-right-width: 0;
				}
				&:last-child {
					border-left-width: 0;

					> button {
						aspect-ratio: 1;
						font-size: 1.25em;
					}
				}
			}
		}
		> button {
			margin-top: 10px;
			width: 100%;

			&:hover {
				background-color: hsl(var(--accent-color-hsl));
			}
			&:active {
				background-color: hsl(var(--accent-color-hsl) / 50%);
			}
		}
	}
	.transitions {
		&:has(thead th + th) > .error {
			display: none;
		}
		> table {
			width: 100%;

			> thead {
				height: 30px;
			}
		}
	}
</style>
