import _imports from "@girs/gjs";
import { exec, execAsync, GLib } from "astal";
import { xdgCache } from "./consts";

export function range(length: number, start: number = 0): number[] {
  return Array.from({ length }).map((_, i) => i + start);
}

export async function roundImage(path: string): Promise<string> {
  const path2 = path.split("/");
  const name = path2[path2.length - 1];
  const [width, height] = await imageSize(path);
  if (
    GLib.file_test(
      `${xdgCache}/ags/cover/${name}-done.png`,
      GLib.FileTest.EXISTS,
    )
  )
    return `${xdgCache}/ags/cover/${name}-done.png`;
  await execAsync(`bash -c "mkdir -p ${xdgCache}/ags/cover/"`);
  await execAsync(
    `magick -size ${width}x${height} xc:black -fill white -draw "roundRectangle 0,0,${width},${height},${Math.ceil(width / 2)},${Math.ceil(height / 2)}" ${xdgCache}/ags/cover/${name}-mask.png`,
  );
  await execAsync(
    `magick ${path} ${xdgCache}/ags/cover/${name}-mask.png -alpha Off -compose CopyOpacity -composite -colorspace RGB ${xdgCache}/ags/cover/${name}-done.png`,
  );
  return `${xdgCache}/ags/cover/${name}-done.png`;
}

export async function imageSize(path: string) {
  return exec(`magick identify -format "%wx%h" ${path}`)
    .split("x")
    .map((x) => Number(x));
}
