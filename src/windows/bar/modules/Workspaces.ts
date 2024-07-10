import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { utils } from "../../../lib/index.js";

const workspace = (arg: string) =>
	execAsync(`hyprctl dispatch workspace ${arg}`);

export default (ws: number = 5) =>
	Widget.Box({
		class_names: ["bar-module", "workspaces"],
		children: utils.range(10, 1).map((i) => wsBtn(i)),
	}).hook(Hyprland, (self) => {
		self.children.map((btn) => {
			btn.visible =
				Hyprland.workspaces.some((ws) => ws.id === btn.attribute.id) ||
				btn.attribute.id <= ws;
		});
	});

const wsBtn = (id: number) =>
	Widget.Button({
		attribute: { id: id },
		class_names: ["ws-btn"],
		vpack: "center",
		hpack: "center",
		on_clicked: () => workspace(id.toString()),
	}).hook(Hyprland, (self) => {
		self.toggleClassName(
			"active",
			Hyprland.active.workspace.id == self.attribute.id,
		);

		const btnWs = Hyprland.getWorkspace(self.attribute.id);
		if (!btnWs) return;

		self.toggleClassName("occupied", btnWs.windows > 0);
	});
