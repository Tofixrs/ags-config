import GLib from "gi://GLib";
import { LabelProps } from "types/widgets/label";

export default (
	format: string = "%H:%M:%S %B %e. %A",
	interval: number = 1000,
	props?: LabelProps,
) => {
	return Widget.Label({
		...props,
		class_names: [
			"clock",
			...((props?.class_names as string[]) || []),
			(props?.class_name as string) || "",
		],
	}).poll(interval, (self) => {
		self.label = GLib.DateTime.new_now_local().format(format) || "";
	});
};
