import { exec } from "../../../../.local/share/ags";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

export function getCursorPosOnCurrentMonitor(): { x: number; y: number } {
	const hyprland = AstalHyprland.get_default();
	const cursor = JSON.parse(exec("hyprctl cursorpos -j"));
	const realX = cursor.x;
	const realY = cursor.y;

	const monitor = hyprland.monitors.find((mon) => {
		const xBound = [mon.x, mon.x + mon.width];
		const yBound = [mon.y, mon.y + mon.height];

		if (realX < xBound[0]) return false;
		if (realX > xBound[1]) return false;
		if (realY < yBound[0]) return false;
		if (realY > yBound[1]) return false;

		return true;
	});

	return { x: realX - monitor!.x, y: realY - monitor!.y };
}
