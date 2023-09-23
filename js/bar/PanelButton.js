const { Box, Button } = ags.Widget;

export const PanelButton = ({ className, content, ...props }) => Button({
	className: `panel-button ${className}`,
	child: Box({ child: content }),
	...props
})
