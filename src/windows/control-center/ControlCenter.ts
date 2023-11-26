import { Widget } from "resource:///com/github/Aylur/ags/widget.js";
import { Volume } from "./modules/Volume.js";
import PopupWindow from "../../global_modules/PopupWindow.js";
import { Gtk } from "gi://Gtk";
import { ToggleSwitches } from "./modules/ToggleSwitches.js";

export function Group(children: Gtk.Widget[]) {
  return Widget.Box({
    class_names: ["group"],
    vertical: true,
    children,
  });
}

export function ControlCenter() {
  return PopupWindow({
    name: "controlcenter",
    layout: "top right",
    anchor: ["top", "right"],
    content: Widget.Box({
      vertical: true,
      class_names: ["controlcenter"],
      children: [Group([Volume()]), ToggleSwitches([["network", "bluetooth"]])],
    }),
  });
}
