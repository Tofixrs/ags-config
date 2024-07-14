import Gtk30 from "gi://Gtk?version=3.0";
import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import Bar from "@widgets/bar/bar.js";

const forMonitors = (widget: (monitor: number) => Gtk30.Window) =>
	Hyprland.monitors.map((mon) => widget(mon.id));

App.config({
	maxStreamVolume: 2.0,
	style: App.configDir + "/style.css",
	windows: [...forMonitors(Bar)],
});
