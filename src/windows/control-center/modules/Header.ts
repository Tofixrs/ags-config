import { Box, Widget } from "resource:///com/github/Aylur/ags/widget.js";
import Avatar from "../../../global_modules/avatar.js";
import { uptime } from "../../../variables.js";
import icons from "../../../icons.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import PowerButton from "../../../global_modules/power_button.js";

export default () => Box({
	class_names: ["header"],
	children: [
		Avatar(),
		Widget.Box({
			vertical: true,
			class_names: ["mods"],
			children: [
				Widget.Box({
					children: [
						Widget.Label({ binds: [["label", uptime, "value", v => `Uptime: ${v}`]], class_name: "header-mod", hexpand: true }),
						Widget.Button({ vpack: "center", hpack: "center", child: Widget.Icon(icons.powermenu.lock), on_clicked: () => execAsync("swaylock"), class_name: "header-mod" }),
						PowerButton({ class_names: ["header-mod"] })
					]
				})
			]
		}),
	]
})
