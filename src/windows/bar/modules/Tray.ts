import SystemTray from "resource:///com/github/Aylur/ags/service/systemtray.js";

export function SysTray() {
	const visible = SystemTray.bind("items").as((items) => items.length > 0);

	const items = SystemTray.bind("items").as((items) =>
		items.map((item) =>
			Widget.Button({
				child: Widget.Icon({
					icon: item.bind("icon"),
					size: 15,
				}),
				on_primary_click: (_, event) => item.activate(event),
				on_secondary_click: (_, event) => item.openMenu(event),
				tooltip_markup: item.bind("tooltip_markup"),
			}),
		),
	);

	return Widget.Box({
		class_names: ["bar-module", "sys-tray"],
		children: items,
	}).hook(SystemTray, (self) => {
		self.visible = SystemTray.items.length > 0;
	});
}
