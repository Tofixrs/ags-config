import AgsWindow from "resource:///com/github/Aylur/ags/widgets/window.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import GObject from "gi://GObject";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import { WindowProps } from "types/widgets/window";
import Revealer, { RevealerProps } from "types/widgets/revealer";
import Box from "types/widgets/box";

const keyGrabber = Widget.Window({
	name: "key-grabber",
	popup: true,
	anchor: ["top", "left", "right", "bottom"],
	css: "background-color: transparent;",
	visible: false,
	exclusivity: "ignore",
	keymode: "on-demand",
	layer: "top",
	attribute: { list: [] as string[] },
	setup: (self) =>
		self.on("notify::visible", ({ visible }) => {
			if (!visible)
				self.attribute?.list.forEach((name) => App.closeWindow(name));
		}),
	child: Widget.EventBox({ vexpand: true }).on("button-press-event", () => {
		App.closeWindow("key-grabber");
		keyGrabber.attribute?.list.forEach((name) => App.closeWindow(name));
	}),
});

// add before any PopupWindow is instantiated
App.addWindow(keyGrabber);

export class PopupWindow extends AgsWindow<Gtk.Widget, object> {
	static {
		GObject.registerClass(this);
	}

	private revealer: Revealer<Gtk.Widget, object>;

	constructor({
		name,
		child,
		transition = "none",
		visible = false,
		...rest
	}: PopupWindowProps) {
		super({
			name,
			popup: true,
			keymode: "exclusive",
			layer: "overlay",
			class_names: ["popup-window", name],
			...rest,
		});

		child.toggleClassName("window-content");
		this.revealer = Widget.Revealer({
			transition,
			child,
			transition_duration: 200,
			setup: (self) =>
				self.hook(App, (_, wname, visible) => {
					if (wname === name) this.revealer.reveal_child = visible;
				}),
		});

		this.child = Widget.Box({
			css: "padding: 1px;",
			child: this.revealer,
		});

		this.show_all();
		this.visible = visible;

		//@ts-expect-error sus
		keyGrabber.bind("visible", this, "visible");
		keyGrabber.attribute?.list.push(name as string);
	}

	set transition(dir) {
		this.revealer.transition = dir;
	}
	get transition() {
		return this.revealer.transition;
	}
}

/** @param {import('types/widgets/window').WindowProps & {
 *      name: string
 *      child: import('types/widgets/box').default
 *      transition?: import('types/widgets/revealer').RevealerProps['transition']
 *  }} config
 */

type PopupWindowProps = WindowProps<
	Gtk.Widget,
	object,
	AgsWindow<Gtk.Widget, object>
> & {
	name: string;
	child: Box<Gtk.Widget, object>;
	transition: RevealerProps["transition"];
	visible?: boolean;
};

export default (config: PopupWindowProps) => new PopupWindow(config);
