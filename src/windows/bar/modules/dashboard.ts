import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";
import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import Clock from "../../../global_modules/clock.js";

export default function Dashboard(format?: string, interval?: number) {
	return Widget.Button({
		class_names: ["module", "dashboard"],
		on_clicked: () => execAsync("swaync-client -t"),
		child: Clock(format, interval),
	});
}
