import GObject, { GLib, property, register } from "astal/gobject";
import { bind, exec, Gio, monitorFile, readFileAsync } from "astal";
import icons from "@lib/icons";
const path = "/sys/class/backlight/";

@register({ GTypeName: "Brightness" })
export class Brightness extends GObject.Object {
	static instance: Brightness;
	static get_default() {
		if (!this.instance) {
			this.instance = new Brightness();
		}
		return this.instance;
	}
	private interfaces: Device[] = [];
	constructor() {
		super();

		this.interfaces = exec(`bash -c "printf '%s\n' ${path}/*"`)
			.split("\n")
			.map((v) => new Device(v));

		this.interfaces.forEach((v) => {
			bind(v, "brightness").subscribe(() => {
				this.notify("brightness");
				this.notify("icon");
			});
		});
	}

	@property(Number)
	get brightness() {
		return Math.max(...this.interfaces.map((v) => v.brightness));
	}

	set brightness(percent: number) {
		if (percent < 0) percent = 0;
		if (percent > 1) percent = 1;

		this.interfaces.forEach((v) => (v.brightness = percent));
		this.notify("brightness");
		this.notify("icon");
	}

	@property(String)
	get icon() {
		const { high, low, medium } = icons.brightness;
		const thresholds = [
			{ icon: high, threshold: 70 },
			{ icon: medium, threshold: 30 },
			{ icon: low, threshold: 0 },
		];

		const find = thresholds.find(
			(threshold) => threshold.threshold <= this.brightness * 100,
		);
		return find ? find.icon : medium;
	}
}

@register({ GTypeName: "Device" })
class Device extends GObject.Object {
	@property(Number)
	declare readonly maxBrightness: number;

	@property(String)
	declare readonly interface: string;

	@property(String)
	declare readonly name: string;

	@property(Boolean)
	declare isDefault: boolean;

	private declare _brightness: number;

	constructor(int: string) {
		super();
		this.interface = int;
		this.name = int.split("/")[int.split("/").length - 1];

		this.maxBrightness = Number(exec(`bash -c "cat ${int}/max_brightness"`));
		this.brightness =
			Number(exec(`bash -c "cat ${int}/brightness"`)) / this.maxBrightness;
		monitorFile(`${int}/brightness`, async (f) => {
			const v = await readFileAsync(f);
			this._brightness = Number(v) / this.maxBrightness;
			this.notify("brightness");
		});
	}
	@property(Number)
	get brightness() {
		return this._brightness;
	}
	set brightness(percent: number) {
		const num = Math.floor(this.maxBrightness * percent);
		const params = new GLib.Variant("(ssu)", ["backlight", this.name, num]);
		Gio.DBus.system.call(
			"org.freedesktop.login1",
			"/org/freedesktop/login1/session/auto",
			"org.freedesktop.login1.Session",
			"SetBrightness",
			params,
			null,
			Gio.DBusCallFlags.NONE,
			-1,
			null,
			null,
		);
		this.notify("brightness");
	}
}
