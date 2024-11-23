import { App, Astal, Gtk } from "astal/gtk3";
import { PopupWindow } from "../PopupWindow";
import { Header } from "./modules/header";
import { AstalIO, timeout, Variable } from "astal";
import { Volume } from "./modules/volume";
import { Brightness } from "./modules/brightness";
import { ToggleSwitch } from "./modules/ToggleSwitch";

export const openMenu = Variable("");
let currTimeout: AstalIO.Time | undefined;

App.connect("window-toggled", (_, v) => {
	if (v.name != "dashboard") return;
	if (v.visible) {
		currTimeout?.cancel();
		currTimeout = undefined;
		return;
	}
	if (currTimeout) {
		currTimeout.cancel();
		currTimeout = undefined;
	}
	currTimeout = timeout(1000, () => openMenu.set(""));
});

export function Dashboard() {
	return (
		<PopupWindow
			name="dashboard"
			exclusivity={Astal.Exclusivity.IGNORE}
			anchor={Astal.WindowAnchor.BOTTOM}
			animDuration={200}
			anim={Gtk.RevealerTransitionType.SLIDE_UP}
		>
			<box className="dashboard" vertical>
				<Group>
					<Header />
				</Group>
				<Group>
					<Volume />
					<Brightness />
				</Group>
				<Group>
					<ToggleSwitch />
				</Group>
			</box>
		</PopupWindow>
	);
}

function Group({
	child,
	children,
}: {
	child?: JSX.Element;
	children?: JSX.Element[];
}) {
	return (
		<box className="group" vertical>
			{child || children}
		</box>
	);
}
