import { BluetoothSelection, BluetoothToggle } from "./bluetooth";
import { NetworkToggle, WifiSelection } from "./network";

export function ToggleSwitch() {
	return (
		<box hexpand vertical>
			<box>
				<NetworkToggle />
				<BluetoothToggle />
			</box>
			<box vertical>
				<WifiSelection />
				<BluetoothSelection />
			</box>
		</box>
	);
}
