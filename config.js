import TopBar from "./js/bar/TopBar.js";

const ws = ags.Service.Hyprland.HyprctlGet('monitors');
const forMonitors = widget => ws.map(mon => widget(mon.id));

const scss = ags.App.configDir + "/scss/main.scss";
const css = ags.App.configDir + "/css/main.css";

ags.Utils.exec(`mkdir ${ags.App.configDir + "/css"}`);
ags.Utils.exec(`sass ${scss} ${css}`);
export default {
	maxStreamVolume: 2.0,
	windows: [
		forMonitors(TopBar)
	].flat(2)
}
