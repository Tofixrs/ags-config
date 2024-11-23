import Wp from "gi://AstalWp";
import { bind } from "astal";
import { Arrow, Menu } from "src/widget/SubMenu";
import { openMenu } from "../Dashboard";
import { Sep, SepDot } from "src/widget/separator";
import icons from "@lib/icons";
import { Astal, Gtk } from "astal/gtk3";

export function Volume() {
	return (
		<box hexpand className="volume" vertical>
			<box>
				<MuteButton />
				<VolumeSlider />
				<Arrow name="app-mixer" opened={openMenu} />
				<Arrow name="sink-selector" opened={openMenu} />
			</box>
			<box vertical>
				<AppMixer />
				<SinkSelector />
			</box>
		</box>
	);
}

function VolumeSlider() {
	const speaker = Wp.get_default()!.audio.defaultSpeaker;
	return (
		<slider
			className="mainSlider vol-slider"
			hexpand
			draw_value={false}
			value={bind(speaker, "volume")}
			setup={(self) => {
				self.connect("dragged", () => {
					speaker.volume = self.value;
				});
			}}
		/>
	);
}

function MuteButton() {
	const speaker = Wp.get_default()!.audio.defaultSpeaker;
	return (
		<button
			className="muteBtn"
			onClick={() => {
				speaker.mute = !speaker.mute;
			}}
		>
			<icon icon={bind(speaker, "volumeIcon")} />
		</button>
	);
}

function SinkSelector() {
	const wp = Wp.get_default()!.audio;
	return (
		<Menu name="sink-selector" opened={openMenu()}>
			<box className="menu-header">
				<label label={icons.audio.misc.mixer} />
				<SepDot />
				<label label="Sink Selector" />
			</box>
			<Sep />
			<scrollable
				hscroll={Gtk.PolicyType.NEVER}
				vscroll={Gtk.PolicyType.AUTOMATIC}
				minContentHeight={25}
			>
				<box vertical>
					{bind(wp, "speakers").as((v) =>
						v.map((v) => {
							return <SinkItem endpoint={v} />;
						}),
					)}
				</box>
			</scrollable>
		</Menu>
	);
}

function AppMixer() {
	const wp = Wp.get_default()!;
	return (
		<Menu name="app-mixer" opened={openMenu()}>
			<box className="menu-header">
				<label label={icons.audio.misc.mixer} />
				<SepDot />
				<label label="App Mixer" />
			</box>
			<Sep />
			<scrollable
				hscroll={Gtk.PolicyType.NEVER}
				vscroll={Gtk.PolicyType.AUTOMATIC}
				minContentHeight={25}
			>
				<box vertical>
					{bind(wp, "endpoints").as((v) =>
						v.map((v) => {
							return <MixerItem endpoint={v} />;
						}),
					)}
				</box>
			</scrollable>
		</Menu>
	);
}

function SinkItem({ endpoint }: { endpoint: Wp.Endpoint }) {
	return (
		<button
			className="menu-list-item"
			hexpand
			onClick={() => {
				endpoint.isDefault = true;
			}}
		>
			<box className="item-header" valign={Gtk.Align.CENTER}>
				<icon
					icon={bind(endpoint, "icon").as((v) =>
						!Astal.Icon.lookup_icon(v) ? icons.mpris.fallback : v,
					)}
				/>
				<SepDot />
				<label
					truncate={true}
					label={bind(endpoint, "description").as((v) => (!v ? "Unknown" : v))}
				/>
			</box>
		</button>
	);
}

function MixerItem({ endpoint }: { endpoint: Wp.Endpoint }) {
	return (
		<box className="menu-list-item" hexpand vertical>
			<box className="item-header">
				<icon
					icon={bind(endpoint, "icon").as((v) =>
						!Astal.Icon.lookup_icon(v) ? icons.mpris.fallback : v,
					)}
				/>
				<SepDot />
				<label
					truncate={true}
					label={bind(endpoint, "name").as((v) => (!v ? "Unknown" : v))}
				/>
			</box>
			<slider
				className="mixer-slider vol-slider"
				hexpand
				draw_value={false}
				tooltipText={bind(endpoint, "volume").as((v) => (v * 100).toFixed(0))}
				value={bind(endpoint, "volume")}
				setup={(self) => {
					self.connect("dragged", () => {
						endpoint.volume = self.value;
					});
				}}
			/>
		</box>
	);
}
