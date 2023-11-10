import { Widget } from "../imports.js"
import PowerMenu from "../services/powermenu.js"
import PopupWindow from "../misc/PopupWindow.js"
import icons from "../icons.js";


const SysButton = (action, icon) => Widget.Button({
	on_clicked: () => { PowerMenu.action(action) },
	child: Widget.Box({
		vertical: true,
		children: [
			Widget.Icon({ icon, size: 100 }),
		],
	}),
});

export default () => PopupWindow({
	expand: true,
	name: "powermenu",
	content: Widget.Box({
		class_name: "powermenu",
		homogeneous: true,
		children: [
			SysButton('sleep', icons.powerMenu.sleep),
			SysButton('reboot', icons.powerMenu.reboot),
			SysButton('logout', icons.powerMenu.logout),
			SysButton('shutdown', icons.powerMenu.shutdown),
		]
	})
})
