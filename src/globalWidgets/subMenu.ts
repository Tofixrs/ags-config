import { Variable } from "resource:///com/github/Aylur/ags/variable.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import icons from "../icons.js";
import { timeout } from "resource:///com/github/Aylur/ags/utils.js";
import Gtk from "gi://Gtk?version=3.0";

export function Menu(
	name: string,
	content: Gtk.Widget[],
	opened: Variable<string>,
) {
	return Widget.Revealer({
		transition: "slide_down",
		child: Widget.Box({
			class_names: ["menu", name],
			vertical: true,
			children: content,
		}),
	}).bind("reveal_child", opened, "value", (v) => v == name);
}

export function Arrow(
	name: string,
	opened: Variable<string>,
	activate?: () => void,
) {
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
