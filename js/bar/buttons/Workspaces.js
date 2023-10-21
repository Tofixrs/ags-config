import options from "../../options.js"
import { Widget, Utils, Service, Hyprland } from "../../imports.js";

export const Workspaces = ({ workspaces: fixed = options.workspaces, indicator } = {}) => Widget.EventBox({
	onScrollUp: () => Utils.execAsync(["hyprctl", "dispatch", "workspace", "+1"]),
	onScrollDown: () => Utils.execAsync(["hyprctl", "dispatch", "workspace", "-1"]),
	className: "workspaces panel-button",
	child: Widget.Box({
		children: Array.from({ length: fixed }, (_, i) => i + 1)
			.map(i => WorkspaceBtn(i, indicator)),
		connections: [[Hyprland, (box, ...args) => {
			const { workspaces } = Hyprland;
			const otherWs = getOtherWorkspaces(workspaces, fixed);

			if (otherWs.length > 0) {
				const otherWsIDs = otherWs.map(ws => ws.id);
				box.children = Array.from({ length: fixed }, (_, i) => i + 1)
					.concat(otherWsIDs)
					.map(i => WorkspaceBtn(i, indicator));
			} else if (box.children.length > 5) {
				box.children = Array.from({ length: fixed }, (_, i) => i + 1).map(i => WorkspaceBtn(i, indicator));
			}
		}]]
	})
})

const WorkspaceBtn = (id, indicator) => Widget.Button({
	onClicked: () => Utils.execAsync(`hyprctl dispatch workspace ${id}`),
	child: indicator ? indicator() : Widget.Label(`${id}`),
	connections: [[Hyprland, (btn, ...args) => {
		const { active } = Hyprland;
		const occupied = Hyprland.getWorkspace(id)?.windows > 0;
		btn.toggleClassName('active', active.workspace.id === id);
		btn.toggleClassName('occupied', occupied);
		btn.toggleClassName('empty', !occupied);
	}]]
})


function getOtherWorkspaces(workspaces, fixed) {
	return workspaces.filter(workspace => workspace.id > fixed)
}

