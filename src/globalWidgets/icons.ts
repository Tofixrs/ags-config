import AgsLabel from "resource:///com/github/Aylur/ags/widgets/label.js";
import GObject from "gi://GObject";
import { LabelProps } from "types/widgets/label";
import Gtk from "gi://Gtk?version=3.0";

export type FontIconProps = string | (LabelProps<object> & { icon?: string });

class FontIcon extends AgsLabel<object> {
	static {
		GObject.registerClass(this);
	}

	constructor(params: FontIconProps) {
		if (typeof params == "string") {
			super({});
		} else if (typeof params == "object") {
			const { ...rest } = params;
			super(rest);
		} else super({});
		this.toggleClassName("font-icon");

		if (typeof params === "object") this.icon = params.icon;

		if (typeof params === "string") this.icon = params;
	}

	get icon() {
		return this.label;
	}
	set icon(icon: string | undefined) {
		this.label = icon ? icon : "";
	}

	get size() {
		return this.get_style_context().get_property(
			"font-size",
			Gtk.StateFlags.NORMAL,
		);
	}

	vfunc_get_preferred_height(): [number, number] {
		return [this.size, this.size];
	}

	vfunc_get_preferred_width(): [number, number] {
		return [this.size, this.size];
	}
}

export const fontIcon = (params: FontIconProps) => new FontIcon(params);
