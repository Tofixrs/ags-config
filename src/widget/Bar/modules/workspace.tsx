import { bind, Binding, Variable } from "astal";
import { Gtk } from "astal/gtk3";
import { range } from "@lib/utils";
import Hyprland from "gi://AstalHyprland";
const minWorkspaces = 5;

export function Workspaces() {
	const hypr = Hyprland.get_default();

	function checkClasses(
		occupied: Binding<boolean>,
		focused: Binding<boolean>,
		classes: Variable<string[]>,
	) {
		const o = occupied.get();
		const f = focused.get();

		if (o && f) classes.set(["workspace", "focused", "occupied"]);
		if (f && !o) classes.set(["workspace", "focused"]);
		if (!f && o) classes.set(["workspace", "occupied"]);
		if (!f && !o) classes.set(["workspace"]);
	}
	return (
		<box className="workspaces module">
			{bind(hypr, "workspaces").as((wss) => {
				return wss
					.filter((ws) => !(ws.id >= -99 && ws.id <= -2))
					.sort((a, b) => a.id - b.id)
					.map((ws) => {
						const occupied = bind(ws, "clients").as((v) => v.length > 0);
						const focused = bind(hypr, "focusedWorkspace").as((v) => v == ws);

						const classes = Variable(["workspace"]);
						checkClasses(occupied, focused, classes);

						focused.subscribe(() => {
							checkClasses(occupied, focused, classes);
						});
						occupied.subscribe(() => {
							checkClasses(occupied, focused, classes);
						});

						return (
							<button
								className={bind(classes).as((v) => v.join(" "))}
								valign={Gtk.Align.CENTER}
								onClick={() => ws.focus()}
							></button>
						);
					});
			})}
		</box>
	);
}
