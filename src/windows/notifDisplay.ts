import NotifService from "resource:///com/github/Aylur/ags/service/notifications.js";
import Notification from "../globalWidgets/notification.js";

export default function NotificationPopups(monitor: number = 0) {
	const list = Widget.Box({
		vertical: true,
		children: NotifService.popups.map(Notification),
	});

	function onNotified(_, id: number) {
		const n = NotifService.getNotification(id);
		if (n) list.children = [Notification(n), ...list.children];
	}

	function onDismissed(_, id: number) {
		list.children.find((n) => n.attribute.id === id)?.destroy();
	}

	list
		.hook(NotifService, onNotified, "notified")
		.hook(NotifService, onDismissed, "dismissed");

	return Widget.Window({
		monitor,
		name: `notifications${monitor}`,
		class_name: "notification-popups",
		anchor: ["top", "right"],
		child: Widget.Box({
			css: "min-width: 2px; min-height: 2px;",
			class_name: "notifications",
			vertical: true,
			child: list,
		}),
	});
}
