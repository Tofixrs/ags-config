import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import Tray from "gi://AstalTray";
import Mpris from "gi://AstalMpris";
import { Workspaces } from "./modules/workspace";
import { SysTray } from "./modules/tray";
import { Media } from "./modules/media";
import { Time } from "../time";
import { Status } from "./modules/status";
import { bind } from "astal";
import icons from "@lib/icons";
import { SepDot } from "../separator";
import { redact } from "./modules/media";

export default function Bar(gdkmonitor: Gdk.Monitor) {
	const tray = Tray.get_default();
	const mpris = Mpris.get_default();
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
					<SepDot
						setup={(self) => {
							redact.subscribe((v) => {
								self.visible = !v && mpris.players.length > 0;
							});
							bind(mpris, "players").subscribe((v) => {
								self.visible = !redact.get() && v.length > 0;
							});
						}}
					/>
					<button
						onClick={() => App.toggle_window("dashboard")}
						className={"module"}
					>
						<icon icon={icons.ui.dashboard} />
					</button>
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
