import Notifications from "resource:///com/github/Aylur/ags/service/notifications.js";
import notification from "../../globalWidgets/notification.js";
import PopupWindow from "../../globalWidgets/PopupWindow.js";

export default () =>
	PopupWindow({
		name: "notif-board",
		anchor: ["bottom"],
		transition: "slide_up",
		child: Widget.Box({
			class_name: "notif-board-wrapper",
			vertical: true,
			child: Widget.Box({
				class_names: ["notif-board"],
				vertical: true,
				children: [
					Widget.Box({
						children: [
							Widget.Label("Notification center "),
							Widget.Box({ hexpand: true }),
							Widget.Button({
								label: "Clear all",
								on_clicked: () => {
									Notifications.clear();
								},
							}),
						],
					}),
					Widget.Label({ wrap: true, justification: "left", xalign: 0 }).hook(
						Notifications,
						(self) => {
							const critical = Notifications.notifications.filter(
								(notif) => notif.urgency == "critical",
							).length;
							const normal = Notifications.notifications.filter(
								(notif) => notif.urgency == "normal",
							).length;
							const low = Notifications.notifications.filter(
								(notif) => notif.urgency == "low",
							).length;

							const criticalText = critical > 0 ? `${critical} critical;` : "";
							const normalText = normal > 0 ? `${normal} normal;` : "";
							const lowText = low > 0 ? `${low} low` : "";

							self.label = `${criticalText} ${normalText} ${lowText}`;
						},
					),
					Notifs(),
				],
			}),
		}),
	});

const Notifs = () =>
	Widget.Scrollable({
		vexpand: true,
		hscroll: "never",
		child: Widget.Box({ vertical: true }).hook(Notifications, (self) => {
			if (Notifications.notifications.length == 0)
				App.closeWindow("notif-board");
			self.children = Notifications.notifications.map((notif) =>
				notification(notif),
			);
		}),
	});
