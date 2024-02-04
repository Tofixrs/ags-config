import Variable from "resource:///com/github/Aylur/ags/variable.js";
import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import icons from "../../icons.js";
import { timeout } from "resource:///com/github/Aylur/ags/utils.js";
import { BoxProps } from "types/widgets/box.js";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk?version=3.0";

export const opened = Variable("");

App.connect("window-toggled", (_, name, visible) => {
	if (name === "controlcenter" && !visible) {
		timeout(1000, () => {
			const window = App.getWindow("controlcenter");

			opened.value = window?.visible ? opened.value : "";
		});
	}
});

export function Menu(name: string, content: Gtk.Widget[]) {
	return Widget.Revealer({
		transition: "slide_down",
		child: Widget.Box({
			class_names: ["menu", name],
			vertical: true,
			children: content,
		}),
	}).bind("reveal_child", opened, "value", (v) => v == name);
}

export function Arrow(name: string, activate?: () => void) {
	let deg = 0;
	let iconOpened = false;
	return Widget.Button({
		class_names: ["arrow"],
		child: Widget.Icon({
			icon: icons.ui.arrowRight,
		}).hook(opened, (self) => {
			if (
				(opened.value === name && !iconOpened) ||
				(opened.value !== name && iconOpened)
			) {
				const step = opened.value === name ? 10 : -10;
				iconOpened = !iconOpened;
				for (let i = 0; i < 9; ++i) {
					timeout(15 * i, () => {
						deg += step;
						self.setCss(`-gtk-icon-transform: rotate(${deg}deg);`);
					});
				}
			}
		}),
		on_clicked: () => {
			opened.value = opened.value === name ? "" : name;
			if (activate) activate();
		},
	});
}
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
			Arrow(name, activateOnArrow && activate),
		],
	}).hook(service, (self) => {
		self.toggleClassName("active", condition());
	});
