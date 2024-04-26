<script setup lang="ts">
	import { useAttrs } from "vue";

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
	const inputAttributes: { [key: string]: unknown } = {};
	const wrapperAttributes: { [key: string]: unknown } = {};
	for (const [ attribute, value ] of Object.entries(attributes)) {
		if (attribute.startsWith("on") || inputAttributeTypes.includes(attribute)) {
			inputAttributes[attribute] = value;
		} else {
			wrapperAttributes[attribute] = value;
		}
	}
</script>
<template>
	<div v-bind="wrapperAttributes">
		<input
			v-bind="inputAttributes"
			:value="modelValue"
			@input="!modelModifiers.lazy && $emit('update:modelValue', ($event.target as HTMLInputElement).value)"
			@change="modelModifiers.lazy && $emit('update:modelValue', ($event.target as HTMLInputElement).value)"
		>
	</div>
</template>
