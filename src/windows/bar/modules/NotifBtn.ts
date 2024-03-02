import Notifications from "resource:///com/github/Aylur/ags/service/notifications.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";

export default () =>
	Widget.Button({
		child: Widget.Icon("notification-symbolic").hook(Notifications, (self) => {
			self.icon =
				Notifications.notifications.length > 0
					? "notification-new-symbolic"
					: "notification-symbolic";
		}),
		vpack: "center",
		hpack: "center",
		class_names: ["bar-module", "dashboard-btn"],
		on_clicked: () => {
			App.toggleWindow("notif-board");
			App.closeWindow("dashboard");
		},
	});
