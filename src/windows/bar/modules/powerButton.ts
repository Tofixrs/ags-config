import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import icons from "../../../icons.js";
import App from "resource:///com/github/Aylur/ags/app.js";
export default function PowerButton() {
	return Widget.Button({
		on_clicked: () => App.openWindow("powermenu"),
		hpack: "center",
		vpack: "center",
		class_names: ["module", "power"],
		child: Widget.Icon(icons.powermenu.shutdown)
	})
}
