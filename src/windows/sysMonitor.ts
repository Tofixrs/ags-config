import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { cpu, ram } from "../variables.js";

export function sysMonitor(mon: number) {
	return Widget.Window({
		layer: "bottom",
		name: `sysMonito${mon}`,
		monitor: mon,
		anchor: ["top", "left"],
		child: Widget.EventBox({
			on_primary_click: () => Utils.execAsync('bash -c "$TERMINAL -e btop"'),
			child: Widget.Box({
				class_names: ["sysMonitor"],
				children: [
					Widget.Box({
						class_names: ["stat-wrapper"],
						vertical: true,
						children: [
							Widget.CircularProgress({
								class_names: ["cpu", "stat"],
								value: cpu.bind(),
								vexpand: true,
								child: Widget.Label({
									label: "",
									class_names: ["icon"],
								}),
							}),
							Widget.Label({
								label: cpu.bind().transform((v) => `${(v * 100).toFixed(0)}%`),
							}),
						],
					}),
					Widget.Box({
						class_names: ["stat-wrapper"],
						vertical: true,
						children: [
							Widget.CircularProgress({
								class_names: ["ram", "stat"],
								vexpand: true,
								value: ram.bind(),
								child: Widget.Icon({
									class_names: ["icon"],
									icon: "memory-symbolic",
								}),
							}),
							Widget.Label({
								label: ram.bind().transform((v) => `${(v * 100).toFixed(0)}%`),
							}),
						],
					}),
				],
			}),
		}),
	});
}
