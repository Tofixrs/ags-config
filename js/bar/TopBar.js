import { DateButton } from "./buttons/DateButton.js";
import { Workspaces } from "./buttons/Workspaces.js"
import { Separator } from "../misc/Separator.js";
const { Window, CenterBox, Box } = ags.Widget;



export default monitor => Window({
	name: `bar${monitor}`,
	monitor,
	exclusive: true,
	anchor: 'top left right',
	margin: [5, 10],
	child: CenterBox({
		className: "panel",
		startWidget: Start(),
		centerWidget: Center(),
		endWidget: End(),
	})
})

const SeparatorDot = (service, condition) => Separator({
	orientation: 'vertical',
	valign: 'center',
	connections: service && [[service, dot => dot.visible = condition()]],
});

const Start = () => Box({
	className: 'start',
	children: [
		SeparatorDot(),
		Workspaces({
			indicator: () => Box({
				className: "indicator",
				valign: "center",
				child: Box({ className: "fill" })
			})
		})
	]
})

const Center = () => Box({
	className: 'center',
	children: [
		SeparatorDot(),
		DateButton(),
		SeparatorDot()
	],
})

const End = () => Box({
	className: 'end',
})
