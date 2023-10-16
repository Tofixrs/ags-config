import { Widget } from "../imports.js"
import PopupWindow from "../misc/PopupWindow.js"

const Row = (toggles, menus = []) => Widget.Box({
	className: 'row',
	vertical: true,
	children: [
		Widget.Box({
			children: toggles,
		}),
		...menus,
	],
});

export default () => PopupWindow({
	name: 'quicksettings',
	anchor: ['top', 'right'],
	layout: 'top right',
	content: Widget.Box({
		className: 'quicksettings',
		vertical: true,
		children: [],
	}),
});
