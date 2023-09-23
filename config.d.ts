declare namespace ags {
	const Widget: AgsWidget;
	const Utils: AgsUtils;
}

type AgsWidget = {
	Box: Function,
	Window: Function,
	Button: Function,
	CenterBox: Function,
	Entry: Function,
	EventBox: Function,
	Icon: Function,
	Label: Function,
	Overlay: Function,
	ProgressBar: Function,
	Revealer: Function,
	Scrollable: Function,
	Slider: Function,
	Stack: Function,
	Menu: Function,
	MenuItem: Function,
}

type AgsUtils = {
	execAsync: (cmd: string | string[]) => void
}
