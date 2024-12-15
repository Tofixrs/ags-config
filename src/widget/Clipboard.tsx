import { getHistory, HistEntry } from "@lib/clipboard";
import { Image, RegularWindow } from "@lib/widget";
import { posAtCursor } from "@lib/window";
import { bind, exec, GLib, Variable } from "astal";
import { App } from "astal/gtk3";
import { Sep, SepDot } from "./separator";
import icons from "@lib/icons";
import { bash } from "@lib/utils";
import Gtk from "gi://Gtk?version=3.0";
import GdkPixbuf from "gi://GdkPixbuf?version=2.0";

const history = Variable<HistEntry[]>([]).poll(1000000, "echo", () =>
	getHistory(),
);

App.connect("window-toggled", (_, window) => {
	if (window.name != "clipboard" || !window.visible) return;

	history.set(getHistory());
	posAtCursor(window);
});

export function Clipboard() {
	return (
		<RegularWindow
			name="clipboard"
			title="clipboard"
			resizable={false}
			visible={false}
			application={App}
			setup={(self) => {
				self.set_default_size(400, 550);
			}}
		>
			<box
				className="clipboard"
				vertical
				setup={(self) => {
					self.show_all();
				}}
			>
				<box className="menu-title">
					<icon icon={icons.clipboard} />
					<SepDot />
					<label label="Clipboard" />
				</box>
				<Sep />
				<scrollable
					hscroll={Gtk.PolicyType.NEVER}
					vexpand
					maxContentWidth={500}
				>
					<box
						className="entries"
						vertical
						children={bind(history).as((v) => v.map(Entry))}
					/>
				</scrollable>
			</box>
		</RegularWindow>
	);
}

function Entry(hist: HistEntry) {
	if (hist.isImage()) {
		bash(`mkdir -p /tmp/ags/hist`);
		if (
			!GLib.file_test(
				`/tmp/ags/hist/${hist.id}.${hist.getImageType()}`,
				GLib.FileTest.EXISTS,
			)
		) {
			exec(
				`bash -c "cliphist decode ${hist.id} >> /tmp/ags/hist/${hist.id}.${hist.getImageType()}"`,
			);
		}
	}

	const content = {
		false: () => (
			<label
				label={hist.text}
				wrap
				max_width_chars={200}
				hexpand
				halign={Gtk.Align.START}
			/>
		),
		true: () => {
			const pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(
				`/tmp/ags/hist/${hist.id}.${hist.getImageType()}`,
				500,
				300,
				true,
			);
			return <Image pixbuf={pixbuf} />;
		},
	}[String(hist.isImage())]!();

	return (
		<eventbox
			className="entry"
			onClick={() => {
				hist.copy();

				App.get_window("clipboard")!.visible = false;
			}}
		>
			<box>
				{content}
				<box hexpand valign={Gtk.Align.CENTER} halign={Gtk.Align.END}>
					<button
						className="trash_button"
						label="󰩺"
						onClick={() => {
							hist.removeEntry();
							history.set(getHistory());
						}}
					/>
				</box>
			</box>
		</eventbox>
	);
}
