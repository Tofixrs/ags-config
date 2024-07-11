import {
	Box,
	CenterBox,
	Window,
	EventBox,
} from "resource:///com/github/Aylur/ags/widget.js";
import clock from "./modules/clock.js";
import { CPU, Ram } from "./modules/sysMonitor.js";
import weather from "./modules/weather.js";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import Todo from "./modules/todo.js";

export const subMenu = Variable("");

type DesktopProps = {
	monitor?: number;
	name: string;
	layer: "bottom" | "top";
};

export default ({ monitor, name, layer }: DesktopProps) =>
	Window({
		monitor,
		name: `desktop-${name}`,
		class_names: ["desktop"],
		exclusivity: layer == "top" ? "ignore" : "normal",
		layer,
		visible: false,
		anchor: ["top", "bottom", "left", "right"],
		child: CenterBox({
			class_names: ["columns"],
			margin: 25,
			start_widget: StartWidget(),
			center_widget: CenterWidget(),
			end_widget: EndWidget(),
		}),
	}).hook(Hyprland, (self) => {
		if (monitor == undefined) return;

		const mon = Hyprland.getMonitor(monitor);
		if (!mon) return;

		const activeWorkspace = Hyprland.getWorkspace(mon.activeWorkspace.id);
		self.visible = activeWorkspace!.windows == 0;
	});

const StartWidget = () =>
	Box({
		vertical: true,
		hexpand: true,
		children: [
			EventBox({
				class_names: ["bg"],
				child: Box({
					children: [S(), CPU(), S(), Ram(), S()],
				}),
			}),
		],
	});

const CenterWidget = () =>
	Box({
		vertical: true,
		children: [clock(), weather()],
	});

const EndWidget = () =>
	Box({
		vertical: true,
		children: [Todo()],
	});

export const S = () => Box({ hexpand: true });
