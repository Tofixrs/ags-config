import {
	Box,
	Button,
	Icon,
	Label,
} from "resource:///com/github/Aylur/ags/widget.js";
import Weather, { Forecast } from "../../../services/Weather.js";
import { Arrow, Menu } from "../../../globalWidgets/subMenu.js";
import { S, subMenu } from "../index.js";
import Config from "../../../services/config.js";

export default () => {
	const citySubMenuContent = Box({
		vertical: true,
		class_names: ["citySubMenu"],
		children: Weather.bind("forecasts").transform((v) => {
			return v.map((v) =>
				Button({
					child: Box({
						children: [Label(v.name), S(), WeatherDisplay(v)],
					}),
					hexpand: true,
					on_clicked: () => {
						Config.persistentData = { selectedCity: v.id };
						subMenu.setValue("");
					},
				}),
			);
		}),
	});
	const Main = () =>
		Box().hook(Weather, (self) => {
			self.children = [
				WeatherDisplay(Weather.selectedCity),
				Arrow("city", subMenu),
			];
		});
	return Box({
		class_names: ["bg", "weather"],
		vertical: true,
		children: [Main(), Menu("city", [citySubMenuContent], subMenu)],
	});
};

const WeatherDisplay = (forecast: Forecast) =>
	Box({
		children: [
			Icon({
				icon: Weather.bind("forecasts").transform(() =>
					Weather.getIconName(forecast),
				),
				hexpand: true,
			}),
			Label({
				label: Weather.bind("forecasts").transform(
					() => `${forecast.main.temp}C`,
				),
				hexpand: true,
			}),
		],
	});
