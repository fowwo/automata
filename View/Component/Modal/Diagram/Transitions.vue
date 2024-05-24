<script setup lang="ts">
	import Note from "../../Note.vue";
	import Select from "../../Input/Select.vue";
	import Diagram from "../../../../Model/Diagram";
	import TuringMachine from "../../../../Model/Automaton/TuringMachine";

	defineProps<{ diagram: Diagram; }>();
</script>
<template>
	<div class="transitions">
		<h1>Transitions</h1>
		<hr>
		<Note type="error" v-if="diagram.automaton.symbols.length === 0">
			Your automaton must have symbols in the alphabet to create transitions.
		</Note>
		<div class="transition-table" v-else>
			<span></span>
			<span v-for="symbol in diagram.automaton.symbols">{{ symbol }}</span>
			<template v-for="state in diagram.automaton.states">
				<span>{{ diagram.states[state].label }}</span>
				<div v-for="symbol in diagram.automaton.symbols">
					<template v-if="diagram.type === 'DFA'">
						<Select
							:name="`${state}-${symbol}`"
							:options="[[ '', null ] as [string, any]]
								.concat([ ...diagram.automaton.states ]
								.map(state => [ diagram.states[state].label, state ]))"
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
					<template v-else-if="diagram.type === 'NFA'">
						<Select multiple
							:name="`${state}-${symbol}`"
							:options="[ ...diagram.automaton.states ]
								.map(state => [ diagram.states[state].label, state ])"
							:modelValue="diagram.automaton.transitions[state]?.[symbol] ?? []"
							@update:modelValue="
								($event.length === 0) ? (
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
					<template v-else-if="diagram.type === 'TM'">
						<Select
							:name="`${state}-${symbol}-state`"
							:options="[[ '', null ] as [string, any]]
								.concat([ ...diagram.automaton.states ]
								.map(state => [ diagram.states[state].label, state ]))"
							:modelValue="(diagram.automaton as TuringMachine).transitions[state]?.[symbol]?.[0] ?? null"
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
									&& (
										(symbol in diagram.automaton.transitions[state])
										? ((diagram.automaton as TuringMachine).transitions[state][symbol][0] = $event)
										: (diagram.automaton.transitions[state][symbol] ??= [ $event, symbol, 'R' ])
									)
								)
							"
						/>
						<Select
							:name="`${state}-${symbol}-symbol`"
							:options="diagram.automaton.symbols"
							:modelValue="(diagram.automaton as TuringMachine).transitions[state]?.[symbol]?.[1]"
							@update:modelValue="(diagram.automaton as TuringMachine).transitions[state][symbol][1] = $event"
							:disabled="((diagram.automaton as TuringMachine).transitions[state]?.[symbol] === undefined)"
						/>
						<Select
							:name="`${state}-${symbol}-direction`"
							:options="[ 'L', 'R', 'N' ]"
							:modelValue="(diagram.automaton as TuringMachine).transitions[state]?.[symbol]?.[2]"
							@update:modelValue="(diagram.automaton as TuringMachine).transitions[state][symbol][2] = $event"
							:disabled="((diagram.automaton as TuringMachine).transitions[state]?.[symbol] === undefined)"
						/>
					</template>
				</div>
			</template>
		</div>
	</div>
</template>
<style scoped>
	.transitions > .transition-table {
		display: grid;
		grid-template-columns: fit-content(200px) repeat(v-bind("diagram.automaton.symbols.length"), minmax(0, 1fr));
		gap: 10px;
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
		> div {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
			gap: 2px;
		}
	}
</style>
