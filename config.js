import TopBar from "./js/bar/TopBar.js";
import { scssWatcher, setupCss } from "./js/utils.js";

const ws = JSON.parse(ags.Utils.exec('hyprctl -j monitors'));
const forMonitors = widget => ws.map(mon => widget(mon.id));

const scss = ags.App.configDir + "/scss";
const css = ags.App.configDir + "/css";
setupCss(scss, css);
scssWatcher(scss, css);

export default {
	maxStreamVolume: 2.0,
	windows: [
		forMonitors(TopBar)
	].flat(2),
	style: css + "/main.css",
}
