import Audio, {
	Stream,
} from "resource:///com/github/Aylur/ags/service/audio.js";
import { Variable } from "resource:///com/github/Aylur/ags/variable.js";
import { Arrow, Menu } from "../SubMenu.js";
import { VolumeIndicator } from "../../../globalWidgets/volume.js";
import { fontIcon } from "../../../globalWidgets/icons.js";
import icons from "../../../icons.js";
import Gtk from "gi://Gtk?version=3.0";
import { getAudioTypeIcon } from "../../../utils.js";
import { lookUpIcon } from "resource:///com/github/Aylur/ags/utils.js";

const apps = new Variable(0);

export function Volume() {
	return Widget.Box({
		vexpand: false,
		class_names: ["module", "volume"],
		vertical: true,
		children: [
			Widget.Box({
				children: [
					VolumeIndicator(),
					VolumeSlider(),
					Arrow("app-mixer"),
					Arrow("sink-selector"),
				],
			}),
			AppMixer(),
			SinkSelector(),
		],
	});
}

function AppMixer() {
	return Menu("app-mixer", [
		Widget.Box({
			class_names: ["menu-title"],
			children: [
				fontIcon(icons.audio.misc.mixer),
				Widget.Separator({ vpack: "center" }),
				Widget.Label("App Mixer"),
			],
		}),
		Widget.Separator({ orientation: Gtk.Orientation.HORIZONTAL }),
		Widget.Scrollable({
			hscroll: "never",
			vscroll: "automatic",
			class_names: ["menu-contents"],
			vexpand: true,
			min_content_height: 25,
			vpack: "end",
			child: Widget.Box({
				vertical: true,
				vexpand: true,
			}).bind("children", Audio, "apps", (a) => {
				const b = a.filter(
					(steam) => steam.description != "AudioCallbackDriver",
				);
				apps.setValue(b.length);
				return b.map(MixerItem);
			}),
		}).hook(
			Audio,
			(self) => (self["min_content_height"] = Math.min(300, apps.value * 47.5)),
		),
	]);
}

const SinkItem = (stream: Stream) =>
	Widget.Button({
		hexpand: true,
		on_clicked: () => (Audio.speaker = stream),
		class_names: ["menu-list-item"],
		child: Widget.Box({
			children: [
				Widget.Icon({
					icon: getAudioTypeIcon(stream.icon_name || ""),
					tooltip_text: stream.icon_name,
				}),
				Widget.Label(
					(stream.description || "").split(" ").slice(0, 4).join(" "),
				),
				Widget.Icon({
					icon: icons.ui.tick,
					hexpand: true,
					hpack: "end",
				}).bind("visible", Audio, "speaker", (s) => s == stream),
			],
		}),
	});

function SinkSelector() {
	return Menu("sink-selector", [
		Widget.Box({
			class_names: ["menu-title"],
			children: [
				fontIcon(icons.audio.misc.mixer),
				Widget.Separator({ vpack: "center" }),
				Widget.Label("Sink Selector"),
			],
		}),
		Widget.Separator({ orientation: Gtk.Orientation.HORIZONTAL }),
		Widget.Box({
			vertical: true,
		}).bind("children", Audio, "speakers", (s) => s.map(SinkItem)),
	]);
}

const MixerItem = (stream: Stream) =>
	Widget.Box({
		hexpand: true,
		class_name: "menu-list-item",
		child: Widget.Box({
			vertical: true,
			children: [
				Widget.Box({
					class_name: "title-box",
					children: [
						Widget.Icon({})
							.bind("tooltip_text", stream, "name")
							.bind("icon", stream, "name", (n) => {
								return lookUpIcon(n!) ? n! : icons.mpris.fallback;
							}),
						Widget.Label({
							xalign: 0,
							truncate: "end",
						}).bind("label", stream, "description"),
						Widget.Box({ hexpand: true }),
						Widget.Label({
							xalign: 1,
						}).bind("label", stream, "volume", (v) => {
							return `${Math.floor(v * 100)}%`;
						}),
					],
				}),
				Widget.Slider({
					class_name: "mixer-slider",
					hexpand: true,
					draw_value: false,
					on_change: ({ value }) => (stream.volume = value),
				}).bind("value", stream, "volume"),
			],
		}),
	});

function VolumeSlider() {
	return Widget.Slider({
		class_names: ["vol-slider"],
		hexpand: true,
		draw_value: false,
		min: 0,
		max: 100,
		on_change: ({ value }) => (Audio.speaker!.volume = value / 100),
	}).hook(
		Audio,
		(self) => {
			if (!Audio.speaker) return;
			self.value = Audio.speaker.volume * 100;
		},
		"speaker-changed",
	);
}
