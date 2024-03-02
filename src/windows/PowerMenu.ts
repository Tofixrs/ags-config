import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { PowerAction, PowerMenuService } from "../services/PowerMenu.js";
import icons from "../icons.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import Gtk from "gi://Gtk?version=3.0";
import PopupWindow from "../globalWidgets/PopupWindow.js";

function SysButton(icon: string, action: PowerAction) {
	return Widget.Button({
		child: Widget.Icon(icon),
		on_clicked: () => {
			PowerMenuService.confirmAction(action);
		},
	});
}

export function PowerMenu() {
	return PopupWindow({
		expand: true,
		name: "powermenu",
		transition: "none",
		child: Widget.Box({
			class_names: ["powermenu-wrapper"],
			child: Widget.Box({
				class_names: ["powermenu"],
				vertical: true,
				homogeneous: true,
				children: [
					Widget.Box({
						class_name: "row",
						children: [
							SysButton(icons.powermenu.shutdown, PowerAction.Shutdown),
							SysButton(icons.powermenu.reboot, PowerAction.Reboot),
						],
					}),
					Widget.Box({
						class_name: "row",
						children: [
							SysButton(icons.powermenu.sleep, PowerAction.Sleep),
							SysButton(icons.powermenu.logout, PowerAction.Logout),
						],
					}),
				],
			}),
		}),
	});
}

export function Verification() {
	return PopupWindow({
		expand: true,
		visible: false,
		keymode: "exclusive",
		transition: "none",
		name: "verification",
		child: Widget.Box({
			class_names: ["verification-wrapper"],
			child: Widget.Box({
				vertical: true,
				class_names: ["verification"],
				homogeneous: true,
				children: [
					Widget.Label("Are you sure?"),
					Widget.Box({
						halign: Gtk.Align.CENTER,
						hexpand: true,
						children: [
							Widget.Button({
								label: "Yes",
								on_clicked: () => {
									App.closeWindow("verification");
									PowerMenuService.executeSelectedAction();
								},
							}),
							Widget.Button({
								label: "No",
								on_clicked: () => App.closeWindow("verification"),
							}),
						],
					}),
				],
			}),
		}),
	});
}
