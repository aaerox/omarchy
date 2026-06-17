import GLib from "gi://GLib";
import GObject from "ags/gobject";

const SENSOR_LABEL = "T_Sensor";
const POLL_INTERVAL_MS = 5000;

function findSensorPath(): string | null {
  const hwmonBase = "/sys/class/hwmon";
  try {
    const dir = GLib.Dir.open(hwmonBase, 0);
    let name: string | null;
    while ((name = dir.read_name()) !== null) {
      const hwmonDir = `${hwmonBase}/${name}`;
      for (let i = 1; i <= 16; i++) {
        const labelPath = `${hwmonDir}/temp${i}_label`;
        try {
          const [lok, lcontents] = GLib.file_get_contents(labelPath);
          if (lok && lcontents) {
            const label = new TextDecoder().decode(lcontents).trim();
            if (label === SENSOR_LABEL) {
              return `${hwmonDir}/temp${i}_input`;
            }
          }
        } catch {
          continue;
        }
      }
    }
  } catch (e) {
    console.error("Failed to enumerate hwmon devices:", e);
  }
  return null;
}

export class Temperature extends GObject.Object {
  static {
    GObject.registerClass(
      {
        Properties: {
          temperature: GObject.ParamSpec.double(
            "temperature",
            "",
            "",
            GObject.ParamFlags.READWRITE,
            -273,
            200,
            0
          ),
        },
      },
      this
    );
  }

  private static instance: Temperature;

  #temperature: number = 0;
  #timeoutId: number | null = null;
  #sensorPath: string | null = null;

  get temperature(): number {
    return this.#temperature;
  }

  set temperature(value: number) {
    if (this.#temperature !== value) {
      this.#temperature = value;
      this.notify("temperature");
    }
  }

  constructor() {
    super();
    this.#sensorPath = findSensorPath();
    if (!this.#sensorPath) {
      console.error(`Temperature sensor with label "${SENSOR_LABEL}" not found`);
    }
    this.#poll();
    this.#startPolling();
  }

  public static getDefault(): Temperature {
    if (!this.instance) {
      this.instance = new Temperature();
    }
    return this.instance;
  }

  #poll(): void {
    try {
      if (!this.#sensorPath) return;
      const [ok, contents] = GLib.file_get_contents(this.#sensorPath);
      if (ok && contents) {
        const millidegrees = parseInt(
          new TextDecoder().decode(contents).trim(),
          10
        );
        this.temperature = Math.round(millidegrees / 1000);
      }
    } catch (e) {
      console.error("Failed to read temperature sensor:", e);
    }
  }

  #startPolling(): void {
    this.#timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, POLL_INTERVAL_MS, () => {
      this.#poll();
      return GLib.SOURCE_CONTINUE;
    });
  }
}
