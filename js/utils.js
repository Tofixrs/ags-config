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
