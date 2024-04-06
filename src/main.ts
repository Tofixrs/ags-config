import Bar from "./windows/bar/Bar.js";
import { exec } from "resource:///com/github/Aylur/ags/utils/exec.js";
import notifBoard from "./windows/notifBoard/notifBoard.js";
import notifDisplay from "./windows/notifDisplay.js";
import desktopClock from "./windows/desktopClock.js";
import dashboard from "./windows/dashboard/dashboard.js";
import { PasswordInput } from "./windows/dashboard/WifiPassword.js";
import { PowerMenu, Verification } from "./windows/PowerMenu.js";
import Calendar from "./windows/calendar.js";

const monitors = JSON.parse(exec("hyprctl -j monitors"));
const forMonitors = (widget) => monitors.map((mon) => widget(mon.id));

App.config({
	maxStreamVolume: 2.0,
	style: App.configDir + "/css/main.css",
	windows: [
		forMonitors(Bar),
		notifBoard(),
		forMonitors(notifDisplay),
		forMonitors(desktopClock),
		dashboard(),
		PasswordInput(),
		PowerMenu(),
		Verification(),
		Calendar(),
	].flat(2),
	closeWindowDelay: {
		dashboard: 200,
		"notif-board": 200,
		calendar: 200,
	},
});
