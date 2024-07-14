import {
	Box,
	CenterBox,
	Button,
	Window,
} from "resource:///com/github/Aylur/ags/widget.js";
import {
	SepDot,
	Clock,
	Workspaces,
	Tray,
	BatteryBar,
	SysIndicators,
} from "@components/index";

export default (monitor: number) =>
	Window({
		class_names: ["bar"],
		name: `bar-${monitor}`,
		monitor,
		anchor: ["bottom", "left", "right"],
		margins: [0, 5, 5, 5],
		exclusivity: "exclusive",
		child: CenterBox({
			center_widget: Center(),
			start_widget: Left(),
			end_widget: Right(),
		}),
	});

const Left = () =>
	Box({
		children: [
			Button({
				class_names: ["btn-wrap"],
				child: Clock("%H:%M | %d %b %a"),
			}),
		],
	});

const Center = () =>
	Box({
		children: [Workspaces()],
	});

const Right = () =>
	Box({
		hpack: "end",
		children: [Tray(), SepDot(), BatteryBar(), SepDot(), SysIndicators()],
	});
