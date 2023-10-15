import TopBar from "./js/bar/TopBar.js";
import { scssWatcher, setupCss } from "./js/utils.js";
import { Utils, App } from "./js/imports.js";
import PowerMenu from "./js/powermenu/PowerMenu.js";
import Verification from "./js/powermenu/Verification.js";

const ws = JSON.parse(Utils.exec('hyprctl -j monitors'));
const forMonitors = widget => ws.map(mon => widget(mon.id));

const scss = App.configDir + "/scss";
const css = App.configDir + "/css";
setupCss(scss, css);
scssWatcher(scss, css);

export default {
	maxStreamVolume: 2.0,
	windows: [
		forMonitors(TopBar),
		PowerMenu(),
		Verification(),
	].flat(2),
	style: css + "/main.css",
}
