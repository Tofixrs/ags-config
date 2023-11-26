import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import GLib from "gi://GLib";

export default function Clock(format: string = "%H:%M:%S %B %e. %A", interval: number = 1000, ...props: any[]) {
	return Widget.Label({
		class_names: ["clock"],
		connections: [[interval, self => {
			self.label = GLib.DateTime.new_now_local().format(format) || "";
		}]],
		...props
	})
}
