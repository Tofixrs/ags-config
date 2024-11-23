import { GLib } from "astal";
import { xdgHome } from "@lib/consts";
import { Gtk } from "astal/gtk3";

export function Avatar() {
  let face: string = "";
  if (GLib.file_test(`${xdgHome}/.face`, GLib.FileTest.EXISTS)) {
    face = `${xdgHome}/.face`;
  }

  return (
    <box
      className="avatar"
      valign={Gtk.Align.CENTER}
      css={`
        background-image: url("${face}");
        background-size: cover;
      `}
    ></box>
  );
}
