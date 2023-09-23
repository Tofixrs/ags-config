import options from "../../options.js"
const { Box, EventBox, Button, Label } = ags.Widget;
const { execAsync } = ags.Utils;
const { Hyprland } = ags.Service;

export const Workspaces = ({ workspaces: fixed = options.workspaces, indicator } = {}) => Box({
	className: "workspaces panel-button",
	child: Box({
		child: EventBox({
			onScrollUp: () => execAsync(["hyprctl", "dispatch", "workspace", "+1"]),
			onScrollDown: () => execAsync(["hyprctl", "dispatch", "workspace", "-1"]),
			child: Box({
				children: Array.from({ length: fixed }, (_, i) => i + 1)
					.map(i => WorkspaceBtn(i, indicator)),
				connections: [[Hyprland, box => {
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
	})
})

const WorkspaceBtn = (id, indicator) => Button({
	onClicked: () => execAsync(`hyprctl dispatch workspace ${id}`),
	child: indicator ? indicator() : Label(`${id}`),
	connections: [[Hyprland, btn => {
		const { workspaces, active } = Hyprland;
		const occupied = Hyprland.getWorkspace(id)?.windows > 0;
		btn.toggleClassName('active', active.workspace.id === id);
		btn.toggleClassName('occupied', occupied);
		btn.toggleClassName('empty', !occupied);
	}]]
})


function getOtherWorkspaces(workspaces, fixed) {
	return workspaces.filter(workspace => workspace.id > fixed)
}

