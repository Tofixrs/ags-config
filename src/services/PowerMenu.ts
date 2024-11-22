import GObject, { register, property } from "astal/gobject";
import { App } from "astal/gtk3";
import { execAsync, exec } from "astal";

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
    App.get_window("powerMenu")?.close();
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
        // Gotta love parsing strings lol
        const session = exec("loginctl").split("\n")[1].split(/\s+/)[1];
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
