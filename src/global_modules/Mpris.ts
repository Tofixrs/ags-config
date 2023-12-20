import Mpris from "resource:///com/github/Aylur/ags/service/mpris.js";
import { Box, Button, Label, Widget } from "resource:///com/github/Aylur/ags/widget.js";
import { MprisPlayer } from "types/service/mpris";
import AgsBox, { BoxProps } from "types/widgets/box";
import GLib from "gi://GLib";
import { ensureDirectory, execAsync, CACHE_DIR, lookUpIcon } from "resource:///com/github/Aylur/ags/utils.js";
import type { Props as LabelProps } from "types/widgets/label";
import { SliderProps } from "types/widgets/slider";
import icons from "../icons.js";
import { StackProps } from "types/widgets/stack.js";
import { Props } from "types/widgets/icon.js";
import { Variable } from "resource:///com/github/Aylur/ags/variable.js";
import Gtk from "gi://Gtk";

const MEDIA_CACHE_PATH = CACHE_DIR + '/media';

export const BlurredCoverArt = (player: MprisPlayer, props: BoxProps) => Box({
	...props,
	class_name: 'blurred-cover',
	connections: [[player, box => {
		const url = player.cover_path;
		if (!url)
			return;

		const blurredPath = MEDIA_CACHE_PATH + '/blurred';
		const blurred = blurredPath +
			url.substring(MEDIA_CACHE_PATH.length);

		if (GLib.file_test(blurred, GLib.FileTest.EXISTS)) {
			box.setCss(`background-image: url("${blurred}")`);
			return;
		}

		ensureDirectory(blurredPath);
		execAsync(['convert', url, '-blur', '0x05', blurred])
			.then(() => box.setCss(`background-image: url("${blurred}")`))
			.catch(err => console.error(err));
	}, 'notify::cover-path']],
});

export const CoverArt = (player: MprisPlayer, props?: BoxProps) => Box({
	...props,
	class_name: 'cover',
	binds: [['css', player, 'cover-path',
		path => `background-image: url("${path}")`]],
});

export const TitleLabel = (player: MprisPlayer) => Box({
	class_name: 'title-box',
	vertical: true,
	connections: [[player, self => {
		const title = player.track_title.match(/.{1,25}/g);
		self.children = title!.map(e => Label(e));
	}]]
});

export const ArtistLabel = (player: MprisPlayer, props?: LabelProps) => Label({
	...props,
	class_name: 'artist',
	binds: [['label', player, 'track-artists', a => a.join(', ') || '']],
});

export const PositionSlider = (player: MprisPlayer, props?: SliderProps) => Widget.Slider({
	...props,
	class_name: 'position-slider',
	draw_value: false,
	on_change: ({ value }) => {
		player.position = player.length * value;
	},
	properties: [['update', slider => {
		if (slider.dragging)
			return;
		slider.visible = player.length > 0;
		if (player.length > 0)
			slider.value = player.position / player.length;
	}]],
	connections: [
		//@ts-ignore
		[player, s => s._update(s)],
		//@ts-ignore
		[player, s => s._update(s), 'position'],
		//@ts-ignore
		[1000, s => s._update(s)],
	],
});

interface PlayerButtonProps {
	player: MprisPlayer,
	items: StackProps["items"],
	onClick: 'shuffle' | 'loop' | 'playPause' | 'previous' | 'next',
	prop: string,
	canProp: string,
	cantValue: any
}

const PlayerButton = ({ player, items, onClick, prop, canProp, cantValue }: PlayerButtonProps) => Widget.Button({
	class_names: ["player-button"],
	vpack: "center",
	child: Widget.Stack({
		items,
		vpack: "center",
		binds: [['shown', player, prop, p => `${p}`]],
	}),
	on_clicked: player[onClick].bind(player),
	binds: [['visible', player, canProp, c => c !== cantValue]],
});

export const PlayPauseButton = (player: MprisPlayer) => PlayerButton({
	player,
	items: [
		['Playing', Widget.Label({
			label: icons.mpris.playing,
			class_names: ["playing"]
		})],
		['Paused', Widget.Label({
			class_name: 'paused',
			label: icons.mpris.paused,
		})],
		['Stopped', Widget.Label({
			class_name: 'stopped',
			label: icons.mpris.stopped,
		})],
	],
	onClick: 'playPause',
	prop: 'play-back-status',
	canProp: 'can-play',
	cantValue: false,
});

export const NextButton = (player: MprisPlayer) => PlayerButton({
	player,
	items: [
		['true', Widget.Label({
			class_name: 'next',
			label: icons.mpris.next,
		})],
	],
	onClick: 'next',
	prop: 'can-go-next',
	canProp: 'can-go-next',
	cantValue: false,
});

export const LoopButton = (player: MprisPlayer) => PlayerButton({
	player,
	items: [
		['None', Widget.Label({
			class_name: 'loop none',
			label: icons.mpris.loop.none,
		})],
		['Track', Widget.Label({
			class_name: 'loop track',
			label: icons.mpris.loop.track,
		})],
		['Playlist', Widget.Label({
			class_name: 'loop playlist',
			label: icons.mpris.loop.playlist,
		})],
	],
	onClick: 'loop',
	prop: 'loop-status',
	canProp: 'loop-status',
	cantValue: null,
});

export const PreviousButton = (player: MprisPlayer) => PlayerButton({
	player,
	items: [
		['true', Widget.Label({
			class_name: 'previous',
			label: icons.mpris.prev,
		})],
	],
	onClick: 'previous',
	prop: 'can-go-prev',
	canProp: 'can-go-prev',
	cantValue: false,
});

export const ShuffleButton = (player: MprisPlayer) => PlayerButton({
	player,
	items: [
		['true', Widget.Label({
			class_name: 'shuffle enabled',
			label: icons.mpris.shuffle.enabled,
		})],
		['false', Widget.Label({
			class_name: 'shuffle disabled',
			label: icons.mpris.shuffle.disabled,
		})],
	],
	onClick: 'shuffle',
	prop: 'shuffle-status',
	canProp: 'shuffle-status',
	cantValue: null,
});

export const PlayerIcon = (player: MprisPlayer, { symbolic = true, ...props }: Props & { symbolic?: boolean } = {}) => Widget.Icon({
	...props,
	class_name: 'player-icon',
	tooltip_text: player.identity || '',
	connections: [[player, icon => {
		const name = `${player.entry}${symbolic ? '-symbolic' : ''}`;
		lookUpIcon(name)
			? icon.icon = name
			: icon.icon = icons.mpris.fallback;
	}]],
});

function lengthStr(length) {
	const min = Math.floor(length / 60);
	const sec = Math.floor(length % 60);
	const sec0 = sec < 10 ? '0' : '';
	return `${min}:${sec0}${sec}`;
}

export const PositionLabel = (player: MprisPlayer) => Widget.Label({
	properties: [['update', (label, time) => {
		player.length > 0
			? label.label = lengthStr(time || player.position)
			: label.visible = !!player;
	}]],
	connections: [
		//@ts-ignore
		[player, (l, time) => l._update(l, time), 'position'],
		//@ts-ignore
		[1000, l => l._update(l)],
	],
});

export const Slash = (player: MprisPlayer) => Widget.Label({
	label: '/',
	connections: [[player, label => {
		label.visible = player.length > 0;
	}]],
});

export const LengthLabel = (player: MprisPlayer) => Widget.Label({
	connections: [[player, label => {
		player.length > 0
			? label.label = lengthStr(player.length)
			: label.visible = !!player;
	}]],
});

const Footer = (player: MprisPlayer) => Widget.CenterBox({
	class_name: 'footer-box',
	start_widget:
		Widget.Box({
			class_name: 'position',
			children: [
				PositionLabel(player),
				Slash(player),
				LengthLabel(player),
			],
		}),
	center_widget:
		Widget.Box({
			class_name: 'controls',
			children: [
				ShuffleButton(player),
				PreviousButton(player),
				PlayPauseButton(player),
				NextButton(player),
				LoopButton(player),
			],
		}),
	end_widget:
		PlayerIcon(player, {
			symbolic: false,
			hexpand: true,
			hpack: 'end',
		}),
});


const TrackInfo = (player: MprisPlayer) => Box({
	children: [
		CoverArt(player),
		Box({
			class_names: ["title-artist"],
			vertical: true,
			children: [TitleLabel(player), ArtistLabel(player)]
		})
	]
})

const selectedBus = new Variable("");
export default () => {
	return Box({
		vertical: false,
		class_names: ["mpris"],
		connections: [
			[selectedBus, self => {
				const playerIndex = Mpris.players.findIndex(player => player.bus_name == selectedBus.value);
				const player = Mpris.players[playerIndex];
				if (!player) return self.children = [];
				self.children = [
					BlurredCoverArt(player, {
						class_names: ["player", player.name],
						children: [
							Button({
								label: "-",
								vpack: "center",
								hpack: "center",
								class_names: ["mpris-index"],
								connections: [[Mpris, self => self.visible = Mpris.players[playerIndex - 1] != undefined]],
								on_clicked: () => selectedBus.value = Mpris.players[playerIndex - 1].bus_name
							}),
							Box({
								vertical: true,
								children: [
									TrackInfo(player),
									PositionSlider(player),
									Footer(player)
								]
							}),
							Button({
								label: "+",
								vpack: "center",
								hpack: "center",
								class_names: ["mpris-index"],
								connections: [[Mpris, self => self.visible = Mpris.players[playerIndex + 1] != undefined]],
								on_clicked: () => selectedBus.value = Mpris.players[playerIndex + 1].bus_name
							})
						]
					})
				]
			}],
			[Mpris, self => {
				self.visible = Mpris.players.length > 0;
				if (!Mpris.players.find(e => e.bus_name == selectedBus.value)) selectedBus.value = Mpris.players[0].bus_name;
				if (!self.visible) {
					selectedBus.value = ""
				} else if (selectedBus.value == "") {
					selectedBus.value = Mpris.players[0].bus_name;
				};
			}]
		]
	})
}
