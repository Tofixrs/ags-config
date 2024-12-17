import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk3";
import Mpris from "gi://AstalMpris";
import GdkPixbuf from "gi://GdkPixbuf?version=2.0";
import { imageSize, roundImage } from "@lib/utils";

export function Media() {
	const mpris = Mpris.get_default();
	const cover = Variable<GdkPixbuf.Pixbuf | undefined>(undefined);

	return (
		<box
			className="media module"
			visible={bind(mpris, "players").as((v) => v.length > 0)}
		>
			{bind(mpris, "players").as((ps) => {
				if (!ps[0]) return "";
				const play_icon = bind(ps[0], "playback_status").as((v) => {
					return v == Mpris.PlaybackStatus.PLAYING
						? "media-playback-pause-symbolic"
						: "media-playback-start-symbolic";
				});
				const play_classes = bind(ps[0], "playback_status").as((v) =>
					v == Mpris.PlaybackStatus.PLAYING
						? "control play playing"
						: " control play paused",
				);
				if (!cover().get()) {
					roundImage(ps[0].coverArt).then(async (v) => {
						const [width, height] = await imageSize(v);
						cover.set(GdkPixbuf.Pixbuf.new_from_file_at_size(v, width, height));
					});
				}
				bind(ps[0], "coverArt").subscribe((v) => {
					roundImage(v).then(async (v) => {
						const [width, height] = await imageSize(v);
						cover.set(GdkPixbuf.Pixbuf.new_from_file_at_size(v, width, height));
					});
				});
				return (
					<box>
						<icon
							valign={Gtk.Align.CENTER}
							className={bind(ps[0], "coverArt").as((v) => {
								return "cover " + (!v ? "" : "visible");
							})}
							setup={(self) => {
								cover().subscribe((v) => {
									if (v) self.pixbuf = v;
								});
							}}
						/>
						<button
							className="control prev"
							valign={Gtk.Align.CENTER}
							onClick={() => ps[0].previous()}
						>
							<icon icon="media-skip-backward-symbolic" />
						</button>
						<button
							className={play_classes}
							valign={Gtk.Align.CENTER}
							onClick={() => ps[0].play_pause()}
						>
							<icon icon={play_icon} />
						</button>
						<button
							className="control next"
							valign={Gtk.Align.CENTER}
							onClick={() => ps[0].next()}
						>
							<icon icon="media-skip-forward-symbolic" />
						</button>
						<label
							label={`${ps[0].title} - ${ps[0].artist}`}
							setup={(self) => {
								bind(ps[0], "title")
									.as(() => `${ps[0].title} - ${ps[0].artist}`)
									.subscribe((v) => (self.label = v));
								bind(ps[0], "artist")
									.as(() => `${ps[0].title} - ${ps[0].artist}`)
									.subscribe((v) => (self.label = v));
							}}
						/>
					</box>
				);
			})}
		</box>
	);
}
