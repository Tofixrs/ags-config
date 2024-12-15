import { xdgCurrentDesktop } from "./consts";
import { Gtk } from "astal/gtk3";
import { getCursorPosOnCurrentMonitor } from "./hyprland";
import { execAsync } from "astal";

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
