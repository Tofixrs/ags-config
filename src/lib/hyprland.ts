import { exec } from "resource:///com/github/Aylur/ags/utils/exec.js";
import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";

export function getCursorPosOnCurrentMonitor(): { x: number; y: number } {
	const cursor = JSON.parse(exec("hyprctl cursorpos -j"));
	const realX = cursor.x;
	const realY = cursor.y;

	const monitor = Hyprland.monitors.find((mon) => {
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
