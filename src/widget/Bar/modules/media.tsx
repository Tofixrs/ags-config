import { bind } from "astal";
import { Gtk } from "astal/gtk3";
import Mpris from "gi://AstalMpris";

export function Media() {
  const mpris = Mpris.get_default();

  return (
    <box
      className="media module"
      visible={bind(mpris, "players").as((v) => v.length > 0)}
    >
      {bind(mpris, "players").as((ps) => {
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
        return ps[0] ? (
          <box>
            <box
              className={bind(ps[0], "coverArt").as((v) =>
                "cover" + v != undefined ? "visible" : "",
              )}
              valign={Gtk.Align.CENTER}
              css={bind(ps[0], "coverArt").as(
                (cover) => `background-image: url('${cover}');`,
              )}
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
              label={bind(ps[0], "title").as(
                () => `${ps[0].title} - ${ps[0].artist}`,
              )}
            />
          </box>
        ) : (
          ""
        );
      })}
    </box>
  );
}
