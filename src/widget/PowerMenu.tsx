import { PAction, PowerAction, PowerMenuService } from "src/services/PowerMenu";
import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import icons from "@lib/icons";

function SysButton({ icon, action }: { icon: string; action: PAction }) {
	return (
		<button
			onClick={() => PowerMenuService.confirmAction(action)}
			onKeyPressEvent={(_, e) => {
				if (e.get_keycode()[1] != 36) return;
				PowerMenuService.confirmAction(action);
			}}
			className="sysButton"
		>
			<icon icon={icon} />
		</button>
	);
}

export function PowerMenu() {
	return (
		<window
			name="powerMenu"
			exclusivity={Astal.Exclusivity.IGNORE}
			keymode={Astal.Keymode.EXCLUSIVE}
			onKeyPressEvent={(self, e) => {
				if (e.get_keyval()[1] != Gdk.KEY_Escape) return;
				self.visible = false;
			}}
			anchor={
				Astal.WindowAnchor.TOP |
				Astal.WindowAnchor.BOTTOM |
				Astal.WindowAnchor.LEFT |
				Astal.WindowAnchor.RIGHT
			}
			application={App}
			visible={false}
		>
			<box
				halign={Gtk.Align.CENTER}
				valign={Gtk.Align.CENTER}
				homogeneous
				vertical
				className="powerMenu"
			>
				<box className={"row"}>
					<SysButton
						icon={icons.powermenu.shutdown}
						action={PowerAction.Shutdown}
					/>
					<SysButton
						icon={icons.powermenu.reboot}
						action={PowerAction.Reboot}
					/>
				</box>
				<box className={"row"}>
					<SysButton icon={icons.powermenu.sleep} action={PowerAction.Sleep} />
					<SysButton
						icon={icons.powermenu.logout}
						action={PowerAction.Logout}
					/>
				</box>
			</box>
		</window>
	);
}

export function Verification() {
	return (
		<window
			name="verification"
			exclusivity={Astal.Exclusivity.IGNORE}
			anchor={
				Astal.WindowAnchor.TOP |
				Astal.WindowAnchor.BOTTOM |
				Astal.WindowAnchor.LEFT |
				Astal.WindowAnchor.RIGHT
			}
			keymode={Astal.Keymode.EXCLUSIVE}
			application={App}
			visible={false}
			onKeyPressEvent={(self, e) => {
				if (e.get_keyval()[1] != Gdk.KEY_Escape) return;
				self.close();
			}}
		>
			<box
				halign={Gtk.Align.CENTER}
				valign={Gtk.Align.CENTER}
				homogeneous
				vertical
				className="verification"
			>
				<label label="You sure mate?" />
				<box halign={Gtk.Align.CENTER}>
					<button
						className="confirmBtn"
						onClick={() => {
							App.get_window("verification")?.close();
							PowerMenuService.action();
						}}
						onKeyPressEvent={(_, e) => {
							if (e.get_keycode()[1] != 36) return;
							App.get_window("verification")?.close();
							PowerMenuService.action();
						}}
					>
						Ye
					</button>
					<button
						className="confirmBtn"
						onKeyPressEvent={(_, e) => {
							if (e.get_keycode()[1] != 36) return;
							App.get_window("verification")?.close();
						}}
						onClick={() => {
							App.get_window("verification")?.close();
						}}
					>
						Nah
					</button>
				</box>
			</box>
		</window>
	);
}
