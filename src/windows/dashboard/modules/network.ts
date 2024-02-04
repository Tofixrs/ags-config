import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import { ArrowToggleButton, Menu } from "../SubMenu.js";
import NetworkService from "resource:///com/github/Aylur/ags/service/network.js";
import icons from "../../../icons.js";
import { Variable } from "resource:///com/github/Aylur/ags/variable.js";
import WifiPassword from "../../../services/WifiPassword.js";
import Gtk from "gi://Gtk?version=3.0";

const Networks = new Variable(0);

export const NetworkToggle = () =>
	ArrowToggleButton({
		name: "network",
		class_names: ["network", "module"],
		icon: Widget.Icon({}).hook(
			NetworkService,
			(self) => (self.icon = NetworkService.wifi?.icon_name || ""),
		),
		label: Widget.Label({
			truncate: "end",
			max_width_chars: 10,
		}).hook(
			NetworkService,
			(self) => (self.label = NetworkService.wifi?.ssid || "Not connected"),
		),
		connection: [NetworkService, () => NetworkService.wifi?.enabled],
		deactivate: () => (NetworkService.wifi.enabled = false),
		activate: () => {
			NetworkService.wifi.enabled = true;
			NetworkService.wifi.scan();
		},
	});

export const WifiSelection = () =>
	Menu("network", [
		Widget.Box({
			class_names: ["menu-title"],
			children: [
				Widget.Icon({}).hook(
					NetworkService,
					(self) => (self.icon = NetworkService.wifi.icon_name),
				),
				Widget.Separator({ vpack: "center" }),
				Widget.Label("Wifi Select"),
			],
		}),
		Widget.Separator({ orientation: Gtk.Orientation.HORIZONTAL }),
		Widget.Scrollable({
			min_content_height: 50,
			hscroll: "never",
			vscroll: "automatic",
			class_names: ["menu-contents", "wifi-select"],
			child: Widget.Box({
				vertical: true,
			}).hook(NetworkService, (self) => {
				Networks.value = NetworkService.wifi.access_points.length;

				const active = Widget.Icon({
					icon: icons.ui.tick,
					hexpand: true,
					hpack: "end",
				});

				self.children = NetworkService.wifi?.access_points.map((ap) =>
					Widget.Button({
						class_names: ["menu-list-item"],
						on_clicked: () => WifiPassword.connectWifi(ap.bssid!, ap.ssid!),
						child: Widget.Box({
							children: [
								Widget.Icon(ap.iconName),
								Widget.Label(ap.ssid || ""),
								...(ap.active ? [active] : []),
							],
						}),
					}),
				);
			}),
		}).hook(Networks, (self) => {
			self.min_content_height = Math.min(50 * Networks.value, 200);
		}),
	]);
