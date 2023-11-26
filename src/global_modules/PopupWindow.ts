import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import type AgsBox from "types/widgets/box";
import { WindowProps } from "types/widgets/window";
import Gtk from "gi://Gtk";

const Padding = (windowName: string) => Widget.EventBox({
	class_name: 'padding',
	hexpand: true,
	vexpand: true,
	connections: [['button-press-event', () => App.toggleWindow(windowName)]],
});

const PopupRevealer = (windowName: string, transition_type: Gtk.RevealerTransitionType, child: AgsBox) => Widget.Box({
	css: 'padding: 1px;',
	child: Widget.Revealer({
		transition_type,
		child,
		transitionDuration: 400,
		//@ts-ignore
		connections: [[App, (revealer, name, visible) => {
			if (name === windowName)
				//@ts-ignore
				revealer.reveal_child = visible;
		}]],
	}),
});

const layouts = {
	'center': (windowName: string, child: AgsBox, expand: boolean) => Widget.CenterBox({
		class_name: 'shader',
		css: expand ? 'min-width: 5000px; min-height: 3000px;' : '',
		children: [
			Padding(windowName),
			Widget.CenterBox({
				vertical: true,
				children: [
					Padding(windowName),
					child,
					Padding(windowName),
				],
			}),
			Padding(windowName),
		],
	}),
	'top': (windowName: string, child: AgsBox) => Widget.CenterBox({
		children: [
			Padding(windowName),
			Widget.Box({
				vertical: true,
				children: [
					PopupRevealer(windowName, Gtk.RevealerTransitionType.SLIDE_DOWN, child),
					Padding(windowName),
				],
			}),
			Padding(windowName),
		],
	}),
	'top right': (windowName: string, child: AgsBox) => Widget.Box({
		children: [
			Padding(windowName),
			Widget.Box({
				hexpand: false,
				vertical: true,
				children: [
					PopupRevealer(windowName, Gtk.RevealerTransitionType.SLIDE_LEFT, child),
					Padding(windowName),
				],
			}),
		],
	}),
	'bottom right': (windowName: string, child: AgsBox) => Widget.Box({
		children: [
			Padding(windowName),
			Widget.Box({
				hexpand: false,
				vertical: true,
				children: [
					Padding(windowName),
					PopupRevealer(windowName, Gtk.RevealerTransitionType.SLIDE_LEFT, child),
				],
			}),
		],
	}),
};

export type PopupWindowProps = {
	layout?: "center" | "top" | "top right" | "bottom right";
	expand?: boolean;
	name: string;
	content: AgsBox
} & WindowProps;

export default ({
	layout = 'center',
	expand = true,
	name,
	content,
	...rest
}: PopupWindowProps) => Widget.Window({
	name,
	child: layouts[layout](name, content, expand),
	popup: true,
	visible: false,
	focusable: true,
	...rest,
});
