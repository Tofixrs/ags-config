import Audio from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Battery from "gi://AstalBattery";
import { bind } from "astal";

export function Status() {
  return (
    <box className="status module">
      <Wifi />
      <Volume />
      <BatteryLevel />
    </box>
  );
}

function Wifi() {
  const { wifi } = Network.get_default();

  return (
    <icon
      tooltipText={bind(wifi, "ssid").as(String)}
      className="wifi"
      icon={bind(wifi, "iconName")}
    />
  );
}

export function Volume() {
  const speaker = Audio.get_default()?.audio.default_speaker!;
  return (
    <box>
      <eventbox
        onScroll={(_, e) => {
          speaker.set_volume(speaker.volume + e.delta_y / -30);
        }}
      >
        <circularprogress
          className="volume"
          tooltipText={bind(speaker, "volume").as((v) => (v * 100).toFixed(0))}
          value={bind(speaker, "volume")}
          startAt={0}
          end_at={1}
        >
          <box>
            <icon icon={bind(speaker, "volumeIcon")} className="icon" />
          </box>
        </circularprogress>
      </eventbox>
    </box>
  );
}

function BatteryLevel() {
  const bat = Battery.get_default();

  return (
    <box
      className="battery"
      visible={bind(bat, "isPresent")}
      tooltipText={bind(bat, "percentage").as(
        (p) => `${Math.floor(p * 100)} %`,
      )}
    >
      <icon icon={bind(bat, "batteryIconName")} />
    </box>
  );
}
