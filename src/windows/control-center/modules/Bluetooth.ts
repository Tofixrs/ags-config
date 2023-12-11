import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from '../../../icons.js';
import { Menu, ArrowToggleButton } from '../SubMenu.js';
//@ts-ignore
import Bluetooth from "resource:///com/github/Aylur/ags/service/bluetooth.js";

export const BluetoothToggle = () => ArrowToggleButton({
	name: 'bluetooth',
	icon: Widget.Icon({
		connections: [[Bluetooth, icon => {
			icon.icon = Bluetooth.enabled
				? icons.bluetooth.enabled
				: icons.bluetooth.disabled;
		}]],
	}),
	label: Widget.Label({
		truncate: 'end',
		connections: [[Bluetooth, label => {
			if (!Bluetooth.enabled)
				return label.label = 'Disabled';

			if (Bluetooth.connectedDevices.length === 0)
				return label.label = 'Not Connected';

			if (Bluetooth.connectedDevices.length === 1)
				return label.label = Bluetooth.connectedDevices[0].alias;

			label.label = `${Bluetooth.connectedDevices.length} Connected`;
		}]],
	}),
	connection: [Bluetooth, () => Bluetooth.enabled],
	deactivate: () => Bluetooth.enabled = false,
	activate: () => Bluetooth.enabled = true,
});

const DeviceItem = (device: any) => Widget.Box({
	class_names: ["menu-list-item"],
	children: [
		Widget.Icon(device.icon_name + '-symbolic'),
		Widget.Label({ label: device.name, max_width_chars: 10 }),
		Widget.Label({
			label: `${device.battery_percentage}%`,
			binds: [['visible', device, 'battery-percentage', p => p > 0]],
		}),
		Widget.Box({ hexpand: true }),
		Widget.Spinner({
			binds: [
				['active', device, 'connecting'],
				['visible', device, 'connecting'],
			],
		}),
		Widget.Switch({
			active: device.connected,
			binds: [['visible', device, 'connecting', c => !c]],
			connections: [['notify::active', ({ active }) => {
				device.setConnection(active);
			}]],
		}),
	],
});

export const BluetoothDevices = () => Menu("bluetooth", [
	Widget.Box({
		hexpand: true,
		vertical: true,
		binds: [['children', Bluetooth, 'devices', ds => ds
			.filter(d => d.name)
			.map(DeviceItem)]],
	})
]);
