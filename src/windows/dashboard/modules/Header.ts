import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Avatar from "../../../globalWidgets/avatar.js";
import PowerButton from "../../../globalWidgets/power_button.js";
import { uptime } from "../../../variables.js";
import icons from "../../../icons.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";

export default () =>
	Widget.Box({
		class_names: ["header"],
		children: [
			Avatar(),
			Widget.Box({
				vertical: true,
				class_names: ["mods"],
				children: [
					Widget.Box({
						children: [
							Widget.Label({
								class_name: "header-mod",
								hexpand: true,
							}).bind("label", uptime, "value", (v) => `Uptime: ${v}`),
							Widget.Button({
								vpack: "center",
								hpack: "center",
								child: Widget.Icon(icons.powermenu.lock),
								on_clicked: () => execAsync("swaylock"),
								class_name: "header-mod",
							}),
							PowerButton({ class_names: ["header-mod"] }),
						],
					}),
				],
			}),
		],
	});
