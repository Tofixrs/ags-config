import { Service, App } from "../imports.js";

class PowerMenu extends Service {
	static {
		Service.register(this, {}, {
			'title': ["string"],
			'cmd': ["string"],
		});
	}

	get title() { return this._title || ""; }
	get cmd() { return this._cmd || ""; }

	action(action) {
		[this._cmd, this._title] = {
			'sleep': ["systemctl suspend", "Sleep"],
			"logout": ["pkill dbus-run-session", "Log out"],
			"shutdown": ["shutdown now", "Shutdown"],
			"reboot": ["systemctl reboot", "Reboot"],
		}[action];

		this.notify("cmd");
		this.notify("title");
		this.emit("changed");

		App.closeWindow("powermenu");
		App.openWindow("verification")
	}
}

export default new PowerMenu();
