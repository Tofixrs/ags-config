import Widget, { Box } from "resource:///com/github/Aylur/ags/widget.js";
import clock from "../../../globalWidgets/clock.js";

export default () =>
	Box({
		vertical: true,
		class_names: ["desktop-clock"],
		children: [clock("%H:%M:%S"), clock("%e %B %A")],
	});
