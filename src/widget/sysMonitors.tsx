import { cpu, ram } from "@lib/consts";
import { bind } from "astal";

export function Cpu() {
	return (
		<box className="stat-wrapper" vertical margin={10}>
			<circularprogress className="cpu stat" value={bind(cpu)}>
				<icon className="icon" icon="cpu-symbolic" />
			</circularprogress>
			<label label={bind(cpu).as((v) => `${(v * 100).toFixed(0)}%`)} />
		</box>
	);
}

export function Ram() {
	return (
		<box className="stat-wrapper" vertical margin={10}>
			<circularprogress className="ram stat" value={bind(ram)}>
				<icon className="icon" icon="memory-symbolic" />
			</circularprogress>
			<label label={bind(ram).as((v) => `${(v * 100).toFixed(0)}%`)} />
		</box>
	);
}
