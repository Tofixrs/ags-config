import Widget from "resource:///com/github/Aylur/ags/widget.js";
import icons from "../icons.js";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import { utils } from "../lib/index.js";

export function VolumeIndicator() {
	return Widget.Button({
		on_clicked: () => (Audio.speaker!.is_muted = !Audio.speaker?.is_muted),
		class_names: ["vol-indicator"],
		child: Widget.Icon({
			icon: icons.audio.volume.medium,
		}).hook(
			Audio,
			(self) => {
				if (!Audio.speaker) return;

				if (Audio.speaker.is_muted)
					return (self.icon = icons.audio.volume.muted);

				self.icon = utils.getVolumeIcon(Audio.speaker.volume * 100);
			},
			"speaker-changed",
		),
	});
}
