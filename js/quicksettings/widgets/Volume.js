import { Widget, Audio } from "../../imports.js";
import { getAudioTypeIcon } from "../../utils.js";
const VolumeSlider = () => Widget.Slider({
	hexpand: true,
	drawValue: false,
	min: 0,
	max: 150,
	onChange: ({ value }) => Audio.speaker.volume = value / 100,
	connections: [[Audio, self => {
		// Audio.speaker and Audio.microphone can be undefined
		// to workaround this use the ? chain operator
		self.value = Audio.speaker?.volume * 100 || 0;
	}, 'speaker-changed']],
});

const TypeIndicator = () => Widget.Button({
	onClicked: () => Audio.speaker.isMuted = !Audio.speaker.isMuted,
	child: Widget.Icon({
		connections: [[Audio, icon => {
			if (!Audio.speaker)
				return;

			icon.icon = getAudioTypeIcon(Audio.speaker.iconName);
			icon.tooltipText = `Volume ${Math.floor(Audio.speaker.volume * 100)}%`;
		}, 'speaker-changed']],
	}),
});

export default () => Widget.Box({
	className: "slider",
	children: [
		TypeIndicator(),
		VolumeSlider()
	]
})
