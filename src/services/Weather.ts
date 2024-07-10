import Config from "../services/config.js";

class Weather extends Service {
	static {
		Service.register(
			this,
			{},
			{
				forecasts: ["jsobject"],
				selectedCity: ["jsobject"],
			},
		);
	}
	#forecasts: Forecast[] = [
		{
			weather: [{ icon: "01d" }],
			name: "Placeholder",
			main: {
				temp: 69,
			},
			id: 69,
		},
	];
	get forecasts() {
		return this.#forecasts;
	}

	private async fetch(id: number) {
		const url = "https://api.openweathermap.org/data/2.5/weather";
		const res = await Utils.fetch(url, {
			params: { id, appid: Config.config.weather.apiKey, units: "metric" },
		});
		return await res.json();
	}

	public getIconName(forecast: Forecast) {
		switch (forecast.weather[0].icon) {
			case "01d":
				return "weather-clear-symbolic";
			case "01n":
				return "weather-clear-night-symbolic";
			case "02d":
				return "weather-few-clouds-symbolic";
			case "02n":
				return "weather-few-clouds-night-symbolic";
			case "03n":
			case "03d":
				return "weather-overcast-symbolic";
			case "04n":
			case "04d":
				return "weather-overcast-symbolic";
			case "09n":
			case "09d":
				return "weather-showers-symbolic";
			case "10n":
			case "10d":
				return "weather-showers-symbolic";
			case "11n":
			case "11d":
				return "weather-storm-symbolic";
			case "13n":
			case "13d":
				return "weather-snow-symbolic";
			case "50n":
			case "50d":
				return "weather-fog-symbolic";
		}
		return "weather-clear-symbolic";
	}

	get selectedCity() {
		const found = this.#forecasts.find(
			(f) => f.id == Config.persistentData.selectedCity,
		);
		if (!found) return this.#forecasts[0];

		return found;
	}

	constructor() {
		super();

		const intervalCallback = () => {
			Promise.all(Config.config.weather.cities.map(this.fetch)).then(
				(forecasts) => {
					this.#forecasts = forecasts as Forecast[];
					this.changed("forecasts");
				},
			);
		};

		Utils.interval(1800000, intervalCallback);
	}
}

export default new Weather();

export type Forecast = {
	name: string;
	main: {
		temp: number;
	};
	weather: { icon: string }[];
	id: number;
};
