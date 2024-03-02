import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { range } from "../../../utils.js";

const workspace = (arg: string) =>
	execAsync(`hyprctl dispatch workspace ${arg}`);

export default (ws: number = 5) =>
	Widget.Box({
		class_names: ["bar-module", "workspaces"],
		children: range(10, 1).map((i) => wsBtn(i)),
	}).hook(Hyprland, (self) => {
		self.children.map((btn) => {
			btn.visible =
				//@ts-expect-error :22
				Hyprland.workspaces.some((ws) => ws.id === btn.id) || btn.id <= ws;
		});
	});

const wsBtn = (id: number) =>
	Widget.Button({
		//@ts-expect-error field inject
		setup: (btn) => (btn.id = id),
		class_names: ["ws-btn"],
		vpack: "center",
		hpack: "center",
		on_clicked: () => workspace(id.toString()),
	}).hook(Hyprland.active.workspace, (self) => {
		self.toggleClassName("active", Hyprland.active.workspace.id == self.id);

		const btnWs = Hyprland.getWorkspace(self.id);
		if (!btnWs) return;

		self.toggleClassName("occupied", btnWs.windows > 0);
	});
