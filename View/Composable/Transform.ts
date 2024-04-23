import { reactive } from "vue";

/** Represents a position and scale. */
export class Transform {

	x: number;
	y: number;
	scale: number;

	constructor({ x = 0, y = 0, scale = 1 }: TransformArguments = {}) {
		this.x = x;
		this.y = y;
		this.scale = scale;
	}

	zoomIn() {
		this.scale = Math.min(4, Math.SQRT2 * this.scale);
	}
	zoomOut() {
		this.scale = Math.max(0.25, Math.SQRT1_2 * this.scale);
	}

}

/** Creates a reactive transform instance. */
export function useTransform(args?: TransformArguments) {
	return reactive(new Transform(args));
}

type TransformArguments = {
	x?: number;
	y?: number;
	scale?: number;
};
