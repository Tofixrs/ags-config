import GLib from "gi://GLib?version=2.0";
import { xdgConfig, xdgData } from "../variables.js";
import WeatherService from "./Weather.js";
import { Todo } from "../lib/todos.js";

interface ConfigData {
	weather: Weather;
}
interface Weather {
	apiKey: string;
	cities: number[];
	defaultCity: number;
}

interface PersistentData {
	selectedCity: number;
	todos: Day[];
}

export interface Day {
	day: number;
	month: number;
	year: number;
	tasks: Todo[];
}

const persistentDataPath = `${xdgData}/ags-config/data.json`;

class Config extends Service {
	private data: ConfigData;
	static {
		Service.register(
			this,
			{},
			{
				persistentData: ["jsobject"],
			},
		);
	}
	constructor() {
		super();

		const testConfigExists = GLib.file_test(
			"./test_config.json",
			GLib.FileTest.EXISTS,
		);
		const configPath = testConfigExists
			? `./test_config.json`
			: `${xdgConfig}/ags-config/config.json`;

		this.data = JSON.parse(Utils.readFile(configPath));
		Utils.exec(`mkdir -p ${xdgData}/ags-config`);
	}

	get persistentData(): PersistentData {
		if (!GLib.file_test(persistentDataPath, GLib.FileTest.EXISTS)) {
			return { selectedCity: this.config.weather.defaultCity, todos: [] };
		}

		return JSON.parse(Utils.readFile(persistentDataPath));
	}
	set persistentData(data: PersistentData) {
		const text = JSON.stringify(data);
		Utils.writeFileSync(text, persistentDataPath);

		this.changed("persistentData");
		WeatherService.changed("forecasts");
		WeatherService.changed("selectedCity");
	}
	get config() {
		return this.data;
	}
}

export default new Config();
