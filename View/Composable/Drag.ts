import { ModelRef, reactive, watch } from "vue";
import { Transform } from "./Transform";

export function useDrag({ x, y, diagramTransform, movementFilter, onRelease }: {
	x: ModelRef<number>;
	y: ModelRef<number>;
	diagramTransform: Transform;
	movementFilter?: (position: [number, number]) => [number, number];
	onRelease?: (x: number, y: number) => void;
}) {
	const transform = reactive(new Transform({ x: x.value, y: y.value }));
	watch([ x, y ], (position) => transform.position = position);

	const mousedown = (event: MouseEvent) => {
		event.stopPropagation();

		const scale = diagramTransform.scale;
		const [ cx, cy ] = [ event.clientX, event.clientY ];
		const [ px, py ] = transform.position;

		const mouseup = () => {
			document.removeEventListener("mouseup", mouseup);
			document.removeEventListener("mousemove", mousemove);
			x.value = transform.x;
			y.value = transform.y;
			onRelease?.(x.value, y.value);
		};
		const mousemove = (event: MouseEvent) => {
			const [ dx, dy ] = [ event.clientX - cx, event.clientY - cy ].map(x => x / scale);
			const position: [number, number] = [ px + dx, py + dy ];
			transform.position = movementFilter?.(position) ?? position;
		};

		document.addEventListener("mouseup", mouseup);
		document.addEventListener("mousemove", mousemove);
	}

	return { transform, mousedown };
}
