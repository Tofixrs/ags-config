import Widget from "resource:///com/github/Aylur/ags/widget.js";
import RegularWindow from "../globalWidgets/RegularWindow.js";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import { clipboard, utils } from "../lib/index.js";
import Gtk from "gi://Gtk?version=3.0";
import Gtk30 from "gi://Gtk?version=3.0";
import { exec } from "resource:///com/github/Aylur/ags/utils.js";
import GLib20 from "gi://GLib?version=2.0";

const history = Variable<clipboard.HistEntry[]>([], {
	poll: [1000000, () => clipboard.getHistory()],
});

//very cursed solution lol
App.connect("window-toggled", (_, name, visible) => {
	if (name != "clipboard" && !visible) return;

	const window = App.getWindow("clipboard");
	if (!window) return;

	history.setValue(clipboard.getHistory());

	utils.sh("hyprctl cursorpos").then((out) => {
		const [x, y] = out.split(", ");

		utils.sh(`hyprctl keyword windowrulev2 "move ${x} ${y}, title:clipboard"`);
	});
});

function Header() {
	return Widget.Box({
		children: [
			Widget.Label("Clipboard"),
			Widget.Box({ hexpand: true }),
			Widget.Button({
				label: "Clear all",
				on_clicked: () => {
					clipboard.wipe();

					App.closeWindow("clipboard");
				},
			}),
		],
	});
}

function Entries() {
	return Widget.Scrollable({
		hscroll: "never",
		vscroll: "automatic",
		hexpand: true,
		height_request: 500,
		maxContentWidth: 500,
		child: Widget.Box({
			class_name: "entries",
			vertical: true,
		}).hook(history, (self) => (self.children = history.value.map(Entry))),
	});
}

function Entry(hist: clipboard.HistEntry) {
	if (hist.isImage()) {
		utils.bash(`mkdir -p /tmp/ags/hist`);
		if (
			!GLib20.file_test(
				`/tmp/ags/hist/${hist.id}.${hist.getImageType()}`,
				GLib20.FileTest.EXISTS,
			)
		) {
			exec(
				`bash -c "cliphist decode ${hist.id} >> /tmp/ags/hist/${hist.id}.${hist.getImageType()}"`,
			);
		}
	}
	const label = Widget.Label({
		label: hist.text,
		wrap: true,
		max_width_chars: 40,
		hexpand: true,
		halign: Gtk.Align.START,
	});

	const content = hist.isImage()
		? Gtk30.Image.new_from_file(
				`/tmp/ags/hist/${hist.id}.${hist.getImageType()}`,
			)
		: label;

	return Widget.EventBox({
		class_name: "entry",
		on_primary_click: () => {
			hist.copy();

			App.closeWindow("clipboard");
		},
		child: Widget.Box({
			children: [
				content,
				Widget.Box({
					vertical: true,
					children: [
						Widget.Button({
							class_name: "trash_button",
							label: "󰩺",
							hpack: "center",
							vpack: "center",
							on_clicked: () => {
								hist.removeEntry();
								history.setValue(clipboard.getHistory());
							},
						}),
					],
				}),
			],
		}),
	});
}

export function Clipboard() {
	return RegularWindow({
		name: "clipboard",
		title: "clipboard",
		resizable: false,
		css: "padding: 1px",
		setup(win) {
			win.on("delete-event", () => {
				win.hide();
				return true;
			});
			win.set_default_size(300, 400);
		},
		child: Widget.Box({
			class_name: "clipboard",
			vertical: true,
			setup: (self) => self.show_all(),
			children: [Header(), Entries()],
		}),
	});
}
