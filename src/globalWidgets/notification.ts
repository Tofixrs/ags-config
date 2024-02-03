import Gtk30 from "gi://Gtk?version=3.0";
import { Notification } from "resource:///com/github/Aylur/ags/service/notifications.js";
import { lookUpIcon } from "resource:///com/github/Aylur/ags/utils.js";

export default (notif: Notification) =>
	Widget.Box({
		class_names: ["notification", notif.urgency],
		vertical: true,
		children: [TitleRow(notif), Body(notif), Actions(notif)],
	});

const NotificationIcon = ({ app_entry, app_icon, image }: Notification) => {
	if (image) {
		return Widget.Box({
			css: `
                background-image: url("${image}");
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            `,
		});
	}

	let icon = "dialog-information-symbolic";
	if (lookUpIcon(app_icon)) icon = app_icon;

	if (app_entry && lookUpIcon(app_entry)) icon = app_entry;

	return Widget.Icon({
		icon,
		class_name: "notif-icon",
	});
};

const TitleRow = (notif: Notification) =>
	Widget.Box({
		class_name: "notif-titleRow",
		orientation: Gtk30.Orientation.HORIZONTAL,
		children: [
			NotificationIcon(notif),
			Widget.Label(notif.summary),
			Widget.Box({ hexpand: true }),
			Widget.Button({
				child: Widget.Icon("window-close-symbolic"),
				on_clicked: () => notif.close(),
			}),
		],
	});

const Body = (notif: Notification) =>
	Widget.Label({
		class_name: "notif-body",
		hexpand: true,
		label: notif.body,
		xalign: 0,
		justification: "left",
		wrap: true,
	});

const Actions = (notif: Notification) =>
	Widget.Box({
		class_name: "notif-actions",
		halign: Gtk30.Align.CENTER,
		children: notif.actions.map(({ id, label }) =>
			Widget.Button({
				class_name: "notif-action-button",
				on_clicked: () => notif.invoke(id),
				child: Widget.Label(label),
			}),
		),
	});
