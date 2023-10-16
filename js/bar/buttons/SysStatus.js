import { PanelButton } from "../PanelButton.js";
import { Widget, Battery, Network, Audio, Bluetooth, App } from "../../imports.js";
import icons from "../../icons.js";

export const SysStatus = () => PanelButton({
	className: "sys-stat",
	onClicked: () => App.toggleWindow("quicksettings"),
	content: Widget.Box({
		children: [
			AudioIndicator(),
			MicrophoneMuteIndicator(),
			BluetoothIndicator(),
			NetworkIndicator(),
			BatteryProgress(),
		]
	})
})

const BatteryProgress = () => Widget.Label({
	className: "batteryIndicator",
	connections: [[Battery, self => {
		if (!Battery.available) return self.label = "";
		let icon = getBatteryIcon(Battery.percent, Battery.charging);

		self.label = `${icon} ${Battery.percent.toString()}%`;
	}]]
});

const NetworkIndicator = () => Widget.Stack({
	items: [
		['wifi', Widget.Icon({
			connections: [[Network, icon => {
				icon.icon = Network.wifi?.iconName;
			}]],
		})],
		['wired', Widget.Icon({
			connections: [[Network, icon => {
				icon.icon = Network.wired?.iconName;
			}]],
		})],
	],
	binds: [['shown', Network, 'primary']],
});

const AudioIndicator = () => Widget.Icon({
	connections: [[Audio, icon => {
		if (!Audio.speaker)
			return;

		const { muted, low, medium, high, overamplified } = icons.audio.volume;
		if (Audio.speaker.stream.isMuted || Audio.speaker.isMuted)
			return icon.icon = muted;

		icon.icon = [[101, overamplified], [67, high], [34, medium], [1, low], [0, muted]]
			.find(([threshold]) => threshold <= Audio.speaker.volume * 100)[1];
	}, 'speaker-changed']],
});

const MicrophoneMuteIndicator = () => Widget.Icon({
	icon: icons.audio.mic.muted,
	connections: [[Audio, icon => {
		icon.visible = Audio.microphone?.stream.isMuted || Audio.microphone.isMuted;
	}, 'microphone-changed']],
});

const BluetoothIndicator = () => Widget.Icon({
	className: 'bluetooth',
	icon: icons.bluetooth.enabled,
	binds: [['visible', Bluetooth, 'enabled']],
});

function getBatteryIcon(batteryPercent, charging) {
	let floorTen = Math.floor(batteryPercent / 10) * 10; // 45 -> 40 29 -> 20 34 -> 30

	if (!charging) {
		switch (floorTen) {
			case 0: return "󰂎";
			case 10: return "󰁺";
			case 20: return "󰁻";
			case 30: return "󰁼";
			case 40: return "󰁽";
			case 50: return "󰁾";
			case 60: return "󰁿";
			case 70: return "󰂀";
			case 80: return "󰂁";
			case 90: return "󰂂";
			case 100: return "󰁹";
		}
	} else {
		switch (floorTen) {
			case 0: return "󰢜";
			case 10: return "󰂆";
			case 20: return "󰂆";
			case 30: return "󰂇";
			case 40: return "󰂈";
			case 50: return "󰢝";
			case 60: return "󰂉";
			case 70: return "󰢞";
			case 80: return "󰂊";
			case 90: return "󰂋";
			case 100: return "󰂅";
		}
	}
}
