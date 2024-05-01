<script setup lang="ts">
	import Select from "../../Input/Select.vue";
	import Diagram from "../../../../Model/Diagram";

	defineProps<{ diagram: Diagram; }>();
</script>
<template>
	<div class="transition-table">
		<span></span>
		<span v-for="symbol in diagram.automaton.alphabet">{{ symbol }}</span>
		<template v-for="state in diagram.automaton.states">
			<span>{{ diagram.states[state].label }}</span>
			<div v-for="symbol in diagram.automaton.alphabet">
				<template v-if="diagram.type === 'DFA'">
					<Select
						:name="`${state}-${symbol}`"
						:options="[[ '', null ] as [string, any]].concat([ ...diagram.automaton.states ].map(state => [ diagram.states[state].label, state ]))"
						:modelValue="diagram.automaton.transitions[state]?.[symbol] ?? null"
						@update:modelValue="
							($event === null) ? (
								// Remove the transition from the automaton.
								(state in diagram.automaton.transitions)
								&& (delete diagram.automaton.transitions[state][symbol])
								
								// Remove the state from the transition object if it has no outgoing transitions.
								&& (Object.keys(diagram.automaton.transitions[state]).length === 0)
								&& (delete diagram.automaton.transitions[state])
							) : (
								// Set the transition state.
								(diagram.automaton.transitions[state] ??= {})
								&& (diagram.automaton.transitions[state][symbol] = $event)
							)
						"
					/>
				</template>
			</div>
		</template>
	</div>
</template>
<style scoped>
	.transition-table {
		display: grid;
		grid-template-columns: fit-content(200px) repeat(v-bind("diagram.automaton.alphabet.size"), minmax(0, 1fr));
		gap: 5px;
		width: 100%;

		> span {
			padding: 0.25em 0.5em;
			align-self: center;
			text-align: center;
			font-weight: bold;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}
	}
</style>
