import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import { Box, Button } from "resource:///com/github/Aylur/ags/widget.js";
import { range } from "@/lib/utils";

export const Workspaces = () =>
	Box({
		class_names: ["workspaces", "component"],
		children: range(10).map(Workspace),
		setup: (self) =>
			self.hook(Hyprland.active.workspace, () =>
				self.children.map((btn) => {
					if (btn.attribute <= 5) return;

					btn.visible = Hyprland.workspaces.some(
						(ws) => ws.id == btn.attribute,
					);
				}),
			),
	});

const Workspace = (workspace: number) =>
	Button({
		attribute: workspace,
		class_names: ["workspace"],
		hpack: "center",
		vpack: "center",
		on_clicked: () => Hyprland.messageAsync(`dispatch workspace ${workspace}`),
		setup: (self) =>
			self.hook(Hyprland, () => {
				self.toggleClassName(
					"active",
					Hyprland.active.workspace.id == workspace,
				);
				self.toggleClassName(
					"occupied",
					(Hyprland.getWorkspace(workspace)?.windows || 0) > 0,
				);
			}),
	});
