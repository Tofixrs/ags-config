import Widget from "resource:///com/github/Aylur/ags/widget.js";
import icons from "../icons.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import { ButtonProps } from "types/widgets/button.js";
export default function PowerButton(props?: ButtonProps) {
	return Widget.Button({
		...props,
		on_clicked: () => App.openWindow("powermenu"),
		hpack: "center",
		vpack: "center",
		class_names: [
			"power",
			...(props?.class_names ? (props.class_names as string[]) : []),
		],
		child: Widget.Icon(icons.powermenu.shutdown),
	});
}
