import { Widget } from "../imports.js";

export const PanelButton = ({ className, content, ...props }) => Widget.Button({
	className: `panel-button ${className}`,
	child: Widget.Box({ child: content }),
	...props
})
