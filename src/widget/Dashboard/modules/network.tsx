import { openMenu } from "../Dashboard";
import { ArrowToggleButton } from "../SubMenu";
import Network from "gi://AstalNetwork";
import { bind, execAsync } from "astal";
import { Menu } from "src/widget/SubMenu";
import { Sep, SepDot } from "src/widget/separator";
import { Gtk } from "astal/gtk3";
import icons from "@lib/icons";

export function NetworkToggle() {
	const network = Network.get_default();
	return (
		<ArrowToggleButton
			opened={openMenu}
			name="network"
			className="network module"
			deactivate={() => {
				network.wifi.enabled = false;
			}}
			activate={() => {
				network.wifi.enabled = true;
				network.wifi.scan();
			}}
			activateOnArrow={true}
			condition={bind(network.wifi, "enabled")}
		>
			<icon icon={bind(network.wifi, "iconName")} />
			<label label={bind(network.wifi, "ssid")} truncate maxWidthChars={10} />
		</ArrowToggleButton>
	);
}

export function WifiSelection() {
	const network = Network.get_default();
	return (
		<Menu opened={openMenu()} name="network">
			<box className="menu-title">
				<icon icon={bind(network.wifi, "iconName")} />
				<SepDot />
				<label label="Network Selection" />
			</box>
			<Sep />
			<scrollable
				hscroll={Gtk.PolicyType.NEVER}
				vscroll={Gtk.PolicyType.AUTOMATIC}
				className="menu-contents wifi-select"
				minContentHeight={50}
			>
				<box vertical>
					{bind(network.wifi, "access_points").as((v) =>
						v
							.sort((a, b) => {
								if (network.wifi.activeAccessPoint.bssid == a.bssid) return -1;
								if (network.wifi.activeAccessPoint.bssid == b.bssid) return 1;
								return b.strength - a.strength;
							})
							.map(Wifi),
					)}
				</box>
			</scrollable>
		</Menu>
	);
}

function Wifi(ap: Network.AccessPoint) {
	const network = Network.get_default();
	return (
		<button
			className="menu-list-item"
			onClick={() => {
				execAsync(`nmcli device wifi connect ${ap.bssid}`);
			}}
		>
			<box>
				<icon icon={bind(ap, "iconName")} />
				<label label={ap.ssid} />
				<icon
					icon={icons.ui.tick}
					visible={bind(network.wifi, "activeAccessPoint").as((v) => {
						return v.bssid == ap.bssid;
					})}
				/>
			</box>
		</button>
	);
}
