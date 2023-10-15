import { DateButton } from "./buttons/DateButton.js";
import { Workspaces } from "./buttons/Workspaces.js"
import { Separator } from "../misc/Separator.js";
import { PowerButton } from "./buttons/PowerButton.js";
import { Widget } from "../imports.js";
import { SysStatus } from "./buttons/SysStatus.js";



export default monitor => Widget.Window({
	name: `bar${monitor}`,
	monitor,
	exclusive: true,
	anchor: ["top", "left", "right"],
	margin: [5, 10],
	child: Widget.CenterBox({
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

const Start = () => Widget.Box({
	className: 'start',
	children: [
		SeparatorDot(),
		Workspaces({
			indicator: () => Widget.Box({
				className: "indicator",
				valign: "center",
				child: Widget.Box({ className: "fill" })
			})
		})
	]
})

const Center = () => Widget.Box({
	className: 'center',
	children: [
		SeparatorDot(),
		DateButton(),
		SeparatorDot()
	],
})

const End = () => Widget.Box({
	className: 'end',
	children: [
		Widget.Box({ hexpand: true }),
		SysStatus(),
		SeparatorDot(),
		PowerButton()
	]
})
