import Variable from "resource:///com/github/Aylur/ags/variable.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import icons from "../../icons.js";
import { timeout } from "resource:///com/github/Aylur/ags/utils.js";
import { BoxProps } from "types/widgets/box.js";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk?version=3.0";
import { opened } from "./dashboard.js";
import { Arrow } from "../../globalWidgets/subMenu.js";

App.connect("window-toggled", (_, name, visible) => {
	if (name === "controlcenter" && !visible) {
		timeout(1000, () => {
			const window = App.getWindow("controlcenter");

			opened.value = window?.visible ? opened.value : "";
		});
	}
});

export type ArrowToggleButtonProps = {
	name: string;
	icon: Gtk.Widget;
	label: Gtk.Widget;
	activate: () => void;
	deactivate: () => void;
	connection: [GObject.Object | typeof App, () => boolean];
	activateOnArrow?: true;
} & BoxProps;

export const ArrowToggleButton = ({
	name,
	icon,
	label,
	activate,
	deactivate,
	activateOnArrow = true,
	connection: [service, condition],
}: ArrowToggleButtonProps) =>
	Widget.Box({
		class_name: "toggle-button",
		children: [
			Widget.Button({
				class_names: ["btn"],

				child: Widget.Box({
					hexpand: true,
					children: [icon, label],
				}),
				on_clicked: () => {
					if (condition()) {
						deactivate();
						if (opened.value === name) opened.value = "";
					} else {
						activate();
					}
				},
			}),
			Arrow(name, opened, activateOnArrow && activate),
		],
	}).hook(service, (self) => {
		self.toggleClassName("active", condition());
	});
