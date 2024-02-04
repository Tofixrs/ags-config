import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import { getBatteryIcon, getVolumeIcon } from "../../../utils.js";
import BatService from "resource:///com/github/Aylur/ags/service/battery.js";
import Network from "resource:///com/github/Aylur/ags/service/network.js";

export default () =>
	Widget.Box({
		class_names: ["bar-module", "sys-status"],
		children: [Battery(), Volume(), NetworkIndicator()],
	});

const Volume = () =>
	Widget.CircularProgress({
		class_names: ["sys-module", "volume"],
		child: Widget.Icon({
			class_name: "vol-icon",
		}).hook(Audio, (self) => {
			if (!Audio.speaker) return;
			self.icon = getVolumeIcon(Audio.speaker.volume * 100);
		}),
	}).hook(Audio, (self) => {
		if (!Audio.speaker) return;
		self.value = Audio.speaker.volume;
	});

const Battery = () =>
	Widget.Label({
		class_names: ["battery", "sys-module"],
	}).hook(BatService, (self) => {
		if (!BatService.available) return (self.label = "");
		const icon = getBatteryIcon(BatService.percent, BatService.charging);

		self.label = `${icon} ${BatService.percent.toString()}%`;
	});

const NetworkIndicator = () =>
	Widget.Icon({
		class_names: ["network", "sys-module"],
	}).hook(Network, (self) => {
		const icon = Network[Network?.primary]?.icon_name;
		self.icon = icon || "";
		self.visible = icon ? true : false;
	});
