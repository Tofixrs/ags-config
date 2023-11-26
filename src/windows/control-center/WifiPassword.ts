
import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import PopupWindow from "../../global_modules/PopupWindow.js";
import Gtk from "gi://Gtk";
import WifiPassword from "../../services/WifiPassword.js";
import App from "resource:///com/github/Aylur/ags/app.js";

export function PasswordInput() {
	return PopupWindow({
		layout: "center",
		name: "password-input",
		visible: false,
		content: Widget.Box({
			class_names: ["password-input"],
			vertical: true,
			children: [
				Widget.Label({
					binds: [["label", WifiPassword, "title"]]
				}),
				Widget.Entry({
					input_purpose: Gtk.InputPurpose.PASSWORD,
					placeholder_text: "password",
					visibility: false,
					caps_lock_warning: true,
					on_accept: (self) => {
						App.closeWindow("password-input");
						WifiPassword.connectWithPassword(self.text);
					},
				})
			]
		})
	})
}
