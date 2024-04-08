import Widget from "resource:///com/github/Aylur/ags/widget.js";
import RegularWindow from "../globalWidgets/RegularWindow.js";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import { clipboard, utils } from "../lib/index.js";

const history = Variable<clipboard.HistEntry[]>([], {
	poll: [500, () => clipboard.getHistory()],
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
	return Widget.Box({
		class_name: "entries",
		vertical: true,
	}).hook(history, (self) => (self.children = history.value.map(Entry)));
}

function Entry(hist: clipboard.HistEntry) {
	return Widget.EventBox({
		class_name: "entry",
		on_primary_click: () => {
			hist.copy();

			App.closeWindow("clipboard");
		},
		child: Widget.Box({
			children: [
				Widget.Label({
					label: hist.text,
					wrap: true,
					max_width_chars: 40,
					hexpand: true,
				}),
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
								console.log("e");

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
