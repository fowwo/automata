<script setup lang="ts">
	import { ref, watch } from "vue";
	import TextInput from "./Text.vue";

	const props = defineProps<{
		validator: (input: any) => boolean;
		revert?: boolean;
	}>();

	const [ model, modelModifiers ] = defineModel<string | number>();

	const current = ref(String(model.value));
	const previous = ref(model.value);
	const invalid = ref(!props.validator(model.value));

	watch(current, input);
	watch(model, () => {
		current.value = String(model.value);
	});

	function input(value: string) {
		const modifiedValue = modifyValue(value);
		invalid.value = !props.validator(modifiedValue);
		if (!invalid.value && !modelModifiers.lazy) {
			model.value = modifiedValue;
		}
	}
	function change(value: string) {
		const modifiedValue = modifyValue(value);
		invalid.value = !props.validator(modifiedValue);
		if (!invalid.value) {
			model.value = modifiedValue;
			previous.value = modifiedValue;
			current.value = String(modifiedValue);
			return;
		}

		// Revert the input value if requested.
		if (props.revert) {
			model.value = previous.value;
			current.value = String(previous.value);
		}
	}
	function modifyValue(value: string) {
		if (modelModifiers.trim) value = value.trim();
		if (modelModifiers.number) return Number(value);
		return value;
	}
</script>
<template>
	<TextInput
		:class="{ invalid }"
		@change="change($event.target.value)"
		v-model="current"
	/>
</template>
<style scoped>
	.invalid > :deep(input) {
		outline: 3px solid red;
		box-shadow: 0 0 10px 3px red;
	}
</style>
