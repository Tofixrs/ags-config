export function range(length: number, start = 1) {
	return Array.from({ length }, (_, i) => i + start);
}
export function getBatteryIcon(batteryPercent: number, charging: boolean) {
	const floor = Math.floor(batteryPercent / 10); // 45 -> 40 29 -> 20 34 -> 30
	const chargingIcons = ["󰢜", "󰂆", "󰂆", "󰂇", "󰂈", "󰢝", "󰂉", "󰢞", "󰂊", "󰂋", "󰂅"];
	const icons = ["󰂎", "󰁺", "󰁻", "󰁼", "󰁽", "󰁾", "󰁿", "󰂀", "󰂁", "󰂂", "󰁹"];

	return charging ? chargingIcons[floor] : icons[floor];
	/* eslint-enable */
}
export function getVolumeIcon(volume: number) {
	const thresholds = [
		{ icon: "audio-volume-overamplified-symbolic", threshold: 101 },
		{ icon: "audio-volume-high-symbolic", threshold: 70 },
		{ icon: "audio-volume-medium-symbolic", threshold: 30 },
		{ icon: "audio-volume-low-symbolic", threshold: 1 },
		{ icon: "audio-volume-muted-symbolic", threshold: 0 },
	];

	const find = thresholds.find((threshold) => threshold.threshold <= volume);
	return find ? find.icon : "audio-volume-medium-symbolic";
}
