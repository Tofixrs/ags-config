import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import { VolumeIndicator } from "../../../global_modules/volume.js";
import { Arrow, Menu } from "../SubMenu.js";
import { fontIcon } from "../../../global_modules/icons.js";
import icons from "../../../icons.js";
import Gtk from "gi://Gtk";
import type { Stream } from "types/service/audio.js";
import { lookUpIcon } from "resource:///com/github/Aylur/ags/utils.js";
import { Variable } from "resource:///com/github/Aylur/ags/variable.js";
import { getAudioTypeIcon } from "../../../utils.js"

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
					Arrow('app-mixer'),
					Arrow("sink-selector"),
				]
			}),
			AppMixer(),
			SinkSelector()
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
			]
		}),
		Widget.Separator({ orientation: Gtk.Orientation.HORIZONTAL }),
		Widget.Scrollable({
			hscroll: "never",
			vscroll: "automatic",
			class_names: ["menu-contents"],
			vexpand: true,
			"min_content_height": 25,
			vpack: "end",
			connections: [[Audio, self => {
				self["min_content_height"] = Math.min(300, apps.value * 55);
			}]],
			child: Widget.Box({
				vertical: true,
				vexpand: true,
				binds: [['children', Audio, 'apps', a => {
					const b = a.filter(steam => steam.description != "AudioCallbackDriver");
					apps.setValue(b.length);
					return b.map(MixerItem)
				}]]
			})
		})
	])
}

const SinkItem = (stream: Stream) => Widget.Button({
	hexpand: true,
	on_clicked: () => Audio.speaker = stream,
	class_names: ["menu-list-item"],
	child: Widget.Box({
		children: [
			Widget.Icon({
				icon: getAudioTypeIcon(stream.icon_name || ''),
				tooltip_text: stream.icon_name,
			}),
			Widget.Label((stream.description || '').split(' ').slice(0, 4).join(' ')),
			Widget.Icon({
				icon: icons.ui.tick,
				hexpand: true,
				hpack: 'end',
				binds: [['visible', Audio, 'speaker', s => s === stream]],
			}),
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
			]
		}),
		Widget.Separator({ orientation: Gtk.Orientation.HORIZONTAL }),
		Widget.Box({
			vertical: true,
			binds: [['children', Audio, 'speakers', s => s.map(SinkItem)]],
		}),
	])
}


const MixerItem = (stream: Stream) => Widget.Box({
	hexpand: true,
	class_name: 'menu-list-item',
	child:
		Widget.Box({
			vertical: true,
			children: [
				Widget.Box({
					class_name: "title-box",
					children: [
						Widget.Icon({
							binds: [['tooltipText', stream, 'name']],
							connections: [[stream, icon => {
								icon.icon = lookUpIcon(stream.name!)
									? stream.name!
									: icons.mpris.fallback;
							}]],
						}),
						Widget.Label({
							xalign: 0,
							truncate: 'end',
							binds: [['label', stream, 'description']],
						}),
						Widget.Box({ hexpand: true }),
						Widget.Label({
							xalign: 1,
							connections: [[stream, l => {
								l.label = `${Math.floor(stream.volume * 100)}%`;
							}]],
						}),
					]
				}),
				Widget.Slider({
					class_name: "mixer-slider",
					hexpand: true,
					draw_value: false,
					binds: [['value', stream, 'volume']],
					on_change: ({ value }) => stream.volume = value,
				}),
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
		on_change: ({ value }) => Audio.speaker!.volume = value / 100,
		connections: [[Audio, self => {
			if (!Audio.speaker) return;
			self.value = Audio.speaker.volume * 100;
		}, "speaker-changed"]]
	})
}

