import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import clock from "../globalWidgets/clock.js";

export default (monitor: number) =>
	Widget.Window({
		name: `desktop-clock${monitor}`,
		monitor,
		class_names: ["desktop-clock"],
		layer: "bottom",
		child: Widget.Box({
			vertical: true,
			children: [clock("%H:%M:%S", 900), clock("%e %B %A")],
		}),
	});
