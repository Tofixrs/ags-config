import { Gtk } from "astal/gtk3";
import { Binding } from "astal";

export function SepDot({
  visible,
}: {
  visible?: Binding<boolean | undefined> | boolean;
}) {
  return (
    <box className="sep-dot" valign={Gtk.Align.CENTER} visible={visible} />
  );
}

export function Sep({
  visible,
}: {
  visible?: Binding<boolean | undefined> | boolean;
}) {
  return (
    <box className="sep" hexpand valign={Gtk.Align.CENTER} visible={visible} />
  );
}
