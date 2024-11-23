import { openMenu } from "../Dashboard";
import { ArrowToggleButton } from "../SubMenu";
import { bind, execAsync } from "astal";
import { Menu } from "src/widget/SubMenu";
import { Sep, SepDot } from "src/widget/separator";
import { Gtk } from "astal/gtk3";
import icons from "@lib/icons";
import Bluetooth from "gi://AstalBluetooth";

export function BluetoothToggle() {
	const bluetooth = Bluetooth.get_default();
	return (
		<ArrowToggleButton
			opened={openMenu}
			name="bluetooth"
			className="network module"
			deactivate={() => {
				bluetooth.adapter.powered = false;
			}}
			activate={() => {
				bluetooth.adapter.powered = true;
			}}
			activateOnArrow={true}
			condition={bind(bluetooth, "isPowered")}
		>
			<icon
				icon={bind(bluetooth, "isPowered").as((v) => {
					return v ? icons.bluetooth.enabled : icons.bluetooth.disabled;
				})}
			/>
			<label
				label={bind(bluetooth, "devices").as(
					(v) => v.find((v) => v.connected)?.name || "Not connected",
				)}
				truncate
				maxWidthChars={20}
			/>
		</ArrowToggleButton>
	);
}

export function BluetoothSelection() {
	const bluetooth = Bluetooth.get_default();
	return (
		<Menu opened={openMenu()} name="bluetooth">
			<box className="menu-title">
				<icon icon={icons.bluetooth.enabled} />
				<SepDot />
				<label label="Bluetooth Selection" />
			</box>
			<Sep />
			<scrollable
				hscroll={Gtk.PolicyType.NEVER}
				vscroll={Gtk.PolicyType.AUTOMATIC}
				className="menu-contents wifi-select"
				minContentHeight={50}
			>
				<box vertical>
					{bind(bluetooth, "devices").as((v) => v.map(Deivce))}
				</box>
			</scrollable>
		</Menu>
	);
}

function Deivce(ap: Bluetooth.Device) {
	return (
		<button
			className="menu-list-item"
			onClick={() => {
				if (ap.connected) {
					ap.disconnect_device(null);
				} else {
					if (!ap.paired) ap.pair();
					ap.connect_device(null);
				}
			}}
		>
			<box>
				<label label={ap.name} />
				<icon icon={icons.ui.tick} visible={bind(ap, "connected")} />
			</box>
		</button>
	);
}
