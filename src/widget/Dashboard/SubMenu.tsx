import { Binding, Variable } from "astal";
import { Arrow } from "../SubMenu";

export function ArrowToggleButton({
	child,
	children,
	condition,
	deactivate,
	activate,
	opened,
	name,
	activateOnArrow,
}: {
	name: string;
	child?: JSX.Element;
	children?: JSX.Element[];
	opened: Variable<string>;
	activate: () => void;
	deactivate: () => void;
	condition: Binding<boolean>;
	activateOnArrow: boolean;
	className?: Binding<string | undefined> | string;
}) {
	return (
		<box
			className="toggle-button"
			setup={(self) => {
				self.toggleClassName("active", condition.get());
				condition.subscribe((v) => {
					self.toggleClassName("active", v);
				});
			}}
		>
			<button
				className="btn"
				onClick={() => {
					if (condition.get()) {
						deactivate();
						if (opened().get() == name) opened.set("");
					} else {
						activate();
					}
				}}
			>
				<box hexpand>{child || children}</box>
			</button>
			<Arrow
				name={name}
				opened={opened}
				activate={activateOnArrow ? activate : undefined}
			/>
		</box>
	);
}
