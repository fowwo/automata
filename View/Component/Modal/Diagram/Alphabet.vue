<script setup lang="ts">
	import { nextTick, ref } from "vue";
	import Diagram from "../../../../Model/Diagram";
	import TextInput from "../../Input/Text.vue";
	import TextValidator from "../../Input/TextValidator.vue";
	import TuringMachineDiagram from "../../../../Model/Diagram/TuringMachine";

	const props = defineProps<{ diagram: Diagram; }>();

	const symbols = ref<HTMLUListElement | null>(null);
	const tapeSymbols = ref<HTMLUListElement | null>(null);

	function isValidSymbol(index: number, symbol: string) {
		if (symbol === "") return false;
		for (let i = 0; i < props.diagram.automaton.symbols.length; i++) {
			if (i !== index && symbol === props.diagram.automaton.symbols[i]) {
				return false;
			}
		}
		return true;
	}
	async function addSymbol() {
		props.diagram.automaton.addSymbol();
		await nextTick();
		(symbols.value?.children[symbols.value.children.length - 2].querySelector("input[type=text]") as HTMLInputElement).focus();
	}
	async function addTapeSymbol() {
		(props.diagram as TuringMachineDiagram).automaton.addTapeSymbol();
		await nextTick();
		(tapeSymbols.value?.children[tapeSymbols.value.children.length - 3].querySelector("input[type=text]") as HTMLInputElement).focus();
	}
</script>
<template>
	<div class="alphabet">
		<h1>Alphabet</h1>
		<hr>
		<h2>Input</h2>
		<p>The set of symbols allowed in the input string.</p>
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
				<button class="symbol small-shadow" @click="diagram.automaton.removeSymbol(symbol)">&#xE5CD;</button>
			</li>
			<li>
				<button class="symbol small-shadow" @click="addSymbol()">&#xE145;</button>
			</li>
		</ul>
		<template v-if="(diagram instanceof TuringMachineDiagram)">
			<hr>
			<h2>Tape</h2>
			<p>The set of symbols allowed on the tape.</p>
			<ul ref="tapeSymbols">
				<li v-for="symbol in diagram.automaton.alphabet">
					<TextInput auto-width disabled :modelValue="symbol" />
				</li>
				<li v-for="symbol, i in diagram.automaton.tapeAlphabet">
					<TextValidator revert auto-width
						:validator="(symbol) => isValidSymbol(i + diagram.automaton.alphabet.length, symbol)"
						v-model.trim.collapse.lazy="diagram.automaton.tapeAlphabet[i]"
						@change="() => {
							const newSymbol = (diagram as TuringMachineDiagram).automaton.tapeAlphabet[i];
							(diagram as TuringMachineDiagram).automaton.tapeAlphabet[i] = symbol; // Revert v-model change
							diagram.automaton.renameSymbol(symbol, newSymbol);
						}"
					/>
					<button class="symbol small-shadow" @click="diagram.automaton.removeSymbol(symbol)">&#xE5CD;</button>
				</li>
				<li>
					<TextInput auto-width disabled :modelValue="diagram.automaton.blankSymbol" />
				</li>
				<li>
					<button class="symbol small-shadow" @click="addTapeSymbol()">&#xE145;</button>
				</li>
			</ul>
			<hr>
			<h2>Blank symbol</h2>
			<p>The symbol to occupy unwritten cells on the tape.</p>
			<ul>
				<li v-for="symbol in [ diagram.automaton.blankSymbol ]">
					<TextValidator revert auto-width
						:validator="(symbol) => isValidSymbol(diagram.automaton.symbols.length - 1, symbol)"
						v-model.trim.collapse.lazy="diagram.automaton.blankSymbol"
						@change="() => {
							const newSymbol = (diagram as TuringMachineDiagram).automaton.blankSymbol;
							(diagram as TuringMachineDiagram).automaton.blankSymbol = symbol; // Revert v-model change
							diagram.automaton.renameSymbol(symbol, newSymbol);
						}"
					/>
				</li>
			</ul>
		</template>
	</div>
</template>
<style scoped>
	.alphabet {
		> ul {
			display: flex;
			gap: 10px;
			flex-wrap: wrap;

			> li {
				position: relative;
				display: grid;
				font-size: 1.25em;

				:deep(input) {
					min-width: 50px;
					height: 50px;
				}
				> button {
					background-color: hsl(var(--background-color-hsl));

					&:only-child {
						width: 50px;
						height: 50px;

						&:hover {
							background-color: hsl(var(--accent-color-hsl));
						}
						&:active {
							background-color: hsl(var(--accent-color-hsl) / 50%);
						}
					}
					&:not(:only-child) {
						position: absolute;
						top: -5px;
						right: -5px;
						width: 20px;
						height: 20px;
						font-size: 0.75em;

						&:hover {
							background-color: hsl(var(--error-color));
						}
						&:active {
							background-color: hsl(var(--error-color) / 50%);
						}
					}
				}
			}
		}
	}
</style>
