import Widget from "resource:///com/github/Aylur/ags/widget.js";
import icons from "../../../icons.js";
import { ArrowToggleButton } from "../SubMenu.js";
import Bluetooth from "resource:///com/github/Aylur/ags/service/bluetooth.js";
import { BluetoothDevice } from "types/service/bluetooth.js";
import { opened } from "../dashboard.js";
import { Menu } from "../../../globalWidgets/subMenu.js";

export const BluetoothToggle = () =>
	ArrowToggleButton({
		name: "bluetooth",
		icon: Widget.Icon({}).bind("icon", Bluetooth, "enabled", (v) =>
			v ? icons.bluetooth.enabled : icons.bluetooth.disabled,
		),
		label: Widget.Label({
			truncate: "end",
		}).hook(Bluetooth, (self) => {
			if (!Bluetooth.enabled) return (self.label = "Disabled");

			if (Bluetooth.connected_devices.length === 0)
				return (self.label = "Not Connected");

			if (Bluetooth.connected_devices.length === 1)
				return (self.label = Bluetooth.connected_devices[0].alias);

			self.label = `${Bluetooth.connected_devices.length} Connected`;
		}),
		connection: [Bluetooth, () => Bluetooth.enabled],
		deactivate: () => (Bluetooth.enabled = false),
		activate: () => (Bluetooth.enabled = true),
	});

const DeviceItem = (device: BluetoothDevice) =>
	Widget.Box({
		class_names: ["menu-list-item"],
		children: [
			Widget.Icon(device.icon_name + "-symbolic"),
			Widget.Label({ label: device.name, max_width_chars: 10 }),
			Widget.Label({
				label: `${device.battery_percentage}%`,
			}).bind("visible", device, "battery_percentage", (p) => p > 0),
			Widget.Box({ hexpand: true }),
			Widget.Spinner({})
				.bind("active", device, "connecting")
				.bind("visible", device, "connecting"),
			Widget.Button({
				label: "connect",
				on_clicked: () => {
					device.setConnection(!device.connected);
				},
			}).bind("visible", device, "connecting", (c) => !c),
		],
	});

export const BluetoothDevices = () =>
	Menu(
		"bluetooth",
		[
			Widget.Box({
				hexpand: true,
				vertical: true,
			}).bind("children", Bluetooth, "devices", (ds) =>
				ds.filter((d) => d.name).map(DeviceItem),
			),
		],
		opened,
	);
