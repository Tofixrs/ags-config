import TopBar from "./js/bar/TopBar";

const ws = ags.Service.Hyprland.HyprctlGet('monitors');
const forMonitors = widget => ws.map(mon => widget(mon.id));

export default {
	maxStreamVolume: 2.0,
	windows: [
		forMonitors(TopBar)
	]
}
