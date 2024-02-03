import Bar from "./windows/bar/Bar.js";
import { exec } from "resource:///com/github/Aylur/ags/utils/exec.js";
import notifBoard from "./windows/notifBoard/notifBoard.js";
import notifDisplay from "./windows/notifDisplay/notifDisplay.js";

const monitors = JSON.parse(exec("hyprctl -j monitors"));
const forMonitors = (widget) => monitors.map((mon) => widget(mon.id));

export default {
	maxStremVolume: 2.0,
	style: App.configDir + "/css/main.css",
	windows: [forMonitors(Bar), notifBoard(), forMonitors(notifDisplay)].flat(2),
};
