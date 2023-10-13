export function scssWatcher(scss, css) {
	return ags.Utils.subprocess([
		"inotifywait",
		"--recursive",
		"--event", "create,modify",
		"-m", scss,
	], () => setupCss(scss, css))
}

export function setupCss(scss, css) {
	ags.Utils.exec(`mkdir ${css}`);
	ags.Utils.exec(`sass ${scss + "/main.scss"} ${css + "/main.css"}`);
}
