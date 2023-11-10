import { PanelButton } from "../PanelButton.js"
import { App } from "../../imports.js"
import { FontIcon } from "../../misc/OsIcon.js"
export const PowerButton = () => PanelButton({
	class_name: "powerbutton",
	on_clicked: () => App.openWindow("powermenu"),
	content: FontIcon({ icon: "󰐥" }),
})
