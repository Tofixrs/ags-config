import PopupWindow from "../globalWidgets/PopupWindow.js";
import { Calendar } from "resource:///com/github/Aylur/ags/widgets/calendar.js";

App.connect("window-toggled", (_, name, visible) => {
	if (name == "calendar" && !visible) {
		const date = new Date();
		calendar.select_day(date.getDate());
		calendar.select_month(date.getMonth(), date.getFullYear());
	}
});

const calendar = Widget.Calendar({
	hexpand: true,
	hpack: "center",
	on_day_selected: markSundays,
});

export default () => {
	markSundays(calendar);

	return PopupWindow({
		name: "calendar",
		transition: "slide_up",
		anchor: ["bottom", "left"],
		child: Widget.Box({
			class_name: "calendar-wrapper",
			child: Widget.Box({
				class_name: "calendar",
				vertical: true,
				children: [calendar],
			}),
		}),
	});
};

function getSundays(date: Date): Date[] {
	let sundays: Date[] = [];

	const sunday = new Date(date);
	sunday.setDate(1);
	sunday.setDate(sunday.getDate() + (8 - sunday.getDay()));

	for (let i = 0; i < 5; i++) {
		sundays.push(new Date(sunday.getTime()));
		sunday.setDate(sunday.getDate() + 7);
	}

	return sundays.filter((d) => d.getMonth() == date.getMonth());
}

function markSundays(calendar: Calendar<unknown>) {
	calendar.clear_marks();

	const [y, m, d] = calendar.date;
	const date = new Date(y, m, d);

	const sundays = getSundays(date);

	for (const sunday of sundays) {
		calendar.mark_day(sunday.getDate() - 1);
	}
}
