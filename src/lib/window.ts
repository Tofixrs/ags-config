import { xdgCurrentDesktop } from "./consts";
import { Gtk, Gdk } from "astal/gtk3";
import { getCursorPosOnCurrentMonitor, getHyprMonitor } from "./hyprland";
import { bind, Binding, execAsync, Variable } from "astal";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

export function posAtCursor(window: Gtk.Window) {
	switch (xdgCurrentDesktop) {
		case "Hyprland": {
			const { x, y } = getCursorPosOnCurrentMonitor();
			execAsync(
				`hyprctl keyword windowrulev2 "move ${x} ${y}, title:${window.title}"`,
			);

			return;
		}
	}
}
export function visibleOnEmptyWorkspace(
	monitor: Gdk.Monitor,
): Binding<boolean> | boolean {
	switch (xdgCurrentDesktop) {
		case "Hyprland": {
			const hypr = AstalHyprland.get_default();
			const hyprMonitor = getHyprMonitor(monitor);
			const visible = Variable(
				hyprMonitor?.activeWorkspace.clients.length == 0,
			);
			hypr.connect_after("event", () => {
				visible.set(hyprMonitor?.activeWorkspace.clients.length == 0);
			});
			return bind(visible);
		}
		default: {
			return true;
		}
	}
}
