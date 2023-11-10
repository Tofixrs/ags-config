import options from "../../options.js"
import { Widget, Utils, Hyprland } from "../../imports.js";

const dispatch = arg => () => Utils.execAsync(`hyprctl dispatch workspace ${arg}`);

export const Workspaces = ({ workspaces: fixed = options.workspaces, indicator } = {}) => Widget.EventBox({
	on_scroll_up: () => dispatch("+1"),
	on_scroll_down: () => dispatch("-1"),
	class_name: "workspaces panel-button",
	child: Widget.Box({
		children: Array.from({ length: 10 }, (_, i) => i + 1)
			.map(i => WorkspaceBtn(i, indicator)),
		connections: [[Hyprland.active.workspace, box => box.children.map(btn => {
			btn.visible = Hyprland.workspaces.some(ws => ws.id === btn.id) || btn.id <= fixed;
		})]],
	})
})

const WorkspaceBtn = (id, indicator) => Widget.Button({
	on_clicked: () => dispatch(id),
	setup: btn => btn.id = id,
	child: indicator ? indicator() : Widget.Label(`${id}`),
	connections: [[Hyprland, (btn, ...args) => {
		const { active } = Hyprland;
		const occupied = Hyprland.getWorkspace(id)?.windows > 0;
		btn.toggleClassName('active', active.workspace.id === id);
		btn.toggleClassName('occupied', occupied);
		btn.toggleClassName('empty', !occupied);
	}]]
})

