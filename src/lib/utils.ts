import icons from "../icons.js";
import GLib from "gi://GLib?version=2.0";

export function range(length: number, start: number = 0): number[] {
	return Array.from({ length }).map((_, i) => i + start);
}

export function getVolumeIcon(volume: number) {
	const { high, low, muted, medium, overamplified } = icons.audio.volume;
	const thresholds = [
		{ icon: overamplified, threshold: 101 },
		{ icon: high, threshold: 70 },
		{ icon: medium, threshold: 30 },
		{ icon: low, threshold: 1 },
		{ icon: muted, threshold: 0 },
	];

	const find = thresholds.find((threshold) => threshold.threshold <= volume);
	return find ? find.icon : medium;
}

export function getBatteryIcon(batteryPercent: number, charging: boolean) {
	const floorTen = Math.floor(batteryPercent / 10) * 10; // 45 -> 40 29 -> 20 34 -> 30

	if (!charging) {
		switch (floorTen) {
			case 0:
				return "󰂎";
			case 10:
				return "󰁺";
			case 20:
				return "󰁻";
			case 30:
				return "󰁼";
			case 40:
				return "󰁽";
			case 50:
				return "󰁾";
			case 60:
				return "󰁿";
			case 70:
				return "󰂀";
			case 80:
				return "󰂁";
			case 90:
				return "󰂂";
			case 100:
				return "󰁹";
		}
	} else {
		switch (floorTen) {
			case 0:
				return "󰢜";
			case 10:
				return "󰂆";
			case 20:
				return "󰂆";
			case 30:
				return "󰂇";
			case 40:
				return "󰂈";
			case 50:
				return "󰢝";
			case 60:
				return "󰂉";
			case 70:
				return "󰢞";
			case 80:
				return "󰂊";
			case 90:
				return "󰂋";
			case 100:
				return "󰂅";
		}
	}
	/* eslint-enable */
}

export function getAudioTypeIcon(icon: string) {
	const substitues = [
		["audio-headset-bluetooth", icons.audio.type.headset],
		["audio-card-analog-usb", icons.audio.type.speaker],
		["audio-card-analog-pci", icons.audio.type.card],
	];

	for (const [from, to] of substitues) {
		if (from === icon) return to;
	}

	return icon;
}

/** @param img path to img*/
export function blurImg(img: string) {
	const cache = Utils.CACHE_DIR + "/media";
	return new Promise((resolve) => {
		if (!img) resolve("");

		const dir = cache + "/blurred";
		const blurred = dir + img.substring(cache.length) + ".png";

		if (GLib.file_test(blurred, GLib.FileTest.EXISTS)) return resolve(blurred);

		Utils.ensureDirectory(dir);
		Utils.execAsync(["convert", img, "-blur", "0x22", blurred])
			.then(() => resolve(blurred))
			.catch(() => resolve(""));
	});
}

export async function sh(cmd: string | string[]) {
	return Utils.execAsync(cmd).catch((err) => {
		console.error(typeof cmd === "string" ? cmd : cmd.join(" "), err);
		return "";
	});
}

export async function bash(cmd: string | string[]) {
	return Utils.execAsync(
		`bash -c "${typeof cmd === "string" ? cmd : cmd.join("")}"`,
	).catch((err) => {
		console.error(typeof cmd === "string" ? cmd : cmd.join(" "), err);
		return "";
	});
}
