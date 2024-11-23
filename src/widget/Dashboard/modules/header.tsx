import { Gtk } from "astal/gtk3";

import { uptime } from "@lib/consts";
import { Avatar } from "../../avatar";
import { bind } from "astal";
import Battery from "gi://AstalBattery";

export function Header() {
	const bat = Battery.get_default();
	return (
		<box className="header">
			<Avatar />
			<centerbox hexpand vertical>
				<label
					className="uptime"
					label={uptime().as((v) => `Uptime: ${v}`)}
					justify={Gtk.Justification.CENTER}
					halign={Gtk.Align.CENTER}
					hexpand
				/>
				<box />
				<overlay
					className="batteryBar"
					setup={(self) => {
						self.add_overlay(
							<box halign={Gtk.Align.CENTER} hexpand>
								<icon icon={bind(bat, "icon_name")} />
								<label
									label={bind(bat, "percentage").as((v) => `${v * 100}%`)}
								/>
							</box>,
						);
					}}
				>
					<levelbar value={bind(bat, "percentage")} className="bar" />
				</overlay>
			</centerbox>
		</box>
	);
}
