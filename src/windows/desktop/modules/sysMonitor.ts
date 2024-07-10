import Widget, { Box } from "resource:///com/github/Aylur/ags/widget.js";
import { cpu, ram } from "../../../variables.js";
export const Ram = () =>
	Box({
		class_names: ["stat-wrapper"],
		margin: 10,
		vertical: true,
		children: [
			Widget.CircularProgress({
				class_names: ["ram", "stat"],
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
	});
export const CPU = () =>
	Box({
		class_names: ["stat-wrapper"],
		vertical: true,
		margin: 10,
		children: [
			Widget.CircularProgress({
				class_names: ["cpu", "stat"],
				value: cpu.bind(),
				child: Widget.Icon({
					class_names: ["icon"],
					icon: "cpu-symbolic",
				}),
			}),
			Widget.Label({
				label: cpu.bind().transform((v) => `${(v * 100).toFixed(0)}%`),
			}),
		],
	});
