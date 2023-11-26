import App from "resource:///com/github/Aylur/ags/app.js";
import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import BatService from "resource:///com/github/Aylur/ags/service/battery.js";
import Gtk from "gi://Gtk";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import { getBatteryIcon, getVolumeIcon } from "../../../utils.js";
import { SeperatorDot } from "../TopBar.js";
import Network from "resource:///com/github/Aylur/ags/service/network.js";

export function SysStatus(modules: string[]) {
	const children: Gtk.Widget[] = modules.map(module => {
		if (module == "battery") return Battery();
		if (module == "volume") return Volume();
		if (module == "network") return NetworkIndicator();
	})
		.filter(module => module != undefined)
		.flatMap((module, i, arr) => {
			if (i == arr.length - 1) return module;
			return [module, SeperatorDot()];
		}) as Gtk.Widget[];
	return Widget.Button({
		on_clicked: () => App.toggleWindow("controlcenter"),
		class_names: ["module", "sys-status"],
		child: Widget.Box({
			children
		})
	})
}


const Volume = () => Widget.CircularProgress({
	class_names: ["sys-module", "volume"],
	child: Widget.Icon({
		class_name: "vol-icon",
		connections: [[Audio, self => {
			if (!Audio.speaker) return;
			self.icon = getVolumeIcon(Audio.speaker.volume * 100)
		}]]
	}),
	connections: [[Audio, (self) => {
		if (!Audio.speaker) return;
		self.value = Audio.speaker.volume;
	}]]
})

const Battery = () => Widget.Label({
	class_names: ["battery", "sys-module"],
	connections: [[BatService, self => {
		if (!BatService.available) return self.label = "";
		let icon = getBatteryIcon(BatService.percent, BatService.charging);

		self.label = `${icon} ${BatService.percent.toString()}%`;
	}]]
});

const NetworkIndicator = () => Widget.Icon({
	connections: [[Network, self => {
		const icon = Network[Network.primary!]?.iconName;
		self.icon = icon || '';
		self.visible = icon;
	}]],
});


