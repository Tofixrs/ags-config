export default () =>
	Widget.Button({
		hpack: "center",
		vpack: "center",
		class_names: ["bar-module", "dashboard-btn"],
		child: Widget.Icon("user-home-symbolic"),
		on_clicked: () => {
			App.toggleWindow("dashboard");
			App.closeWindow("notif-board");
		},
	});
