declare module "wttr" {
	interface Response {
		request: Request[];
		current_condition: CurrentCondition[];
		nearest_area: Area[];
		weather: Weather[];
	}
	interface Request {
		query: string;
		type: "LatLon";
	}
	interface Weather {
		astronomy: Astronomy[];
		avgtempC: string;
		date: string;
		maxtempC: string;
		mintempC: string;
		sunHour: string;
		totalSnow_c: string;
		uvIndex: string;
		hourly: Hourly[];
	}
	interface Astronomy {
		moon_ilumination: string;
		moon_phase: string;
		moonrise: string;
		moonset: string;
		sunrise: string;
		sunset: string;
	}
	interface Hourly {
		DewPointC: string;
		FeelsLikeC: string;
		HeatIndexC: string;
		WindChillC: string;
		WindGustKmph: string;
		chanceoffog: string;
		chanceoffrost: string;
		chanceofhightemp: string;
		chanceofovercasr: string;
		chanceofrain: string;
		chanceofremdry: string;
		chanceofsnow: string;
		chanceofsunshine: string;
		chanceofthunder: string;
		chanceofwindy: string;
		cloudcover: string;
		diffRad: string;
		humidity: string;
		precipMM: string;
		pressure: string;
		shortRad: string;
		tempC: string;
		time: string;
		uvIndex: string;
		visibilty: string;
		weatherCode: string;
		weatherDesc: { value: string }[];
		weatherIconUrl: { value: string }[];
		winddir16Point: string;
		winddirDegree: string;
		windSpeedKmph: string;
	}
	interface Area {
		areaName: { value: string }[];
		country: { value: string }[];
		latitude: string;
		longitude: string;
		population: string;
		region: { value: string }[];
		weatherUrl: { value: string }[];
	}
	interface CurrentCondition {
		FeelsLikeC: string;
		cloudcover: string;
		humidity: string;
		localObsDateTime: string;
		observation_time: string;
		precipMM: string;
		pressure: string;
		temp_C: string;
		uvIndex: string;
		visibilty: string;
		weatherCode: string;
		weatherDesc: { value: string }[];
		weatherIconUrl: { value: string }[];
		winddir16Point: string;
		winddirDegree: string;
		windSpeedKmph: string;
	}
}
