const { Window, CenterBox } = ags.Widget;


export default monitor => Window({
	monitor,
	exclusive: true,
	anchor: ["top", "left right"],
	margin: [5, 5],
	child: CenterBox({})
})
