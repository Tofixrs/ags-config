import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import { exec } from "resource:///com/github/Aylur/ags/utils.js";
import TopBar from "./windows/bar/TopBar.js";
import { PowerMenu, Verification } from "./windows/powermenu/PowerMenu.js";
import { ControlCenter } from "./windows/control-center/ControlCenter.js";
import { PasswordInput } from "./windows/control-center/WifiPassword.js";
import App from "resource:///com/github/Aylur/ags/app.js";

const ws = JSON.parse(exec("hyprctl -j monitors"));
const forMonitors = (widget) => ws.map((mon) => widget(mon.id));

export default {
  maxStreamVolume: 2.0,
  windows: [
    forMonitors(TopBar),
    PowerMenu(),
    Verification(),
    ControlCenter(),
    PasswordInput(),
  ].flat(2),
  style: App.configDir + "/css/main.css",
};
