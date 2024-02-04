import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import Workspaces from "./modules/Workspaces.js";
import Time from "./modules/Time.js";
import DashboardBtn from "./modules/DashboardBtn.js";
import NotifBtn from "./modules/NotifBtn.js";
import SysStatus from "./modules/SysStatus.js";

export default (monitor: number) =>
	Widget.Window({
		name: `bar${monitor}`,
		class_name: "bar",
		monitor,
		exclusivity: "exclusive",
		anchor: ["bottom", "left", "right"],
		margins: [5, 5],
		child: Widget.CenterBox({
			class_name: "bar-panel",
			start_widget: Start(),
			center_widget: Center(),
			end_widget: End(),
		}),
	});

const Start = () =>
	Widget.Box({
		class_name: "bar-start",
		children: [Time()],
	});
const Center = () =>
	Widget.Box({
		class_name: "bar-center",
		children: [
			NotifBtn(),
			SeperatorDot(),
			Workspaces(),
			SeperatorDot(),
			DashboardBtn(),
		],
	});
const End = () =>
	Widget.Box({
		class_name: "bar-end",
		children: [Widget.Box({ hexpand: true }), SysStatus()],
	});

export const SeperatorDot = () =>
	Widget.Separator({
		class_name: "bar-sep-dot",
		vpack: "center",
	});
