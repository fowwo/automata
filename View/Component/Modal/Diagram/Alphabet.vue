<script setup lang="ts">
	import Diagram from "../../../../Model/Diagram";
	import TextValidator from "../../Input/TextValidator.vue";

	const props = defineProps<{ diagram: Diagram; }>();

	function isValidSymbol(index: number, symbol: string) {
		if (symbol === "") return false;
		for (let i = 0; i < props.diagram.automaton.alphabet.length; i++) {
			if (i !== index && symbol === props.diagram.automaton.alphabet[i]) {
				return false;
			}
		}
		return true;
	}
</script>
<template>
	<div class="alphabet">
		<h1>Alphabet</h1>
		<hr>
		<h2>Input</h2>
		<p>The set of symbols allowed in an input string.</p>
		<ul ref="symbols">
			<li v-for="symbol, i in diagram.automaton.alphabet">
				<TextValidator revert auto-width
					:validator="(symbol) => isValidSymbol(i, symbol)"
					v-model.trim.collapse.lazy="diagram.automaton.alphabet[i]"
					@change="() => {
						const newSymbol = diagram.automaton.alphabet[i];
						diagram.automaton.alphabet[i] = symbol; // Revert v-model change
						diagram.automaton.renameSymbol(symbol, newSymbol);
					}"
				/>
			</li>
		</ul>
	</div>
</template>
<style scoped>
	.alphabet {
		> ul {
			display: flex;
			gap: 10px;
			flex-wrap: wrap;

			> li {
				display: grid;
				font-size: 1.25em;

				:deep(input) {
					min-width: 50px;
					height: 50px;
				}
			}
		}
	}
</style>
