import icons from "./icons.js"
import { Utils } from "./imports.js";

export function scssWatcher(scss, css) {
	return Utils.subprocess([
		"inotifywait",
		"--recursive",
		"--event", "create,modify",
		"-m", scss,
	], () => setupCss(scss, css))
}

export function setupCss(scss, css) {
	Utils.exec(`mkdir ${css}`);
	Utils.exec(`sass ${scss + "/main.scss"} ${css + "/main.css"}`);
}

export function getAudioTypeIcon(icon) {
	const substitues = [
		['audio-headset-bluetooth', icons.audio.type.headset],
		['audio-card-analog-usb', icons.audio.type.speaker],
		['audio-card-analog-pci', icons.audio.type.card],
	];

	for (const [from, to] of substitues) {
		if (from === icon)
			return to;
	}

	return icon;
}
