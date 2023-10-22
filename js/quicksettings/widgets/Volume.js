import { Widget, Audio, Utils } from "../../imports.js";
import { getAudioTypeIcon } from "../../utils.js";
import { Arrow, Menu, opened } from "../ToggleButton.js";
import icons from "../../icons.js";
import { Separator } from "../../misc/Separator.js";
import { FontIcon } from "../../misc/OsIcon.js"

const VolumeSlider = () => Widget.Slider({
	hexpand: true,
	drawValue: false,
	min: 0,
	max: 150,
	onChange: ({ value }) => Audio.speaker.volume = value / 100,
	connections: [[Audio, self => {
		// Audio.speaker and Audio.microphone can be undefined
		// to workaround this use the ? chain operator
		self.value = Audio.speaker?.volume * 100 || 0;
	}, 'speaker-changed']],
});

const TypeIndicator = () => Widget.Button({
	onClicked: () => Audio.speaker.isMuted = !Audio.speaker.isMuted,
	child: Widget.Icon({
		connections: [[Audio, icon => {
			if (!Audio.speaker)
				return;

			icon.icon = getAudioTypeIcon(Audio.speaker.iconName);
			icon.tooltipText = `Volume ${Math.floor(Audio.speaker.volume * 100)}%`;
		}, 'speaker-changed']],
	}),
});


const SettingsButton = () => Widget.Button({
	onClicked: 'pavucontrol',
	hexpand: true,
	child: Widget.Box({
		children: [
			Widget.Icon(icons.settings),
			Widget.Label('Settings'),
		],
	}),
});

const MixerItem = stream => Widget.Box({
	hexpand: true,
	className: 'mixer-item',
	child:
		Widget.Box({
			vertical: true,
			children: [
				Widget.Box({
					className: "title-box",
					children: [
						Widget.Icon({
							binds: [['tooltipText', stream, 'name']],
							connections: [[stream, icon => {
								icon.icon = Utils.lookUpIcon(stream.name)
									? stream.name
									: icons.mpris.fallback;
							}]],
						}),
						Separator(),
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
					className: "mixer-slider",
					hexpand: true,
					drawValue: false,
					binds: [['value', stream, 'volume']],
					onChange: ({ value }) => stream.volume = value,
				}),
			],
		}),
});

const SinkItem = stream => Widget.Button({
	hexpand: true,
	className: 'sink-item',
	onClicked: () => { Audio.speaker = stream; opened.value = "" },
	child: Widget.Box({
		children: [
			Widget.Icon({
				icon: getAudioTypeIcon(stream.iconName),
				tooltipText: stream.iconName,
			}),
			Widget.Label(stream.description.split(' ').slice(0, 4).join(' ')),
			Widget.Icon({
				icon: icons.tick,
				hexpand: true,
				halign: 'end',
				connections: [['draw', icon => {
					icon.visible = Audio.speaker === stream;
				}]],
			}),
		],
	}),
});

export const SinkSelector = () => Menu({
	name: 'sink-selector',
	icon: Widget.Icon(icons.audio.type.headset),
	title: Widget.Label('Sink Selector'),
	content: Widget.Box({
		className: 'sink-selector',
		vertical: true,
		children: [
			Widget.Box({
				vertical: true,
				binds: [['children', Audio, 'speakers', s => s.map(SinkItem)]],
			}),
			Separator({ orientation: 'horizontal' }),
			// SettingsButton(),
		],
	}),
});

export const AppMixer = () => Menu({
	name: 'app-mixer',
	icon: FontIcon({ icon: icons.audio.mixer }),
	title: Widget.Label('App Mixer'),
	content: Widget.Box({
		className: 'app-mixer',
		vertical: true,
		children: [
			Widget.Box({
				vertical: true,
				binds: [['children', Audio, 'apps', a => a.filter(a => a.description != "AudioCallbackDriver").map(MixerItem)]],
			}),
			Separator({ orientation: 'horizontal' }),
			// SettingsButton(),
		],
	}),
});

export default () => Widget.Box({
	className: "slider",
	children: [
		TypeIndicator(),
		VolumeSlider(),
		Arrow("sink-selector"),
		Widget.Box({
			child: Arrow('app-mixer'),
			connections: [[Audio, box => {
				box.visible = Audio.apps.length > 0;
			}]]
		}),
	]
})
