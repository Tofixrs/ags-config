import Bar from "./windows/bar/Bar.js";
import { exec } from "resource:///com/github/Aylur/ags/utils/exec.js";
import notifBoard from "./windows/notifBoard/notifBoard.js";
import notifDisplay from "./windows/notifDisplay.js";
import dashboard from "./windows/dashboard/dashboard.js";
import { PasswordInput } from "./windows/dashboard/WifiPassword.js";
import { PowerMenu, Verification } from "./windows/PowerMenu.js";
import Calendar from "./windows/calendar.js";
import { Clipboard } from "./windows/clipboard.js";
import desktop from "./windows/desktop/index.js";
import TodoAddForm from "./windows/desktop/TodoAddForm.ts";

const monitors: { id: number }[] = JSON.parse(exec("hyprctl -j monitors"));
const forMonitors = (widget: any) => monitors.map((mon) => widget(mon.id));

App.config({
	maxStreamVolume: 2.0,
	style: App.configDir + "/css/main.css",
	windows: [
		forMonitors(Bar),
		notifBoard(),
		forMonitors(notifDisplay),
		forMonitors((mon: any) =>
			desktop({ name: `mon${mon}`, monitor: mon, layer: "bottom" }),
		),
		dashboard(),
		PasswordInput(),
		PowerMenu(),
		Verification(),
		Calendar(),
		Clipboard(),
		desktop({ name: "top", layer: "top" }),
		TodoAddForm(),
	].flat(2),
	closeWindowDelay: {
		dashboard: 200,
		"notif-board": 200,
		calendar: 200,
	},
});
