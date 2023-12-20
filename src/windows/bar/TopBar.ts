import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import Workspaces from "./modules/workspaces.js";
import Dashboard from "./modules/dashboard.js";
import { SysStatus } from "./modules/sysStatus.js";
import PowerButton from "../../global_modules/power_button.js";

export default (monitor: number) =>
	Widget.Window({
		name: `bar${monitor}`,
		monitor,
		exclusivity: "exclusive",
		anchor: ["top", "left", "right"],
		margins: [5, 10],
		child: Widget.CenterBox({
			class_names: ["panel"],
			start_widget: Start(),
			center_widget: Center(),
			end_widget: End(),
		}),
	});

export const SeperatorDot = () => Widget.Separator({
	class_name: "sep-dot",
	vpack: "center",
})

const Start = () =>
	Widget.Box({
		class_names: ["start"],
		children: [Workspaces()],
	});

const Center = () =>
	Widget.Box({
		class_names: ["center"],
		children: [Dashboard("%H:%M | %e %b %a", 10000)],
	});

const End = () =>
	Widget.Box({
		class_names: ["end"],
		children: [
			Widget.Box({ hexpand: true }),
			SysStatus(["volume", "network", "battery"]),
			SeperatorDot(),
			PowerButton({ class_names: ["module"] })],
	});
