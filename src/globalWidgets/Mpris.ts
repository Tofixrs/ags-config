import Mpris from "resource:///com/github/Aylur/ags/service/mpris.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { MprisPlayer } from "types/service/mpris";
import { BoxProps } from "types/widgets/box";
import type { LabelProps } from "types/widgets/label";
import { SliderProps } from "types/widgets/slider";
import icons from "../icons.js";
import { StackProps } from "types/widgets/stack.js";
import { IconProps } from "types/widgets/icon.js";
import { Variable } from "resource:///com/github/Aylur/ags/variable.js";
import { utils } from "../lib/index.js";
import Gio20 from "gi://Gio";
import GLib from "types/@girs/glib-2.0/glib-2.0.js";

export const BlurredCoverArt = (player: MprisPlayer, props?: BoxProps) =>
	Widget.Box({
		...props,
		class_name: "blurred-cover",
		setup: (self) =>
			self.hook(player, (box) => {
				if (player.cover_path) {
					utils.blurImg(player.cover_path).then((img) => {
						img && box.setCss(`background-image: url("${img}")`);
					});
				}
				if (player.metadata["mpris:artUrl"]) {
					const timestamp = new Date().getTime();
					fetchArt(player.metadata["mpris:artUrl"], timestamp.toString())
						.then((file) => utils.blurImg(file.get_path() || ""))
						.then((img) => {
							print(img);
							img && box.setCss(`background-image: url("${img}")`);
						});
				}
			}),
	});

async function fetchArt(url: string, name: string) {
	const res = await Utils.fetch(url);
	const bytes = await res.gBytes();

	const dir = Utils.CACHE_DIR + "/media";
	const file = Gio20.File.new_for_path(`${dir}/${name}`);

	return new Promise<Gio20.File>((resolve, reject) => {
		file.replace_contents_bytes_async(
			bytes || new GLib.Bytes(null),
			null,
			false,
			Gio20.FileCreateFlags.REPLACE_DESTINATION,
			null,
			(_, res) => {
				try {
					file.replace_contents_finish(res);
					resolve(file);
				} catch (error) {
					reject(error);
				}
			},
		);
	});
}

export const CoverArt = (player: MprisPlayer, props?: BoxProps) =>
	Widget.Box({
		...props,
		class_name: "cover",
		css: player
			.bind("cover_path")
			.transform((p) => `background-image: url("${p}")`),
	});

export const TitleLabel = (player: MprisPlayer, props?: LabelProps) =>
	Widget.Label({
		...props,
		class_name: "title",
		wrap: true,
		max_width_chars: 50,
		label: player.bind("track_title"),
	});

export const ArtistLabel = (player: MprisPlayer, props?: LabelProps) =>
	Widget.Label({
		...props,
		class_name: "artist",
		label: player.bind("track_artists").transform((a) => a.join(", ") || ""),
	});

export const PositionSlider = (player: MprisPlayer, props?: SliderProps) =>
	Widget.Slider({
		...props,
		class_name: "position-slider",
		draw_value: false,
		on_change: ({ value }) => (player.position = player.length * value),
		setup: (self) => {
			const update = () => {
				if (self.dragging) return;

				self.visible = player.length > 0;
				if (player.length > 0) self.value = player.position / player.length;
			};
			self.hook(player, update);
			self.hook(player, update, "position");
			self.poll(1000, update);
		},
	});

function lengthStr(length: number) {
	const min = Math.floor(length / 60);
	const sec = Math.floor(length % 60);
	const sec0 = sec < 10 ? "0" : "";
	return `${min}:${sec0}${sec}`;
}

export const PositionLabel = (player: MprisPlayer) =>
	Widget.Label({
		setup: (self) => {
			const update = (time?: number) => {
				player.length > 0
					? (self.label = lengthStr(time || player.position))
					: (self.visible = !!player);
			};

			self.hook(player, (_, time) => update(time), "position");
			self.poll(1000, () => update());
		},
	});

export const LengthLabel = (player: MprisPlayer) =>
	Widget.Label({
		label: player.bind("length").transform((l) => lengthStr(l)),
		visible: player.bind("length").transform((l) => l > 0),
	});

export const Slash = (player: MprisPlayer) =>
	Widget.Label({
		label: "/",
		visible: player.bind("length").transform((l) => l > 0),
	});

interface PlayerButtonProps {
	player: MprisPlayer;
	children: StackProps["children"];
	onClick: "shuffle" | "loop" | "playPause" | "previous" | "next";
	prop: string;
	canProp: string;
	/*eslint-disable*/
	cantValue: any;
}

const PlayerButton = ({
	player,
	children,
	onClick,
	prop,
	canProp,
	cantValue,
}: PlayerButtonProps) =>
	Widget.Button({
		child: Widget.Stack({ children }).bind(
			"shown",
			player,
			//@ts-expect-error types :D
			prop,
			(p) => `${p}`,
		),
		on_clicked: () => player[onClick](),
		//@ts-expect-error types :D
		visible: player.bind(canProp).transform((c) => c !== cantValue),
	});

export const ShuffleButton = (player: MprisPlayer) =>
	PlayerButton({
		player,
		children: {
			true: Widget.Label({
				class_name: "shuffle enabled",
				label: icons.mpris.shuffle.enabled,
			}),
			false: Widget.Label({
				class_name: "shuffle disabled",
				label: icons.mpris.shuffle.disabled,
			}),
		},
		onClick: "shuffle",
		prop: "shuffle-status",
		canProp: "shuffle-status",
		cantValue: null,
	});

export const LoopButton = (player: MprisPlayer) =>
	PlayerButton({
		player,
		children: {
			None: Widget.Label({
				class_name: "loop none",
				label: icons.mpris.loop.none,
			}),
			Track: Widget.Label({
				class_name: "loop track",
				label: icons.mpris.loop.track,
			}),
			Playlist: Widget.Label({
				class_name: "loop playlist",
				label: icons.mpris.loop.playlist,
			}),
		},
		onClick: "loop",
		prop: "loop-status",
		canProp: "loop-status",
		cantValue: null,
	});

export const PlayPauseButton = (player: MprisPlayer) =>
	PlayerButton({
		player,
		children: {
			Playing: Widget.Label({
				class_name: "playing",
				label: icons.mpris.playing,
			}),
			Paused: Widget.Label({
				class_name: "paused",
				label: icons.mpris.paused,
			}),
			Stopped: Widget.Label({
				class_name: "stopped",
				label: icons.mpris.stopped,
			}),
		},
		onClick: "playPause",
		prop: "play-back-status",
		canProp: "can-play",
		cantValue: false,
	});

export const PreviousButton = (player: MprisPlayer) =>
	PlayerButton({
		player,
		children: {
			true: Widget.Label({
				class_name: "previous",
				label: icons.mpris.prev,
			}),
		},
		onClick: "previous",
		prop: "can-go-prev",
		canProp: "can-go-prev",
		cantValue: false,
	});

export const NextButton = (player: MprisPlayer) =>
	PlayerButton({
		player,
		children: {
			true: Widget.Label({
				class_name: "next",
				label: icons.mpris.next,
			}),
		},
		onClick: "next",
		prop: "can-go-next",
		canProp: "can-go-next",
		cantValue: false,
	});

type PlayerIconProps = IconProps<object> & { symbolic?: boolean };

export const PlayerIcon = (
	player: MprisPlayer,
	{ symbolic = true, ...props }: PlayerIconProps = {},
) =>
	Widget.Icon({
		...props,
		class_name: "player-icon",
		tooltip_text: player.identity || "",
		setup: (self) =>
			self.hook(player, (icon) => {
				const name = `${player.entry}${symbolic ? "-symbolic" : ""}`;
				Utils.lookUpIcon(name)
					? (icon.icon = name)
					: (icon.icon = icons.mpris.fallback);
			}),
	});

const Footer = (player: MprisPlayer) =>
	Widget.CenterBox({
		class_name: "footer-box",
		start_widget: Widget.Box({
			class_name: "position",
			children: [PositionLabel(player), Slash(player), LengthLabel(player)],
		}),
		center_widget: Widget.Box({
			class_name: "controls",
			children: [
				ShuffleButton(player),
				PreviousButton(player),
				PlayPauseButton(player),
				NextButton(player),
				LoopButton(player),
			],
		}),
		end_widget: PlayerIcon(player, {
			symbolic: false,
			hexpand: true,
			hpack: "end",
		}),
	});

const TrackInfo = (player: MprisPlayer) =>
	Widget.Box({
		children: [
			CoverArt(player),
			Widget.Box({
				class_names: ["title-artist"],
				vertical: true,
				children: [TitleLabel(player), ArtistLabel(player)],
			}),
		],
	});

const selectedBus = new Variable("");
export default () => {
	return Widget.Box({
		vertical: false,
		class_names: ["mpris"],
	})
		.hook(selectedBus, (self) => {
			const playerIndex = Mpris.players.findIndex(
				(player) => player.bus_name == selectedBus.value,
			);
			const player = Mpris.players[playerIndex];
			if (!player) return (self.children = []);

			self.children = [playerW(player, playerIndex)];
		})
		.hook(Mpris, (self) => {
			self.visible = Mpris.players.length > 0;

			if (!Mpris.players.find((e) => e.bus_name == selectedBus.value))
				selectedBus.value = Mpris.players[0]?.bus_name;

			if (!self.visible) {
				selectedBus.value = "";
			} else if (selectedBus.value == "") {
				selectedBus.value = Mpris.players[0].bus_name;
			}
		});
};

const playerW = (player: MprisPlayer, playerIndex: number) =>
	BlurredCoverArt(player, {
		class_names: ["player", player.name],
		children: [
			Widget.Button({
				label: "-",
				vpack: "center",
				hpack: "center",
				class_names: ["mpris-index"],
				on_clicked: () =>
					(selectedBus.value = Mpris.players[playerIndex - 1].bus_name),
			}).hook(
				Mpris,
				(self) => (self.visible = Mpris.players[playerIndex - 1] != undefined),
			),
			Widget.Box({
				vertical: true,
				children: [TrackInfo(player), PositionSlider(player), Footer(player)],
			}),
			Widget.Button({
				label: "+",
				vpack: "center",
				hpack: "center",
				class_names: ["mpris-index"],
				on_clicked: () =>
					(selectedBus.value = Mpris.players[playerIndex + 1].bus_name),
			}).hook(
				Mpris,
				(self) => (self.visible = Mpris.players[playerIndex + 1] != undefined),
			),
		],
	});
