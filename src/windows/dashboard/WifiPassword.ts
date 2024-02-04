import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import PopupWindow from "../../globalWidgets/PopupWindow.js";
import Gtk from "gi://Gtk?version=3.0";
import WifiPassword from "../../services/WifiPassword.js";
import App from "resource:///com/github/Aylur/ags/app.js";

export function PasswordInput() {
	return PopupWindow({
		name: "password-input",
		visible: false,
		transition: "none",
		child: Widget.Box({
			class_names: ["password-input"],
			vertical: true,
			children: [
				Widget.Label({
					label: WifiPassword.bind("title"),
				}),
				Widget.Entry({
					input_purpose: Gtk.InputPurpose.PASSWORD,
					placeholder_text: "password",
					visibility: false,
					caps_lock_warning: true,
					on_accept: (self) => {
						App.closeWindow("password-input");
						WifiPassword.connectWithPassword(self.text ? self.text : "");
					},
				}),
			],
		}),
	});
}
