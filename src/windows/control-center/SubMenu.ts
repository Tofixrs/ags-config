import Gtk from "gi://Gtk";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import icons from "../../icons.js";
import { timeout } from "resource:///com/github/Aylur/ags/utils.js"
import App from "resource:///com/github/Aylur/ags/app.js";
import AgsBox, { BoxProps } from "types/widgets/box.js";
import { SeperatorDot } from "../bar/TopBar.js";
import { GObject } from "gi://GObject";

export const opened = Variable("");

App.connect('window-toggled', (_, name, visible) => {
	if (name === 'controlcenter' && !visible) {
		timeout(1000, () => {
			const window = App.getWindow("controlcenter");

			opened.value = window?.visible ? opened.value : "";
		});
	}
});

export function Menu(name: string, content: Gtk.Widget[]) {
	return Widget.Revealer({
		transition: "slide_down",
		binds: [['reveal-child', opened, 'value', v => v === name]],
		child: Widget.Box({
			class_names: ["menu", name],
			vertical: true,
			children: content,
		})
	})
}

export function Arrow(name: string, activate?: Function) {
	let deg = 0;
	let iconOpened = false;
	return Widget.Button({
		class_names: ["arrow"],
		child: Widget.Icon({
			icon: icons.ui.arrowRight,
			connections: [[opened, icon => {
				if (opened.value === name && !iconOpened || opened.value !== name && iconOpened) {
					const step = opened.value === name ? 10 : -10;
					iconOpened = !iconOpened;
					for (let i = 0; i < 9; ++i) {
						timeout(15 * i, () => {
							deg += step;
							icon.setCss(`-gtk-icon-transform: rotate(${deg}deg);`);
						});
					}
				}
			}]],
		}),
		on_clicked: () => {
			opened.value = opened.value === name ? '' : name;
			if (activate)
				activate();
		},
	});
};
export type ArrowToggleButtonProps = {
	name: string,
	icon: Gtk.Widget,
	label: Gtk.Widget,
	activate: Function,
	deactivate: Function,
	connection: [string | number | GObject.Object, Function],
	activateOnArrow?: true,
} & BoxProps<AgsBox>;


export const ArrowToggleButton = ({
	name, icon, label, activate, deactivate,
	activateOnArrow = true,
	connection: [service, condition],
}: ArrowToggleButtonProps) => Widget.Box({
	class_name: 'toggle-button',
	//@ts-ignore
	connections: [[service, box => {
		box.toggleClassName('active', condition());
	}]],
	children: [
		Widget.Button({
			class_names: ["btn"],
			child: Widget.Box({
				hexpand: true,
				children: [icon, SeperatorDot(), label],
			}),
			on_clicked: () => {
				if (condition()) {
					deactivate();
					if (opened.value === name)
						opened.value = '';
				} else {
					activate();
				}
			},
		}),
		Arrow(name, activateOnArrow && activate),
	],
});
