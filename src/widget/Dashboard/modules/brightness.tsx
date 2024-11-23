import { Brightness as BrightnessService } from "src/services/Brightness";
import { bind } from "astal";

export function Brightness() {
	return (
		<box className="brightness">
			<BrightnessIcon />
			<BrightnessSlider />
		</box>
	);
}

function BrightnessSlider() {
	const brightness = BrightnessService.get_default();
	return (
		<slider
			className="brightness-slider"
			hexpand
			draw_value={false}
			value={bind(brightness, "brightness")}
			setup={(self) => {
				self.connect("dragged", () => {
					brightness.brightness = self.value;
				});
			}}
		/>
	);
}

function BrightnessIcon() {
	const brightness = BrightnessService.get_default();
	return (
		<button>
			<icon icon={bind(brightness, "icon")} />
		</button>
	);
}
