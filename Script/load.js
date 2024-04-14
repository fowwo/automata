import Diagram from "../Model/Diagram.js";

const diagrams = JSON.parse(localStorage.getItem("diagrams"))?.map(x => new Diagram(x)) ?? [];

diagrams[0]?.load();
