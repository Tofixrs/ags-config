import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import Tray from "gi://AstalTray";
import { Workspaces } from "./modules/workspace";
import { SysTray } from "./modules/tray";
import { Media } from "./modules/media";
import { Time } from "../time";
import { Status } from "./modules/status";
import { Binding, bind } from "astal";

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const tray = Tray.get_default();
  return (
    <window
      name="bar"
      className="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      application={App}
    >
      <centerbox>
        <box>
          <Workspaces />
        </box>
        <box>
          <Media />
        </box>
        <box hexpand halign={Gtk.Align.END}>
          <SysTray />
          <SepDot visible={bind(tray, "items").as((v) => v.length > 0)} />
          <Status />
          <SepDot />
          <button>
            <Time format="%H:%M | %e %b %a" />
          </button>
        </box>
      </centerbox>
    </window>
  );
}

function SepDot({
  visible,
}: {
  visible?: Binding<boolean | undefined> | boolean;
}) {
  return <box className="sep" valign={Gtk.Align.CENTER} visible={visible} />;
}
