import { bind } from "astal";
import { Gtk } from "astal/gtk3";
import { range } from "@lib/utils";
import Hyprland from "gi://AstalHyprland";
const minWorkspaces = 5;

export function Workspaces() {
  const hypr = Hyprland.get_default();
  return (
    <box className="workspaces module">
      {range(10, 1).map((i) => {
        const workspace = bind(hypr, "focusedWorkspace").as(() =>
          hypr.get_workspace(i),
        );
        const visible = workspace.as(
          (v) => v != undefined || i <= minWorkspaces,
        );
        const classes = workspace
          .as((v) => {
            const res: string[] = ["workspace"];
            if (!v) return res;
            if (v.clients.length > 0) res.push("occupied");
            if (hypr.focusedWorkspace == v) res.push("focused");
            return res;
          })
          .as((v) => v.join(" "));
        return (
          <button
            visible={visible}
            className={classes}
            onClick={() => hypr.workspaces[i].focus()}
            valign={Gtk.Align.CENTER}
          ></button>
        );
      })}
    </box>
  );
}
