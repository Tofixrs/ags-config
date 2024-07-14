import {
	Box,
	CircularProgress,
	Icon,
} from "resource:///com/github/Aylur/ags/widget.js";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import { getVolumeIcon } from "@lib/utils";
import Network from "resource:///com/github/Aylur/ags/service/network.js";

export const SysIndicators = () =>
	Box({
		class_names: ["component", "sysIndicators"],
		children: [VolumeIndicator(), NetworkIndicator()],
	});

const VolumeIndicator = () =>
	Box({
		child: CircularProgress({
			class_names: ["audio"],
			value: Audio.speaker.bind("volume"),
			child: Icon({
				class_names: ["icon"],
				icon: Audio.speaker.bind("volume").as((v) => getVolumeIcon(v * 100)),
			}),
		}),
	});

const NetworkIndicator = () =>
	Widget.Icon({
		class_names: ["network"],
	}).hook(Network, (self) => {
		const icon = Network[Network?.primary || ""]?.icon_name;
		self.icon = icon || "";
		self.visible = icon ? true : false;
	});
