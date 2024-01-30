const diagram = document.getElementById("diagram");

diagram.style.setProperty("--px", "0px");
diagram.style.setProperty("--py", "0px");
diagram.style.setProperty("--scale", 1);

diagram.onmousedown = (event) => {
	const scale = parseFloat(diagram.style.getPropertyValue("--scale"));
	const [ cx, cy ] = [ event.clientX, event.clientY ];
	const [ px, py ] = [ diagram.style.getPropertyValue("--px"), diagram.style.getPropertyValue("--py") ].map(x => parseFloat(x));
	diagram.onmouseup = () => {
		diagram.onmouseup = null;
		diagram.onmousemove = null;
	};
	diagram.onmousemove = (event) => {
		const [ dx, dy ] = [ event.clientX - cx, event.clientY - cy ].map(x => x / scale);
		diagram.style.setProperty("--px", `${px + dx}px`);
		diagram.style.setProperty("--py", `${py + dy}px`);
	};
};
