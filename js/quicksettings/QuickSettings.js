import { Widget } from "../imports.js"
import PopupWindow from "../misc/PopupWindow.js"
import { BluetoothDevices, BluetoothToggle } from "./widgets/Bluetooth.js";
import { NetworkToggle, WifiSelection } from "./widgets/Network.js";
import SpeakerSlider, { AppMixer, SinkSelector } from "./widgets/Volume.js";

const Row = (toggles, menus = []) => Widget.Box({
	class_name: 'row',
	vertical: true,
	children: [
		Widget.Box({
			children: toggles,
		}),
		...menus,
	],
});

export default () => PopupWindow({
	name: 'quicksettings',
	anchor: ['top', 'right'],
	layout: 'top right',
	content: Widget.Box({
		class_name: 'quicksettings',
		vertical: true,
		children: [
			Widget.Box({
				class_name: "slider-box",
				vertical: true,
				children: [
					Row([SpeakerSlider()], [SinkSelector(), AppMixer()]),
				]
			}),
			Row([NetworkToggle(), BluetoothToggle()], [WifiSelection(), BluetoothDevices()])
		],
	}),
});
