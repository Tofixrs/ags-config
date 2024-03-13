import PopupWindow from "../globalWidgets/PopupWindow.js";

export default () =>
	PopupWindow({
		name: "calendar",
		transition: "slide_up",
		anchor: ["bottom", "left"],
		child: Widget.Box({
			class_name: "calendar-wrapper",
			child: Widget.Box({
				class_name: "calendar",
				vertical: true,
				children: [
					Widget.Calendar({
						hexpand: true,
						hpack: "center",
					}),
				],
			}),
		}),
	});
