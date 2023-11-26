import { NetworkToggle, WifiSelection } from "./Network.js";
import { Group } from "../ControlCenter.js";
import { BluetoothDevices, BluetoothToggle } from "./Bluetooth.js";
import Gtk from "gi://Gtk";
import { Widget } from "resource:///com/github/Aylur/ags/widget.js";

export function ToggleSwitches(modules: ("network" | "bluetooth")[][]) {
	const mods = modules
		.map(arr => {
			return arr.map(mod => {
				if (mod == "network") return NetworkToggle();
				if (mod == "bluetooth") return BluetoothToggle();
			})
		})
		.map((arr: any) => Widget.Box({ children: arr }))
	return Group([
		...mods,
		WifiSelection(),
		BluetoothDevices()
	])
}
