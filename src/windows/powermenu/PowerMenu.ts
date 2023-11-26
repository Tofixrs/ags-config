import { Widget, Window } from "resource:///com/github/Aylur/ags/widget.js";
import { PowerAction, PowerMenuService } from "../../services/PowerMenu.js";
import icons from "../../icons.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import Gtk from "gi://Gtk";
import PopupWindow from "../../global_modules/PopupWindow.js";

function SysButton(icon: string, action: PowerAction) {
	return Widget.Button({
		child: Widget.Icon(icon),
		on_clicked: () => { PowerMenuService.confirmAction(action); }
	})
}


export function PowerMenu() {
	return PopupWindow({
		expand: true,
		name: "powermenu",
		content: Widget.Box({
			class_names: ["powermenu"],
			vertical: true,
			homogeneous: true,
			children: [
				Widget.Box({
					class_name: "row",
					children: [
						SysButton(icons.powermenu.shutdown, PowerAction.Shutdown),
						SysButton(icons.powermenu.reboot, PowerAction.Reboot),
					]
				}),
				Widget.Box({
					class_name: "row",
					children: [
						SysButton(icons.powermenu.sleep, PowerAction.Sleep),
						SysButton(icons.powermenu.logout, PowerAction.Logout),
					]
				})
			]
		})
	})
}

export function Verification() {
	return Window({
		expand: true,
		visible: false,
		focus_visible: true,
		focusable: true,
		popup: true,
		name: "verification",
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
								PowerMenuService.executeSelectedAction()
							}
						}),
						Widget.Button({
							label: "No",
							on_clicked: () => App.closeWindow("verification")
						})
					]
				})
			]
		})
	})
}
