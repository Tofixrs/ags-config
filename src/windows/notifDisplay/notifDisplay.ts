import Notifications from "resource:///com/github/Aylur/ags/service/notifications.js";
import notification from "../../globalWidgets/notification.js";

export const showingNotifs = Variable<number[]>([]);

Notifications.connect("notified", (_, id) => {
	const clone = showingNotifs.value.map((x) => x);

	clone.push(id);
	showingNotifs.value = clone;
});

export default (monitor: number) =>
	Widget.Window({
		name: `notif-display${monitor}`,
		class_name: "notif-display",
		monitor,
		anchor: ["top", "bottom", "right"],
		width_request: 400,
		child: Widget.Box({
			vertical: true,
			children: [
				Widget.Box({ class_name: "amongus" }),
				Notifs(),
				Widget.Box({
					class_name: "notif-display-fill",
					vexpand: true,
				}),
			],
		}),
	}).hook(showingNotifs, (self) => {
		self.visible = showingNotifs.value.length > 0;
	});
const Notifs = () =>
	Widget.Scrollable({
		hscroll: "never",
		class_name: "notif-display-scroll",
		vexpand: true,
		child: Widget.Box({ vertical: true, hexpand: true }).hook(
			Notifications,
			(self) => {
				//@ts-expect-error undefined
				self.children = showingNotifs.value
					.map((id) => {
						const notif = Notifications.getNotification(id);
						if (!notif) return;

						let timeout: number | undefined;

						if (notif.urgency == "low") {
							timeout = 6;
						}

						if (notif.urgency == "normal") {
							timeout = 11;
						}

						return notification(notif).poll(1000, (self) => {
							if (timeout == undefined) return;

							if (timeout == 0) {
								const clone = showingNotifs.value.filter((x) => x != id);

								showingNotifs.value = clone;
								self.destroy();
							}

							timeout -= 1;
						});
					})
					.filter((e) => e != undefined);
			},
		),
	});
