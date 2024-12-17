import { Gtk } from "astal/gtk3";
import { Binding } from "astal";
import { Box } from "astal/gtk3/widget";

export function SepDot({
	visible,
	setup,
}: {
	visible?: Binding<boolean | undefined> | boolean;
	setup?: (self: Box) => void;
}) {
	const box = (
		<box className="sep-dot" valign={Gtk.Align.CENTER} visible={visible} />
	);
	if (setup) setup(box as Box);
	return box;
}

export function Sep({
	visible,
}: {
	visible?: Binding<boolean | undefined> | boolean;
}) {
	return (
		<box className="sep" hexpand valign={Gtk.Align.CENTER} visible={visible} />
	);
}
