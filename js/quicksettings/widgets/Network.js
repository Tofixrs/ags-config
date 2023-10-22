import icons from '../../icons.js';
import { Menu, ArrowToggleButton } from '../ToggleButton.js';
import { Network, Widget } from '../../imports.js';
import { Separator } from '../../misc/Separator.js';
import Gtk from 'gi://Gtk';

export const NetworkToggle = () => ArrowToggleButton({
	name: 'network',
	icon: Widget.Icon({
		connections: [[Network, icon => {
			icon.icon = Network.wifi?.iconName || '';
		}]],
	}),
	label: Widget.Label({
		truncate: 'end',
		connections: [[Network, label => {
			label.label = Network.wifi?.ssid || 'Not Connected';
		}]],
	}),
	connection: [Network, () => Network.wifi?.enabled],
	deactivate: () => Network.wifi.enabled = false,
	activate: () => {
		Network.wifi.enabled = true;
		Network.wifi.scan();
	},
});

export const WifiSelection = () => Menu({
	name: 'network',
	icon: Widget.Icon({
		connections: [[Network, icon => {
			icon.icon = Network.wifi?.iconName;
		}]],
	}),
	title: Widget.Label('Wifi Selection'),
	content: Widget({
		type: Gtk.ScrolledWindow,
		"min-content-height": 300,
		className: "wifi-select",
		child: Widget.Box({
			vertical: true,
			connections: [[Network, box => box.children =
				Network.wifi?.accessPoints.map(ap => Widget.Button({
					className: "access-point",
					onClicked: `nmcli device wifi connect ${ap.bssid}`,
					child: Widget.Box({
						children: [
							Widget.Icon(ap.iconName),
							Separator(),
							Widget.Label(ap.ssid),
							ap.active && Widget.Icon({
								icon: icons.tick,
								hexpand: true,
								halign: 'end',
							}),
						],
					}),
				})),
			]],
		})
	}),
});
