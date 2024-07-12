import Variable from "resource:///com/github/Aylur/ags/variable.js";
import {
	Box,
	Label,
	EventBox,
	Icon,
} from "resource:///com/github/Aylur/ags/widget.js";
import { utils } from "../../../lib/index.js";
import Gtk30 from "gi://Gtk?version=3.0";

const projects = Variable<string[]>([]);

App.connect("window-toggled", (_, name, visible) => {
	if (!name.startsWith("desktop")) return;
	if (!visible) return;

	utils
		.bash(`nvim -l ${App.configDir}/src/scripts/projects.lua`)
		.then((v) => {
			projects.setValue(v.split("\n").filter((_, i) => i < 10));
		})
		.catch((e) => console.log(e));
});

export default () => {
	const grid = Gtk30.Grid.new();
	grid.set_row_spacing(20);
	grid.set_column_spacing(20);
	projects.connect("changed", () => {
		grid.get_children().forEach((v) => grid.remove(v));
		projects.value.forEach((v, i) => {
			grid.attach(Project(v), i % 5, Math.floor(i / 5), 1, 1);
		});
	});
	return Box({
		vertical: true,
		class_names: ["bg", "projects"],
		children: [Label("Projects"), grid],
	});
};

const Project = (path: string) => {
	const pathSplit = path.split("/");
	const projectName = pathSplit[pathSplit.length - 1];
	return EventBox({
		visible: true,
		on_primary_click: () => utils.bash(`$TERMINAL -e "nvim ${path}"`),
		child: Box({
			class_names: ["project"],
			vertical: true,
			children: [
				Icon("inode-directory-symbolic"),
				Label({ label: projectName }),
			],
		}),
	});
};
