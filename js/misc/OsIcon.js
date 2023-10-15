import { Widget, Utils } from "../imports.js"

export const FontIcon = ({ icon = "", ...props }) => Widget.Label({
	label: icon,
	halign: 'center',
	valign: 'center',
	...props
})

export const DistroIcon = props => FontIcon({
	...props,
	className: "distro-icon",
	icon: (() => {
		const distro = Utils.exec(`bash -c "cat /etc/os-release | grep '^ID' | head -n 1 | cut -d '=' -f2"`)
			.toLowerCase();

		switch (distro) {
			case 'fedora': return '';
			case 'arch': return '';
			case 'nixos': return '';
			case 'debian': return '';
			case 'opensuse-tumbleweed': return '';
			case 'ubuntu': return '';
			case 'endeavouros': return '';
			default: return '';
		}
	})(),
});
