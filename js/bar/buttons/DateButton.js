import { PanelButton } from "../PanelButton.js";
import { Clock } from "../../misc/Clock.js"
import { Utils } from "../../imports.js";

export const DateButton = ({ format = "%H:%M %b %e %a" } = {}) => PanelButton({
	class_name: 'dashboard',
	on_clicked: () => Utils.execAsync("swaync-client -t"),
	content: Clock({ format })
})
