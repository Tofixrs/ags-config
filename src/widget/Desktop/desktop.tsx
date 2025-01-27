import { App, Astal, Gdk } from "astal/gtk3";
import { visibleOnEmptyWorkspace } from "@lib/window";
import { Cpu, Ram } from "../sysMonitors";
import { bash } from "@lib/utils";
import { Time } from "../time";

type DesktopProps = {
	monitor?: Gdk.Monitor;
	layer: Astal.Layer;
};

function Desktop({ monitor, layer }: DesktopProps) {
	const exclusivity = (() => {
		switch (layer) {
			case Astal.Layer.TOP: {
				return Astal.Exclusivity.IGNORE;
			}
			case Astal.Layer.BOTTOM: {
				return Astal.Exclusivity.NORMAL;
			}
		}
	})();
	return (
		<window
			layer={layer}
			className={"desktop"}
			visible={monitor ? visibleOnEmptyWorkspace(monitor) : false}
			anchor={
				Astal.WindowAnchor.TOP |
				Astal.WindowAnchor.BOTTOM |
				Astal.WindowAnchor.LEFT |
				Astal.WindowAnchor.RIGHT
			}
			exclusivity={exclusivity}
			application={App}
			gdkmonitor={monitor}
		>
			<centerbox className={"columns"} margin={25}>
				<Start />
				<Center />
				<box></box>
			</centerbox>
		</window>
	);
}

function Start() {
	return (
		<box vertical hexpand className="column">
			<eventbox onClick={() => bash("$TERMINAL -e 'btop'")} className="bg">
				<box>
					<S />
					<Cpu />
					<S />
					<Ram />
					<S />
				</box>
			</eventbox>
		</box>
	);
}

function Center() {
	return (
		<box vertical hexpand className={"column"}>
			<box className="desktop-clock" vertical>
				<Time format="%H:%M:%S" />
				<Time format="%e %B %A" />
			</box>
		</box>
	);
}

const S = () => <box hexpand />;
const VS = () => <box vexpand />;

export const BottomDesktop = (monitor: Gdk.Monitor) =>
	Desktop({ monitor, layer: Astal.Layer.BOTTOM });
