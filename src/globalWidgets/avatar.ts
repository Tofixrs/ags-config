import GLib from "gi://GLib";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { BoxProps } from "types/widgets/box";
import App from "resource:///com/github/Aylur/ags/app.js";

const HOME = GLib.get_home_dir();

export default (props?: BoxProps) => {
	let face: string;
	if (GLib.file_test(`${HOME}/.face`, GLib.FileTest.EXISTS)) {
		face = `${HOME}/.face`;
	} else {
		face = App.configDir + "/.face";
	}
	return Widget.Box({
		...props,
		class_name: "avatar",
		vpack: "center",
		hpack: "center",
		css: `background-image: url('${face}'); background-size: cover`,
	});
};
