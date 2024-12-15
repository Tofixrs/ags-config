import { ConstructProps, Gtk, astalify, Widget } from "astal/gtk3";
import GObject from "gi://GObject?version=2.0";

export class RegularWindow extends astalify(Gtk.Window) {
	static {
		GObject.registerClass(this);
	}

	constructor(
		props: ConstructProps<RegularWindow, Gtk.Window.ConstructorProps>,
	) {
		super(props as any);

		this.connect("delete-event", () => {
			this.hide();
			return true;
		});
	}
}

export const Image = astalify(Gtk.Image);
