import { Gtk } from "astal/gtk3";
import { Binding, Variable } from "astal";
import icons from "@lib/icons";

export function Menu({
	opened,
	name,
	child,
	children,
}: {
	name: string;
	children?: Array<JSX.Element>;
	child?: JSX.Element;
	opened: Binding<string>;
}) {
	return (
		<revealer
			transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
			transitionDuration={200}
			revealChild={opened.as((v) => name == v)}
		>
			<box className="menu" vertical>
				{child || children}
			</box>
		</revealer>
	);
}

export function Arrow({
	name,
	opened,
	activate,
}: {
	name: string;
	opened: Variable<string>;
	activate?: () => void;
}) {
	return (
		<button
			className="arrow"
			onClick={() => {
				opened.set(name === opened().get() ? "" : name);
				if (activate) activate();
			}}
			setup={(self) => {
				opened.subscribe((v) => {
					self.toggleClassName("opened", v === name);
				});
			}}
		>
			<icon icon={icons.ui.arrowRight} className="icon" />
		</button>
	);
}
