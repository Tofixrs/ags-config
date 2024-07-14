import { getBatteryIcon } from "@/lib/utils";
import Battery from "resource:///com/github/Aylur/ags/service/battery.js";
import {
	Box,
	Label,
	LevelBar,
} from "resource:///com/github/Aylur/ags/widget.js";
import { SepDot } from "./sepDot";

export const BatteryBar = () =>
	Box({
		class_names: ["component", "batteryBar"],
		children: [
			Label({
				vpack: "center",
				setup: (self) => {
					self.hook(Battery, () => {
						self.label = getBatteryIcon(Battery.percent, Battery.charging);
					});
				},
			}),
			SepDot(),
			LevelBar({
				class_names: ["bat-bar-content"],
				bar_mode: "continuous",
				widthRequest: 100,
				max_value: 100,
				vpack: "center",
				value: Battery.bind("percent"),
			}),
		],
	});
