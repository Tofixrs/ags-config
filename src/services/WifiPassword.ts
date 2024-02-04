import App from "resource:///com/github/Aylur/ags/app.js";
import Service from "resource:///com/github/Aylur/ags/service.js";
import { execAsync } from "resource:///com/github/Aylur/ags/utils.js";

class WifiPassword extends Service {
	static {
		Service.register(
			this,
			{},
			{
				password: ["string", "w"],
				title: ["string", "rw"],
			},
		);
	}
	private password: string = "";
	private _title: string = "";
	private bssid: string = "";
	private ssid: string = "";
	public get title(): string {
		return this._title;
	}
	public set title(value: string) {
		this._title = value;
		this.notify("title");
	}

	constructor() {
		super();
	}
	async connectWifi(bssid: string, ssid: string) {
		this.bssid = bssid;
		this.ssid = ssid;
		const connected = !(
			await execAsync(`nmcli device wifi connect ${this.bssid}`).catch(
				(err) => err,
			)
		).startsWith("Error");

		if (connected) return this.flush();

		this.title = `Password for ${this.ssid}`;
		App.toggleWindow("password-input");
	}
	async connectWithPassword(password: string) {
		this.password = password;
		const connected = !(
			await execAsync(
				`nmcli d w connect ${this.bssid} password ${this.password}`,
			).catch((err) => err)
		).startsWith("Error");
		if (connected) return this.flush();

		this.title = `Wrong password for ${this.ssid}`;
		this.password = "";
		App.toggleWindow("password-input");
	}

	flush() {
		this.password = "";
		this.title = "";
		this.bssid = "";
		this.ssid = "";
	}
}

export default new WifiPassword();
