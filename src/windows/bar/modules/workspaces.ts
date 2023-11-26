import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import { range } from "../../../utils.js";

const workspace = (arg: string) => execAsync(`hyprctl dispatch workspace ${arg}`)

export default function Workspaces(ws: number = 5) {
	return Widget.Box({
		class_names: ["module", "workspaces"],
		children: range(10, 1).map(i => workspaceButton(i)),
		connections: [[Hyprland.active.workspace, box => box.children.map(btn => {
			//@ts-ignore btn.id decalred in workspaceButton
			btn.visible = Hyprland.workspaces.some(ws => ws.id === btn.id) || btn.id <= ws;
		})]]
	});
}

function workspaceButton(id: number) {
	return Widget.Button({
		//@ts-ignore btn.id is declared here lol
		setup: btn => btn.id = id,
		class_name: "ws-indicator",
		vpack: "center",
		on_clicked: () => workspace(id.toString()),
		connections: [[Hyprland, self => {
			self.toggleClassName("active", Hyprland.active.workspace.id == id);
			//@ts-ignore
			self.toggleClassName("occupied", Hyprland.getWorkspace(id)?.windows > 0);
		}]]
	});
}
