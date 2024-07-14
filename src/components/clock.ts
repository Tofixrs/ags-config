import GLib20 from "gi://GLib";
import { Label } from "resource:///com/github/Aylur/ags/widget.js";
import { date } from "@/variables";

export const Clock = (format: string = "%H:%M:%S %B %e. %A") =>
	Label({
		class_names: ["component", "clock"],
		label: date.bind().transform((d) => d.format(format) || ""),
	});
