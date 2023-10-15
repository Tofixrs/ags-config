import { Widget, App } from "../imports.js"
import PowerMenu from "../services/powermenu.js"
import PopupWindow from "../misc/PopupWindow.js"


const SysButton = (action, label) => Widget.Button({
	onClicked: () => { PowerMenu.action(action) },
	child: Widget.Box({
		vertical: true,
		children: [
			Widget.Label(label),
		],
	}),
});

export default () => PopupWindow({
	expand: true,
	name: "powermenu",
	content: Widget.Box({
		className: "powermenu",
		homogeneous: true,
		children: [
			SysButton('sleep', 'Sleep'),
			SysButton('reboot', 'Reboot'),
			SysButton('logout', 'Log Out'),
			SysButton('shutdown', 'Shutdown'),
		]
	})
})
