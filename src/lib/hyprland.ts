import { exec } from "resource:///com/github/Aylur/ags/utils/exec.js";

// My infinetly cursed solution to putting windows at cursor with more then 1 monitor
class MonitorMap {
	monitors: { x: number; y: number; width: number; height: number }[];
	constructor() {
		this.monitors = JSON.parse(exec("hyprctl monitors -j")).map(
			({ width, height, x, y }) => ({
				width,
				height,
				x,
				y,
			}),
		);
	}
	getCursorPosOnCurrentMonitor(): { x: number; y: number } {
		const cursor = JSON.parse(exec("hyprctl cursorpos -j"));
		const realX = cursor.x;
		const realY = cursor.y;

		const monitor = this.monitors.find((mon) => {
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
}

const monitorMap = new MonitorMap();

export { monitorMap };
