<script setup lang="ts">
	import { diagrams } from "../../../State/Diagram";
	import TextValidatorInput from "../../Input/TextValidator.vue";
	import Diagram from "../../../../Model/Diagram";

	const props = defineProps<{ diagram: Diagram; }>();

	function isValidDiagramName(name: string) {
		if (name === "") return false;
		for (const otherDiagram of diagrams) {
			if (otherDiagram !== props.diagram && otherDiagram.name === name) {
				return false;
			}
		}
		return true;
	}
</script>
<template>
	<div class="general">
		<h1>General</h1>
		<hr>
		<div>
			<div>
				<label for="diagram-rename">Name</label>
			</div>
			<TextValidatorInput id="diagram-rename" :validator="isValidDiagramName" revert v-model.trim.collapse.lazy="diagram.name" />
		</div>
	</div>
</template>
<style scoped>
	.general {
		> div {
			display: flex;
			margin-top: 10px;
			gap: 10px;

			> div:first-child {
				flex-grow: 1;

				> label {
					line-height: 40px;
				}
				> p {
					font-size: 0.8em;
					color: hsl(var(--text-color-hsl) / 65%);
				}
			}
			> div:last-child {
				max-width: 250px;
			}
		}
	}
</style>
