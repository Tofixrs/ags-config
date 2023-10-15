import { PanelButton } from "../PanelButton.js";
import { Widget, Battery } from "../../imports.js";

export const SysStatus = () => PanelButton({
	name: "sysstatus",
	content: Widget.Box({
		children: [
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
