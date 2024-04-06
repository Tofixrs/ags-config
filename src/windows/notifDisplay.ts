import NotifService from "resource:///com/github/Aylur/ags/service/notifications.js";
import Notification from "../globalWidgets/notification.js";
import { Notification as NotifObj } from "resource:///com/github/Aylur/ags/service/notifications.js";

const { idle, timeout } = Utils;

function animNotif(notif: NotifObj) {
	const widget = Notification(notif);

	const inner = Widget.Revealer({
		transition: "slide_left",
		transition_duration: 200,
		child: widget,
	});

	const outer = Widget.Revealer({
		transition: "slide_down",
		transition_duration: 200,
		child: inner,
	});

	const box = Widget.Box({
		hpack: "end",
		child: outer,
		attribute: { id: notif.id },
	});

	idle(() => {
		outer.reveal_child = true;
		timeout(200, () => {
			inner.reveal_child = true;
		});
	});

	return Object.assign(box, {
		dismiss() {
			inner.reveal_child = false;
			timeout(200, () => {
				outer.reveal_child = false;
				timeout(200, () => {
					box.destroy();
				});
			});
		},
	});
}

export default function NotificationPopups(monitor: number = 0) {
	const list = Widget.Box({
		children: NotifService.popups.map(animNotif),
		vertical: true,
	});

	function onNotified(_, id: number) {
		const n = NotifService.getNotification(id);
		if (n) list.children = [animNotif(n), ...list.children];
	}

	function onDismissed(_, id: number) {
		list.children.find((n) => n.attribute.id === id)?.dismiss();
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
