import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import { timeout } from "astal/time";

type Props = {
  name: string;
  anim: Gtk.RevealerTransitionType;
  animDuration: number;
  anchor: Astal.WindowAnchor;
  child?: JSX.Element;
  children?: Array<JSX.Element>;
  exclusivity: Astal.Exclusivity;
};
export function PopupWindow({
  name,
  anim,
  animDuration,
  anchor,
  children,
  child,
}: Props) {
  const revealer = (
    <revealer
      transitionDuration={animDuration}
      transitionType={anim}
      setup={(self) => {
        App.connect("window-toggled", (_, win) => {
          if (win.name != name) return;
          self.revealChild = win.visible;
        });
      }}
    >
      <box className={"popupWrap"}>{child || children}</box>
    </revealer>
  ) as Gtk.Revealer;
  return (
    <window
      name={name}
      anchor={anchor}
      application={App}
      visible={false}
      keymode={Astal.Keymode.EXCLUSIVE}
      onKeyPressEvent={(self, e) => {
        if (e.get_keyval()[1] != Gdk.KEY_Escape) return;
        revealer.revealChild = false;
        timeout(animDuration, () => {
          self.visible = false;
        });
      }}
    >
      {revealer}
    </window>
  );
}
