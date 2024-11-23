import { GLib, Variable } from "astal";
const interval = 5000;

export const distro = GLib.get_os_info("ID");

export const distroIcon = (() => {
  /* eslint-disable */
  switch (distro) {
    case "fedora":
      return "";
    case "arch":
      return "";
    case "nixos":
      return "";
    case "debian":
      return "";
    case "opensuse-tumbleweed":
      return "";
    case "ubuntu":
      return "";
    case "endeavouros":
      return "";
    default:
      return "";
  }
  /* eslint-enable */
})();

export const cpu = Variable(0).poll(interval, "top -b -n 1", (out) =>
  divide([
    "100",
    out
      .split("\n")
      .find((line) => line.includes("Cpu(s)"))
      ?.split(/\s+/)[1]
      .replace(",", ".") || "0",
  ]),
);

export const ram = Variable(0).poll(interval, "free", (out) =>
  divide(
    out
      .split("\n")
      .find((line) => line.includes("Mem:"))
      ?.split(/\s+/)
      .splice(1, 2) || ["1", "1"],
  ),
);

export const uptime = Variable("").poll(60_000, "cat /proc/uptime", (line) => {
  const uptime = Number.parseInt(line.split(".")[0]) / 60;

  const h = Math.floor(uptime / 60);
  const s = Math.floor(uptime % 60);
  return `${h}:${s < 10 ? "0" + s : s}`;
});

const divide = ([total, free]: [string, string] | string[]) =>
  Number.parseInt(free) / Number.parseInt(total);

export const xdgConfig = GLib.getenv("XDG_CONFIG_HOME") as string;
export const xdgCache = GLib.getenv("XDG_CACHE_HOME") as string;
export const xdgData = GLib.getenv("XDG_DATA_HOME") as string;
export const xdgHome = GLib.get_home_dir();
