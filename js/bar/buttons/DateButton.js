import { PanelButton } from "../PanelButton.js";
import { Clock } from "../../misc/Clock.js"
const { execAsync } = ags.Utils;

export const DateButton = ({ format = "%H:%M %b %e %a" } = {}) => PanelButton({
	className: 'dashboard',
	onClicked: () => execAsync("swaync-client -t"),
	content: Clock({ format })
})
