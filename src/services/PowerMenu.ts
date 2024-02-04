import Service from "resource:///com/github/Aylur/ags/service.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import { exec, execAsync } from "resource:///com/github/Aylur/ags/utils.js";

// Why the fuck are ts enums so dogshit
export enum PowerAction {
	Shutdown,
	Sleep,
	Logout,
	Reboot,
}

class PowerMenu extends Service {
	static {
		Service.register(this);
	}
	private currentAction?: PowerAction;
	constructor() {
		super();
	}

	private action() {
		/* eslint-disable */
		switch (this.currentAction) {
			case PowerAction.Shutdown: {
				execAsync("shutdown 0");
				break;
			}
			case PowerAction.Sleep: {
				execAsync("systemctl suspend");
				break;
			}
			case PowerAction.Logout: {
				// Gotta love parsing strings lol
				const session = exec("loginctl").split("\n")[1].split(/\s+/)[1];
				execAsync(`loginctl kill-session ${session}`);
				break;
			}
			case PowerAction.Reboot: {
				execAsync("reboot");
				break;
			}
			default: {
			}
		}
	}

	// God i hate naming things
	public confirmAction(action: PowerAction) {
		this.currentAction = action;

		App.closeWindow("powermenu");
		App.openWindow("verification");
	}

	public executeSelectedAction() {
		this.action();
	}
}

export const PowerMenuService = new PowerMenu();
