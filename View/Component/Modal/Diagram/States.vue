<script setup lang="ts">
	import { nextTick, ref } from "vue";
	import { Transform } from "../../../Composable/Transform";
	import Checkbox from "../../Input/Checkbox.vue";
	import Radio from "../../Input/Radio.vue";
	import TextValidatorInput from "../../Input/TextValidator.vue";
	import Diagram from "../../../../Model/Diagram";

	const props = defineProps<{
		diagram: Diagram;
		transform?: Transform;
	}>();

	const states = ref<HTMLTableSectionElement | null>(null);

	function isValidStateLabel(state: number, name: string) {
		if (name === "") return false;
		for (const [ s, { label } ] of Object.entries(props.diagram.states)) {
			if (+s !== state && label === name) {
				return false;
			}
		}
		return true;
	}
	async function addState() {
		const [ x, y ] = [ props.transform?.x ?? 0, props.transform?.y ?? 0 ];
		props.diagram.addState(-x, -y);
		await nextTick();
		(states.value?.lastElementChild?.querySelector("input[type=text]") as HTMLInputElement).focus();
	}
</script>
<template>
	<div class="states">
		<h1>States</h1>
		<hr>
		<table>
			<thead>
				<tr>
					<th title="Start State" class="symbol">&#xF6FE;</th>
					<th title="Accept State" class="symbol">&#xF12E;</th>
					<th>Name</th>
				</tr>
			</thead>
			<tbody ref="states">
				<tr v-for="state in diagram.automaton.states" :key="state">
					<td>
						<Radio name="start-state" :value="state" v-model="diagram.automaton.startState" />
					</td>
					<td>
						<Checkbox name="accept-state" :value="state" v-model="diagram.automaton.acceptStates" />
					</td>
					<td>
						<TextValidatorInput :validator="(label) => isValidStateLabel(state, label)" revert v-model.trim.collapse.lazy="diagram.states[state].label" />
					</td>
					<td>
						<button class="symbol" @click="diagram.removeState(state)">&#xE872;</button>
					</td>
				</tr>
			</tbody>
		</table>
		<button class="symbol small-shadow" @click="addState()">&#xE145;</button>
	</div>
</template>
<style scoped>
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
</style>
