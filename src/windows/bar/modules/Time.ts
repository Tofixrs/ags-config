import clock from "../../../globalWidgets/clock.js";

export default () =>
	Widget.Button({
		child: clock("%H:%M | %e %b %a", 1000),
		class_names: ["bar-module"],
		on_primary_click: () => App.toggleWindow("calendar"),
	});
