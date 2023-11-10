import { DateButton } from "./buttons/DateButton.js";
import { Workspaces } from "./buttons/Workspaces.js"
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
		class_name: "panel",
		startWidget: Start(),
		centerWidget: Center(),
		endWidget: End(),
	})
})

const SeparatorDot = (service, condition) => Widget.MySeparator({
	orientation: 'vertical',
	valign: 'center',
	connections: service && [[service, dot => dot.visible = condition()]] || null,
});

const Start = () => Widget.Box({
	class_name: 'start',
	children: [
		SeparatorDot(),
		Workspaces({
			indicator: () => Widget.Box({
				class_name: "indicator",
				valign: "center",
				hexpand: false,
				child: Widget.Box({ class_name: "fill" })
			})
		})
	]
})

const Center = () => Widget.Box({
	class_name: 'center',
	children: [
		SeparatorDot(),
		DateButton(),
		SeparatorDot()
	],
})

const End = () => Widget.Box({
	class_name: 'end',
	children: [
		Widget.Box({ hexpand: true }),
		SysStatus(),
		SeparatorDot(),
		PowerButton()
	]
})
