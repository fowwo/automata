const workspace = document.createElement("div");
workspace.id = "workspace";

workspace.style.setProperty("--px", "0px");
workspace.style.setProperty("--py", "0px");
workspace.style.setProperty("--scale", 1);

workspace.onmousedown = (event) => {
	const [ cx, cy ] = [ event.clientX, event.clientY ];
	const [ px, py ] = [ workspace.style.getPropertyValue("--px"), workspace.style.getPropertyValue("--py") ].map(x => parseFloat(x));
	workspace.onmouseup = () => {
		workspace.onmouseup = null;
		workspace.onmousemove = null;
	};
	workspace.onmousemove = (event) => {
		const [ dx, dy ] = [ event.clientX - cx, event.clientY - cy ];
		workspace.style.setProperty("--px", `${px + dx}px`);
		workspace.style.setProperty("--py", `${py + dy}px`);
	};
};

document.currentScript.replaceWith(workspace);
