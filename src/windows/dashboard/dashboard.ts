import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import { Volume } from "./modules/volume.js";
import Gtk from "gi://Gtk?version=3.0";
import { ToggleSwitches } from "./modules/ToggleSwitches.js";
import Mpris from "../../globalWidgets/Mpris.js";
import Header from "./modules/Header.js";
import PopupWindow from "../../globalWidgets/PopupWindow.js";

export function Group(children: Gtk.Widget[]) {
	return Widget.Box({
		class_names: ["group"],
		vertical: true,
		children,
	});
}

export default () =>
	PopupWindow({
		name: "dashboard",
		anchor: ["bottom"],
		transition: "slide_up",
		heightRequest: 600,
		child: Widget.Box({
			vertical: true,
			class_names: ["dashboard"],
			children: [
				Group([Header()]),
				Group([Volume()]),
				ToggleSwitches(),
				Widget.Box({ child: Mpris(), class_names: ["mpris-wrapper"] }),
			],
		}),
	});
