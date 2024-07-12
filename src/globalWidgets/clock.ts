import GLib from "gi://GLib";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import { LabelProps } from "types/widgets/label";
const time = Variable(GLib.DateTime.new_now_local(), {
	poll: [500, () => GLib.DateTime.new_now_local()],
});

export default (format: string = "%H:%M:%S %B %e. %A", props?: LabelProps) => {
	return Widget.Label({
		...props,
		label: time.bind().transform((d) => d.format(format) || ""),
		class_names: [
			"clock",
			...((props?.class_names as string[]) || []),
			(props?.class_name as string) || "",
		],
	});
};
