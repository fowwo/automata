<script setup lang="ts">
	import { computed, ref, watch } from "vue";
	import TextInput from "./Text.vue";

	const props = defineProps<{
		validator: (input: any) => boolean;
		revert?: boolean;
	}>();

	const [ model, modelModifiers ] = defineModel<string | number>();

	const current = ref(String(model.value));
	const invalid = computed(() => !props.validator(modifyValue(current.value)));

	// When the model value is changed from outside, the current value needs to be updated.
	let externalChange = true;
	watch(model, () => {
		if (externalChange) {
			current.value = String(model.value);
		}
		externalChange = true;
	});

	// Using watch instead of @input because @input fires before updating the value.
	watch(current, (value) => {
		if (!invalid.value && !modelModifiers.lazy) {
			const modifiedValue = modifyValue(value);
			if (model.value === modifiedValue) return;

			externalChange = false;
			model.value = modifiedValue;
		}
	});

	function change(value: string | number) {
		if (!invalid.value) {
			current.value = String(value);
			if (model.value === value) return;

			externalChange = false;
			model.value = value;
			return;
		}

		// Revert the input value when invalid, if requested.
		if (props.revert) current.value = String(model.value);
	}
	function modifyValue(value: string) {
		if (modelModifiers.trim) value = value.trim();
		if (modelModifiers.collapse) value = value.replace(/\s+/g, " ");
		if (modelModifiers.number) return Number(value);
		return value;
	}
</script>
<template>
	<TextInput
		:class="{ invalid }"
		@change="change(modifyValue($event.target.value))"
		v-model="current"
	/>
</template>
<style scoped>
	.invalid > :deep(input) {
		outline: 3px solid red;
		box-shadow: 0 0 10px 3px red;
	}
</style>
