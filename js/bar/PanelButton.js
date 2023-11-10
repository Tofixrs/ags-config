import { Widget } from "../imports.js";

export const PanelButton = ({ class_name, content, ...props }) => Widget.Button({
	class_name: `panel-button ${class_name}`,
	child: Widget.Box({ child: content }),
	...props
})
