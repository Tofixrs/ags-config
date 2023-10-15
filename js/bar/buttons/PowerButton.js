import { PanelButton } from "../PanelButton.js"
import { App } from "../../imports.js"
import { FontIcon } from "../../misc/OsIcon.js"
export const PowerButton = () => PanelButton({
	className: "powerbutton",
	onClicked: () => App.openWindow("powermenu"),
	content: FontIcon({ icon: "󰐥" }),
})
