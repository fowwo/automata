<script setup lang="ts">
	import { useAttrs } from "vue";

	const model = defineModel();
	const attributes = useAttrs();
	defineOptions({ inheritAttrs: false });

	// Bind input-specific attributes to the input element.
	const inputAttributeTypes = [
		"accept", "alt", "autocapitalize", "autocomplete", "capture",
		"checked", "dirname", "disabled", "form", "formaction",
		"formenctype", "formmethod", "formnovalidate", "formtarget", "height",
		"list", "max", "maxlength", "min", "minlength",
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
		<input v-bind="inputAttributes" v-model="model">
	</div>
</template>
