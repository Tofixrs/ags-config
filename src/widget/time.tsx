import { GLib, Variable } from "astal";

const time = Variable<GLib.DateTime>(GLib.DateTime.new_now_local()).poll(
  1000,
  () => GLib.DateTime.new_now_local(),
);
export function Time({ format = "%H:%M - %A %e." }) {
  return (
    <label
      className="time module"
      onDestroy={() => time.drop()}
      label={time().as((v) => v.format(format)!)}
    />
  );
}
