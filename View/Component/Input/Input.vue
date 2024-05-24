<script setup lang="ts">
	import { computed, useAttrs } from "vue";

	const [ modelValue, modelModifiers ] = defineModel();
	const attributes = useAttrs();
	defineOptions({ inheritAttrs: false });

	// Bind input-specific attributes to the input element.
	const inputAttributeTypes = [
		"id", // id is bound to the input for labeling purposes.
		"accept", "alt", "autocapitalize", "autocomplete", "capture",
		"checked", "dirname", "disabled", "form", "formaction",
		"formenctype", "formmethod", "formnovalidate", "formtarget",
		"height", "list", "max", "maxlength", "min", "minlength",
		"multiple", "name", "pattern", "placeholder", "popovertarget",
		"popovertargetaction", "readonly", "required", "size", "src",
		"step", "type", "value", "width"
	];

	const computedAttributes = computed(() => {
		const input: { [key: string]: unknown } = {};
		const wrapper: { [key: string]: unknown } = {};
		for (const [ attribute, value ] of Object.entries(attributes)) {
			if (attribute.startsWith("on") || inputAttributeTypes.includes(attribute)) {
				input[attribute] = value;
			} else {
				wrapper[attribute] = value;
			}
		}
		return { wrapper, input };
	});
</script>
<template>
	<div v-bind="computedAttributes.wrapper">
		<input v-if="modelModifiers.lazy" v-bind="computedAttributes.input" v-model.lazy="modelValue">
		<input v-else v-bind="computedAttributes.input" v-model="modelValue">
	</div>
</template>
