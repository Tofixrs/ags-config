import SystemTray, {
	TrayItem,
} from "resource:///com/github/Aylur/ags/service/systemtray.js";
import { Box, Button, Icon } from "resource:///com/github/Aylur/ags/widget.js";

export const Tray = () =>
	Box({
		class_names: ["component", "tray"],
		visible: SystemTray.bind("items").as((items) => items.length > 0),
		children: SystemTray.bind("items").as((items) => items.map(Item)),
	});

const Item = (item: TrayItem) =>
	Button({
		class_names: ["item"],
		on_primary_click: (_, evt) => item.activate(evt),
		on_secondary_click: (_, evt) => item.openMenu(evt),
		child: Icon({
			size: 12,
			vpack: "center",
			icon: item.bind("icon"),
		}),
	});
