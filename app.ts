import { App, Gdk, Gtk } from "astal/gtk3";
import style from "./style/main.scss";
import Bar from "./src/widget/Bar/Bar";
import { PowerMenu, Verification } from "src/widget/PowerMenu";
import NotificationPopups from "src/widget/Notifs/Popups";
import { Dashboard } from "src/widget/Dashboard/Dashboard";
import { Clipboard } from "src/widget/Clipboard";
import { redact } from "src/widget/Bar/modules/media";
import { BottomDesktop } from "src/widget/Desktop/desktop";
import { fetch } from "@lib/fetch";

App.start({
	css: style,
	main() {
		const multiwindowWidgets = [Bar, NotificationPopups, BottomDesktop];
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
		const args = request.split(" ");
		if (args[0] == "toggleRedact") {
			redact.set(!redact.get());
			return res("Done");
		}
		if (args[0] == "eval") {
			try {
				//@ts-expect-error
				globalThis.fetch = fetch;
				const r = eval?.(args.slice(1).join(" "));
				if (r instanceof Promise) {
					return r.then(res).catch(res);
				}
				return res(r);
			} catch (e) {
				return res(String(e));
			}
		}

		res("Unkown command");
	},
});
