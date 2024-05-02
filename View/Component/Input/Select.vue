<script setup lang="ts">
	import { computed, onMounted, ref } from "vue";

	const props = defineProps<{
		name: string;
		options: any[];
		multiple?: boolean;
		disabled?: boolean;
	}>();

	const model = defineModel();
	const options = computed(() => props.options.map(x => Array.isArray(x) ? x : [ x, x ]));
	const label = computed(() => {
		if (props.multiple) {
			const values = new Set(model.value as Iterable<any>);
			return options.value
				.filter(([ label, value ]) => values.has(value))
				.map(([ label, value ]) => label)
				.join(", ");
		}
		return options.value.find(([ label, value ]) => value === model.value)?.[0];
	});

	const button = ref<HTMLButtonElement | null>(null);
	const popover = ref<HTMLElement | null>(null);

	onMounted(() => {
		if (button.value) {
			button.value.popoverTargetElement = popover.value;
		}
	});
</script>
<template>
	<div class="select">
		<button class="selection small-shadow" ref="button" popovertargetaction="toggle" :disabled>
			<span>{{ label }}</span>
		</button>
		<ul class="small-shadow" @click="popover?.showPopover()">
			<li v-for="([label, value], index) in options" :key="index">
				<input :type="multiple ? 'checkbox' : 'radio'" :name :value v-model="model">
				<span>{{ label }}</span>
			</li>
		</ul>
		<aside ref="popover" popover></aside>
	</div>
</template>
<style scoped>
	.select {
		position: relative;
		user-select: none;

		> button {
			display: flex;
			padding: 0 10px;
			width: 100%;
			line-height: 40px;
			background-color: hsl(var(--background-color-hsl));

			> span {
				flex-grow: 1;
				text-align: left;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
			&::after {
				content: "\e5cf";
				font-family: "Material Symbols Outlined";
			}
			&:has(~ aside:popover-open) {
				color: hsl(var(--text-color-hsl));
				&::after {
					content: "\e5ce";
				}
			}
		}
		> ul {
			position: absolute;
			top: calc(100% + 5px);
			width: 100%;
			list-style: none;
			background-color: hsl(var(--background-color-hsl));
			border-radius: 5px;
			z-index: 1;

			&:has(~ aside:not(:popover-open)) {
				display: none;
			}
			> li {
				position: relative;
				display: flex;
				margin: 5px;
				padding: 0 5px;
				line-height: 40px;
				border-radius: 4px;

				&:has(input:checked) {
					background-color: hsl(var(--accent-color-hsl));
					color: white;

					&::before {
						visibility: visible;
					}
				}
				&::before {
					content: "\e876";
					margin-right: 3px;
					font-family: "Material Symbols Outlined";
					visibility: hidden;
				}
				> input {
					position: absolute;
					inset: 0;
					appearance: none;
					cursor: pointer;
				}
				> span {
					flex-grow: 1;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
			}
		}
		> aside {
			display: none;
		}
	}
</style>
