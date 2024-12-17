import { App, Gdk, Gtk } from "astal/gtk3";
import style from "./style/main.scss";
import Bar from "./src/widget/Bar/Bar";
import { PowerMenu, Verification } from "src/widget/PowerMenu";
import NotificationPopups from "src/widget/Notifs/Popups";
import { Dashboard } from "src/widget/Dashboard/Dashboard";
import { Clipboard } from "src/widget/Clipboard";
import { redact } from "src/widget/Bar/modules/media";

App.start({
	css: style,
	main() {
		const multiwindowWidgets = [Bar, NotificationPopups];
		const monMap = new Map<Gdk.Monitor, Gtk.Widget[]>();
		App.get_monitors().forEach((mon) => {
			monMap.set(
				mon,
				multiwindowWidgets.map((widget) => widget(mon)),
			);
		});
		PowerMenu();
		Verification();
		Dashboard();
		Clipboard();

		App.connect("monitor-added", (_, mon) => {
			monMap.set(
				mon,
				multiwindowWidgets.map((widget) => widget(mon)),
			);
		});

		App.connect("monitor-removed", (_, mon) => {
			monMap.get(mon)?.forEach((v) => v.destroy());
			monMap.delete(mon);
		});
	},
	requestHandler(request, res) {
		if (request == "toggleredact") {
			redact.set(!redact.get());
			return res("Done");
		}

		res("Unkown command");
	},
});
