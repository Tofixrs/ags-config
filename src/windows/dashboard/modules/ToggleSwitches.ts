import { NetworkToggle, WifiSelection } from "./network.js";
import { Group } from "../dashboard.js";
import { BluetoothDevices, BluetoothToggle } from "./Bluetooth.js";

export function ToggleSwitches() {
	return Group([
		Widget.Box({
			children: [NetworkToggle(), BluetoothToggle()],
		}),
		WifiSelection(),
		BluetoothDevices(),
	]);
}
