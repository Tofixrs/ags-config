import GObject, { register, property } from "astal/gobject";
import { App } from "astal/gtk3";
import { execAsync, exec } from "astal";
import { user } from "@lib/consts";

export const PowerAction = {
	Shutdown: 0,
	Sleep: 1,
	Logout: 2,
	Reboot: 3,
} as const;

export type PAction = (typeof PowerAction)[keyof typeof PowerAction];

@register()
class PowerMenu extends GObject.Object {
	@property(Number)
	private declare currentAction?: PAction;
	public confirmAction(action: PAction) {
		this.currentAction = action;
		App.get_window("powerMenu")!.visible = false;
		App.get_window("verification")?.show_all();
	}

	public action() {
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
				const regex = new RegExp(`${user}.*user`);
				const session = exec("loginctl")
					.split("\n")
					.find((v) => regex.test(v))
					?.split(/\s+/)[1];
				execAsync(`loginctl kill-session ${session}`);
				break;
			}
			case PowerAction.Reboot: {
				execAsync("reboot");
				break;
			}
		}
	}
}

export const PowerMenuService = new PowerMenu();
