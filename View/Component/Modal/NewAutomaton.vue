<script setup lang="ts">
	import { ref } from "vue";
	import Modal from "../Modal.vue";

	defineExpose({
		open: () => modal.value?.open(),
		close: () => modal.value?.close()
	});

	const modal = ref<InstanceType<typeof Modal> | null>(null);
</script>
<template>
	<Modal title="New Automaton" :class="$style['new-automaton-modal']" ref="modal">
		<hr>
		<div>
			<div>
				<span class="symbol">&#xEF4A;</span>
				<span class="symbol">&#xE941;</span>
				<span class="symbol">&#xE86B;</span>
				<span class="symbol">&#xE941;</span>
				<span class="symbol">&#xEB36;</span>
				<span class="symbol">&#xE941;</span>
				<span class="symbol">&#xEB50;</span>
				<span class="symbol">&#xE941;</span>
				<span class="symbol">&#xEB39;</span>
			</div>
			<div>more edges = higher computational power</div>
		</div>
		<hr>
		<button>
			<div>
				<span class="dfa-icon"></span>
			</div>
			<div>
				<span>Deterministic Finite Automaton</span>
				<span>DFA</span>
			</div>
		</button>
		<button>
			<div>
				<span class="nfa-icon"></span>
			</div>
			<div>
				<span>Nondeterministic Finite Automaton</span>
				<span>NFA</span>
			</div>
		</button>
		<button disabled>
			<div>
				<span class="dpda-icon"></span>
			</div>
			<div>
				<span>Deterministic Pushdown Automaton</span>
				<span>DPDA</span>
			</div>
		</button>
		<button disabled>
			<div>
				<span class="pda-icon"></span>
			</div>
			<div>
				<span>Pushdown Automaton</span>
				<span>PDA</span>
			</div>
		</button>
		<button disabled>
			<div>
				<span class="lba-icon"></span>
			</div>
			<div>
				<span>Linear Bounded Automaton</span>
				<span>LBA</span>
			</div>
		</button>
		<button>
			<div>
				<span class="tm-icon"></span>
			</div>
			<div>
				<span>Turing Machine</span>
				<span>TM</span>
			</div>
		</button>
		<button disabled>
			<div>
				<span class="ntm-icon"></span>
			</div>
			<div>
				<span>Nondeterministic Turing Machine</span>
				<span>NTM</span>
			</div>
		</button>
	</Modal>
</template>
<style module>
	.new-automaton-modal > div > div {
		padding: 15px 20px;

		> div {
			text-align: center;

			> div:first-child {
				font-size: 1.25em;
			}
			> div:last-child {
				color: hsl(var(--text-color-hsl) / 35%);
				font-size: 0.75em;
			}
		}
		> button {
			display: flex;
			width: 100%;
			height: 50px;

			&:disabled > div:first-child > span::after {
				color: hsl(var(--text-color-hsl) / 10%);
			}
			> div {
				display: flex;
				flex-shrink: 0;
				height: 100%;
				justify-content: center;
				align-items: center;
			}
			> div:first-child {
				width: 40px;
				justify-content: left;
				font-size: 2em;
				& > span {
					height: 0;
				}
			}
			> div:last-child {
				flex-direction: column;
				justify-content: space-evenly;
				align-items: start;

				> span:last-child {
					opacity: 50%;
				}
			}
		}
	}
</style>
